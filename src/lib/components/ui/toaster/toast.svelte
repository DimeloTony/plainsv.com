<script lang="ts">
	import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, LoaderCircleIcon, XIcon } from "@lucide/svelte";
	import { Button } from "#lib/components/ui/button/index.js";
	import { useCompCtx } from "./ctx.svelte.js";
	import { toastState } from "./state.svelte.js";
	import type { Attachment } from "svelte/attachments";
	import type { ToastAction, ToastItemProps } from "./index.js";
	const { toast, index, offset }: ToastItemProps = $props();
	const ctx = useCompCtx();
	// Pixels a swipe must travel to close the toast, or pixels per millisecond a shorter one must reach.
	const SWIPE_DISTANCE = 45;
	const SWIPE_VELOCITY = 0.11;
	// Pixels of movement that pick the swipe axis, and that a fast swipe must at least travel.
	const SWIPE_AXIS_THRESHOLD = 2;
	const SWIPE_MIN_FLICK = 10;
	let mounted = $state(false);
	let contentHeight = $state(0);
	// Swipe offset on each axis in pixels while the toast is dragged.
	let swipeX = $state(0);
	let swipeY = $state(0);
	let isSwiping = $state(false);
	let isSwipedOut = $state(false);
	// Milliseconds left before the toast closes, kept across pauses, and the update they were counted for.
	let remaining = 0;
	let timerUpdatedAt = 0;
	// Where and when the current press started, and the axis the swipe follows.
	let pointerStart: { x: number; y: number; time: number } | undefined;
	let swipeAxis: "x" | "y" | undefined;

	const isFront = $derived(index === 0);
	const isVisible = $derived(index < ctx.visibleToasts);
	const duration = $derived(toast.duration ?? ctx.duration);
	const showCloseButton = $derived((toast.closeButton ?? ctx.closeButton) && toast.dismissible !== false);
	const richColors = $derived(toast.richColors ?? ctx.richColors);
	const hasIcon = $derived(!!toast.icon || toast.type !== "default");

	// Report the content height to the toaster, which stacks the toasts with it.
	$effect(() => {
		const id = toast.id;
		ctx.setHeight(id, contentHeight);
		return () => ctx.removeHeight(id);
	});

	// Close the toast after its duration, holding the time left while the toasts are paused.
	$effect(() => {
		// If the toast is closing, loading, or set to stay open: there is nothing to time.
		if (toast.dismissed || toast.type === "loading" || duration === Infinity) return;
		// If the toast was created or updated since the last run: start over with the full duration.
		if (toast.updatedAt !== timerUpdatedAt) {
			timerUpdatedAt = toast.updatedAt;
			remaining = duration;
		}
		// If the toasts are hovered, focused, swiped, or the tab is hidden: hold the time left.
		if (ctx.paused) return;
		const startedAt = Date.now();
		const timer = setTimeout(() => toastState.dismiss(toast.id, true), remaining);
		return () => {
			clearTimeout(timer);
			remaining -= Date.now() - startedAt;
		};
	});

	/** Measures the toast, then marks it mounted so it slides in from its starting place. */
	const enter: Attachment<HTMLLIElement> = (node) => {
		contentHeight = node.querySelector<HTMLElement>(":scope > .toastContent")?.offsetHeight ?? 0;
		// Reading the layout applies the starting styles first, so the change to mounted animates.
		void node.offsetHeight;
		mounted = true;
	};

	/** Whether moving along the axis by `delta` heads toward a side the toast can close to. */
	function canCloseToward(axis: "x" | "y", delta: number) {
		// Vertical swipes close toward the edge the toasts stack from.
		if (axis === "y") return ctx.edge === "bottom" ? delta > 0 : delta < 0;
		// Horizontal swipes close toward the side the toasts sit on; centered toasts close either way.
		if (ctx.position.endsWith("left")) return delta < 0;
		if (ctx.position.endsWith("right")) return delta > 0;
		return true;
	}

	/** Shrinks movement toward a side the toast cannot close to, so it gives a little and springs back. */
	const dampen = (delta: number) => delta / (1 + Math.abs(delta) / 20);

	/** Starts a swipe on a press of the toast itself. */
	function handlePointerDown(e: PointerEvent & { currentTarget: HTMLLIElement }) {
		const target = e.target instanceof Element ? e.target : null;
		// Only the primary button swipes, and buttons and links inside the toast keep their clicks.
		if (e.button !== 0 || toast.dismissible === false || toast.dismissed || target?.closest("button, a, input, textarea, select")) return;
		pointerStart = { x: e.clientX, y: e.clientY, time: Date.now() };
		swipeAxis = undefined;
		e.currentTarget.setPointerCapture(e.pointerId);
		isSwiping = true;
		ctx.interacting = true;
	}

	/** Moves the toast with the pointer along the axis it first moved on. */
	function handlePointerMove(e: PointerEvent) {
		// If no swipe started on this toast: ignore the move.
		if (!pointerStart) return;
		const dx = e.clientX - pointerStart.x;
		const dy = e.clientY - pointerStart.y;
		// If the axis is not picked yet: wait for a clear move, then lock to the larger one.
		if (!swipeAxis) {
			if (Math.abs(dx) < SWIPE_AXIS_THRESHOLD && Math.abs(dy) < SWIPE_AXIS_THRESHOLD) return;
			swipeAxis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
		}
		const delta = swipeAxis === "x" ? dx : dy;
		const moved = canCloseToward(swipeAxis, delta) ? delta : dampen(delta);
		swipeX = swipeAxis === "x" ? moved : 0;
		swipeY = swipeAxis === "y" ? moved : 0;
	}

	/** Closes the toast after a long or fast swipe, or springs it back. */
	function handlePointerUp(e: PointerEvent & { currentTarget: HTMLLIElement }) {
		// If no swipe started on this toast: ignore the release.
		if (!pointerStart) return;
		const delta = swipeAxis === "x" ? swipeX : swipeY;
		const velocity = Math.abs(delta) / Math.max(Date.now() - pointerStart.time, 1);
		const axis = swipeAxis;
		pointerStart = undefined;
		isSwiping = false;
		ctx.interacting = false;
		const isFarOrFast = Math.abs(delta) >= SWIPE_DISTANCE || (Math.abs(delta) > SWIPE_MIN_FLICK && velocity > SWIPE_VELOCITY);
		// If the swipe went far or fast enough toward a closing side: fling it off and close it.
		if (axis && canCloseToward(axis, delta) && isFarOrFast) {
			const size = axis === "x" ? e.currentTarget.offsetWidth : e.currentTarget.offsetHeight;
			const fling = Math.sign(delta) * (Math.abs(delta) + size);
			if (axis === "x") swipeX = fling;
			else swipeY = fling;
			isSwipedOut = true;
			toastState.dismiss(toast.id);
			return;
		}
		swipeX = 0;
		swipeY = 0;
	}

	/** Runs a button's handler, then closes the toast unless the handler prevented the default. */
	function handleButton(e: MouseEvent, button: ToastAction) {
		button.onClick?.(e);
		if (!e.defaultPrevented) toastState.dismiss(toast.id);
	}
</script>

<!-- One toast; its place in the stack comes from the index and offset the toaster passes. -->
<li class={["toast", toast.class]} data-type={toast.type} data-rich={richColors || undefined} data-edge={ctx.edge} data-mounted={mounted} data-front={isFront} data-visible={isVisible} data-expanded={ctx.expanded} data-dismissed={toast.dismissed} data-swiping={isSwiping || undefined} data-swiped={isSwipedOut || undefined} data-size={ctx.size} data-rounded={ctx.rounded} style:--toast-index={index} style:--toast-offset="{offset}px" style:--toast-height="{contentHeight}px" style:--toast-swipe-x="{swipeX}px" style:--toast-swipe-y="{swipeY}px" {@attach enter} onpointerdown={handlePointerDown} onpointermove={handlePointerMove} onpointerup={handlePointerUp} onpointercancel={handlePointerUp}>
	<!-- Close button in the corner, when enabled. -->
	{#if showCloseButton}
		<button type="button" class="toastClose" aria-label="Close toast" onclick={() => toastState.dismiss(toast.id)}>
			<XIcon aria-hidden="true" />
		</button>
	{/if}
	<!-- Icon, text, and buttons; measured so the toaster can stack the toasts. -->
	<div bind:offsetHeight={contentHeight} class="toastContent">
		{#if hasIcon}
			<span class="toastIcon" data-spin={toast.type === "loading" || undefined} aria-hidden="true">
				{#if toast.icon}
					{@render toast.icon()}
				{:else if toast.type === "success"}
					<CircleCheckIcon />
				{:else if toast.type === "info"}
					<InfoIcon />
				{:else if toast.type === "warning"}
					<TriangleAlertIcon />
				{:else if toast.type === "error"}
					<OctagonXIcon />
				{:else if toast.type === "loading"}
					<LoaderCircleIcon />
				{/if}
			</span>
		{/if}
		<div class="toastText">
			<div class="toastTitle">{toast.title}</div>
			{#if toast.description}
				<div class="toastDescription">{toast.description}</div>
			{/if}
		</div>
		{#if toast.cancel}
			{@const cancel = toast.cancel}
			<Button size="xs" variant="secondary" onclick={(e: MouseEvent) => handleButton(e, cancel)}>{cancel.label}</Button>
		{/if}
		{#if toast.action}
			{@const action = toast.action}
			<Button size="xs" onclick={(e: MouseEvent) => handleButton(e, action)}>{action.label}</Button>
		{/if}
	</div>
</li>

<style>
	/* Base toast; sits on the stack edge and enters from past it, so it starts hidden */
	.toast {
		position: absolute;
		right: 0;
		left: 0;
		transform: translateY(calc(var(--toaster-dir) * -100%));
		translate: var(--toast-swipe-x) var(--toast-swipe-y);
		opacity: 0;
		z-index: calc(1000 - var(--toast-index));
		transition:
			transform 400ms cubic-bezier(0.215, 0.61, 0.355, 1),
			translate 400ms cubic-bezier(0.215, 0.61, 0.355, 1),
			opacity 400ms,
			height 400ms cubic-bezier(0.215, 0.61, 0.355, 1),
			box-shadow 200ms;
		box-sizing: content-box; /* so a stacked toast's height matches the front toast's content */
		outline: none;
		box-shadow: 0 4px 12px color-mix(in oklab, var(--foreground) 10%, transparent);
		border: 1px solid var(--border);
		background-color: var(--popover);
		height: var(--toast-height);
		touch-action: none;
		color: var(--popover-foreground);
		font-family: var(--font-sans, system-ui, sans-serif);
	}

	.toast[data-edge="bottom"] {
		bottom: 0;
		transform-origin: top center;
	}

	.toast[data-edge="top"] {
		top: 0;
		transform-origin: bottom center;
	}

	/* Icon, text, and buttons in a row */
	.toastContent {
		display: flex;
		align-items: center;
		transition: opacity 400ms;
		box-sizing: border-box;
	}

	.toastIcon {
		display: flex;
		flex-shrink: 0;
	}

	.toastIcon :global(svg) {
		width: 100%;
		height: 100%;
	}

	/* Loading spinner */
	.toastIcon[data-spin] :global(svg) {
		animation: toastSpin 1s linear infinite;
	}

	@keyframes toastSpin {
		to {
			rotate: 360deg;
		}
	}

	.toastText {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: calc(var(--spacing-xs) / 2);
		min-width: 0;
	}

	.toastTitle {
		font-weight: 500;
	}

	.toastDescription {
		color: var(--muted-foreground);
	}

	/* Round close button over the corner */
	.toastClose {
		display: flex;
		position: absolute;
		top: 0;
		left: 0;
		justify-content: center;
		align-items: center;
		translate: -35% -35%;
		z-index: 1;
		transition-duration: 150ms;
		transition-property: color, background-color, box-shadow;
		cursor: pointer;
		box-sizing: border-box;
		outline: none;
		border: 1px solid var(--border);
		border-radius: var(--radius-pill);
		background-color: var(--popover);
		padding: 0;
		width: 1.25rem; /* 20px */
		height: 1.25rem; /* 20px */
		color: var(--popover-foreground);
	}

	.toastClose :global(svg) {
		width: 0.75rem; /* 12px */
		height: 0.75rem; /* 12px */
	}

	.toastClose:hover {
		background-color: var(--accent);
		color: var(--accent-foreground);
	}

	/* =============== Variants =============== */

	/* Rich colors tint error toasts; the theme has no success, info, or warning tokens, so those stay neutral */
	.toast[data-rich][data-type="error"] {
		border-color: color-mix(in oklab, var(--destructive) 30%, transparent);
		background-color: color-mix(in oklab, var(--destructive) 10%, var(--popover));
		color: var(--destructive);
	}

	.toast[data-rich][data-type="error"] .toastDescription {
		color: color-mix(in oklab, var(--destructive) 80%, var(--popover));
	}

	/* =============== States =============== */

	/* Mounted; slides to its place, spread out by the heights and gaps of the toasts in front */
	.toast[data-mounted="true"] {
		transform: translateY(calc(var(--toaster-dir) * (var(--toast-offset) + var(--toast-index) * (var(--toaster-gap) + 2px))));
		opacity: 1;
	}

	/* Stacked behind the front toast: as tall as it, peeking out by the gap and shrinking with depth */
	.toast[data-mounted="true"][data-expanded="false"][data-front="false"] {
		transform: translateY(calc(var(--toaster-dir) * var(--toast-index) * var(--toaster-gap))) scale(calc(1 - var(--toast-index) * 0.05));
		height: var(--toaster-front-height);
		overflow: hidden;
	}

	.toast[data-expanded="false"][data-front="false"] .toastContent {
		opacity: 0;
	}

	/* Waiting behind the shown toasts */
	.toast[data-visible="false"] {
		opacity: 0;
		pointer-events: none;
	}

	/* Closing; fades out, and the front toast slides back past the edge */
	.toast[data-dismissed="true"] {
		opacity: 0;
		transition-duration: 200ms;
		pointer-events: none;
	}

	.toast[data-dismissed="true"][data-front="true"]:not([data-swiped]) {
		transform: translateY(calc(var(--toaster-dir) * -100%));
	}

	/* Follows the pointer without easing while dragged */
	.toast[data-swiping] {
		transition-property: transform, opacity, height, box-shadow;
	}

	/* Keyboard focus ring */
	.toastClose:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
	}

	@media (prefers-reduced-motion: reduce) {
		.toast,
		.toastContent {
			transition: none;
		}
	}

	/* =============== Sizes =============== */

	/* Large */
	.toast[data-size="lg"] .toastContent {
		gap: var(--spacing-md);
		padding: calc(var(--spacing-lg) + var(--spacing-xs)); /* 20px */
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	.toast[data-size="lg"] .toastIcon {
		width: 1.125rem; /* 18px */
		height: 1.125rem; /* 18px */
	}

	/* Medium — default */
	.toast[data-size="md"] .toastContent {
		gap: var(--spacing-sm);
		padding: var(--spacing-lg);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	.toast[data-size="md"] .toastIcon {
		width: 1rem; /* 16px */
		height: 1rem; /* 16px */
	}

	/* Small */
	.toast[data-size="sm"] .toastContent {
		gap: var(--spacing-sm);
		padding: var(--spacing-md);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	.toast[data-size="sm"] .toastIcon {
		width: 1rem; /* 16px */
		height: 1rem; /* 16px */
	}

	/* Extra small */
	.toast[data-size="xs"] .toastContent {
		gap: calc(var(--spacing-xs) * 1.5); /* 6px */
		padding: var(--spacing-sm);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	.toast[data-size="xs"] .toastIcon {
		width: 0.875rem; /* 14px */
		height: 0.875rem; /* 14px */
	}

	/* =============== Rounded =============== */

	.toast[data-rounded="xs"] {
		border-radius: var(--radius-xs);
	}

	.toast[data-rounded="sm"] {
		border-radius: var(--radius-sm);
	}

	.toast[data-rounded="md"] {
		border-radius: var(--radius-md);
	}

	.toast[data-rounded="lg"] {
		border-radius: var(--radius-lg);
	}

	.toast[data-rounded="xl"] {
		border-radius: var(--radius-xl);
	}

	.toast[data-rounded="2xl"] {
		border-radius: var(--radius-2xl);
	}

	.toast[data-rounded="3xl"] {
		border-radius: var(--radius-3xl);
	}

	.toast[data-rounded="4xl"] {
		border-radius: var(--radius-4xl);
	}

	/* A true pill; tall content can clip at the corners, so use 3xl or 4xl to stay safe */
	.toast[data-rounded="pill"] {
		border-radius: var(--radius-pill);
	}
</style>
