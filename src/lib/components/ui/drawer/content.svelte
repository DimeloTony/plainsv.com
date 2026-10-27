<script lang="ts">
	import { fade, fly } from "svelte/transition";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { Attachment } from "svelte/attachments";
	import type { ContentProps } from "./index.js";
	const { children, class: className, ...props }: ContentProps = $props();
	const ctx = useCompCtx();
	// Share of the panel size a drag must pass to close the drawer.
	const CLOSE_THRESHOLD = 0.25;
	// Pixels per millisecond a quick flick must reach to close the drawer, whatever the distance.
	const CLOSE_VELOCITY = 0.5;
	// Elements a drag must not start on, so they keep their own pointer behavior.
	const NO_DRAG_SELECTOR = "button, a, input, select, textarea, label, [contenteditable='true'], [data-no-drag]";
	// Pixels the panel is dragged toward its edge; 0 while resting.
	let dragOffset = $state(0);
	let isDragging = $state(false);
	const isVertical = $derived(ctx.direction === "top" || ctx.direction === "bottom");
	// The edge the panel closes toward is the positive direction for bottom and right drawers.
	const closeSign = $derived(ctx.direction === "bottom" || ctx.direction === "right" ? 1 : -1);
	const dragTransform = $derived(dragOffset ? (isVertical ? `translateY(${dragOffset * closeSign}px)` : `translateX(${dragOffset * closeSign}px)`) : undefined);
	// Slide the panel a full panel length in from its edge.
	const flyParams = $derived({ top: { y: "-100%" }, right: { x: "100%" }, bottom: { y: "100%" }, left: { x: "-100%" } }[ctx.direction]);

	/** Opens the modal, and returns focus to the trigger once it closes. */
	const showModal: Attachment<HTMLDialogElement> = (node) => {
		const previousFocus = document.activeElement;
		node.showModal();
		return () => {
			// If the element that opened the drawer can take focus: give it back.
			if (previousFocus instanceof HTMLElement) previousFocus.focus();
		};
	};

	/** Closes the drawer when the backdrop around the panel is clicked. */
	const handleBackdropClick = (e: MouseEvent) => {
		// If the click landed on the dialog itself and not the panel: close.
		if (e.target === e.currentTarget) ctx.setOpen(false);
	};

	/** Closes the drawer on Escape. */
	const handleCancel = (e: Event) => {
		// Keep the dialog mounted so Svelte can run the outro transition.
		e.preventDefault();
		ctx.setOpen(false);
	};

	/** Follows a drag toward the closing edge, then closes or springs back on release. */
	const handlePointerdown = (e: PointerEvent & { currentTarget: HTMLDivElement }) => {
		// If this is not the main button, or the press is on a control: let it work as usual.
		if (e.button !== 0 || (e.target instanceof Element && e.target.closest(NO_DRAG_SELECTOR))) return;
		const panel = e.currentTarget;
		const panelSize = isVertical ? panel.offsetHeight : panel.offsetWidth;
		const startPointer = isVertical ? e.clientY : e.clientX;
		let lastPointer = startPointer;
		let lastTime = e.timeStamp;
		let velocity = 0;
		panel.setPointerCapture(e.pointerId);
		isDragging = true;

		/** Moves the panel with the pointer; dragging away from the edge is ignored. */
		const handleMove = (moveEvent: PointerEvent) => {
			const pointer = isVertical ? moveEvent.clientY : moveEvent.clientX;
			const elapsed = Math.max(moveEvent.timeStamp - lastTime, 1);
			velocity = ((pointer - lastPointer) * closeSign) / elapsed;
			lastPointer = pointer;
			lastTime = moveEvent.timeStamp;
			dragOffset = Math.max((pointer - startPointer) * closeSign, 0);
		};

		/** Closes the drawer after a long drag or a quick flick, or springs it back. */
		const handleUp = () => {
			panel.removeEventListener("pointermove", handleMove);
			panel.removeEventListener("pointerup", handleUp);
			panel.removeEventListener("pointercancel", handleUp);
			isDragging = false;
			// If the drag passed the threshold or ended in a flick: close from where the panel is.
			if (dragOffset > panelSize * CLOSE_THRESHOLD || velocity > CLOSE_VELOCITY) ctx.setOpen(false);
			else dragOffset = 0;
		};

		panel.addEventListener("pointermove", handleMove);
		panel.addEventListener("pointerup", handleUp);
		panel.addEventListener("pointercancel", handleUp);
	};
</script>

<!-- Modal panel docked to one edge; drag it toward that edge, click the backdrop, or press Escape to close. -->
{#if ctx.open}
	<dialog class="drawer not-typeset" aria-labelledby={ctx.titleId} aria-describedby={ctx.descriptionId} data-direction={ctx.direction} data-size={ctx.size} data-rounded={ctx.rounded} {@attach showModal} transition:fade={{ duration: 200 }} onclick={handleBackdropClick} oncancel={handleCancel}>
		<div class={["drawerPanel", className]} data-dragging={isDragging || undefined} style:transform={dragTransform} transition:fly={{ ...flyParams, opacity: 1, duration: 300 }} onpointerdown={handlePointerdown} {...props}>
			<!-- Bottom drawers show a grab bar that hints at the drag. -->
			{#if ctx.direction === "bottom"}
				<div class="drawerHandle" aria-hidden="true"></div>
			{/if}
			{@render children()}
		</div>
	</dialog>
{/if}

<style>
	/* Base drawer; a blurred backdrop that docks the panel to one edge */
	.drawer {
		--drawer-radius: var(--radius-lg);
		display: flex;
		position: fixed;
		-webkit-backdrop-filter: blur(0.25rem);
		backdrop-filter: blur(0.25rem);
		box-sizing: border-box;
		margin: 0;
		inset: 0;
		border: none;
		background-color: color-mix(in oklab, var(--background) 50%, transparent);
		padding: 0;
		width: 100%;
		max-width: none;
		height: 100%;
		max-height: none;
		overflow: hidden;
	}

	.drawer::backdrop {
		background-color: transparent;
	}

	/* Panel; springs back when a drag is released short of closing */
	.drawerPanel {
		display: flex;
		position: relative;
		flex-direction: column;
		transition: transform 300ms cubic-bezier(0.32, 0.72, 0, 1);
		box-sizing: border-box;
		border: 0 solid var(--border);
		background-color: var(--popover);
		overflow: auto;
		color: var(--popover-foreground);
	}

	/* Follows the pointer without lag while dragging */
	.drawerPanel[data-dragging] {
		transition: none;
		user-select: none;
	}

	/* Grab bar at the top of bottom drawers; touch drags start here, so the content can still scroll */
	.drawerHandle {
		flex-shrink: 0;
		align-self: center;
		margin-top: var(--spacing-lg);
		border-radius: var(--radius-pill);
		background-color: var(--muted);
		width: 6.25rem; /* 100px */
		height: 0.5rem; /* 8px */
		touch-action: none;
	}

	/* =============== Directions =============== */

	/* Top and bottom drawers fill the width and size to their content */
	.drawer[data-direction="top"],
	.drawer[data-direction="bottom"] {
		flex-direction: column;
	}

	.drawer[data-direction="bottom"] {
		justify-content: flex-end;
	}

	.drawer[data-direction="top"] .drawerPanel,
	.drawer[data-direction="bottom"] .drawerPanel {
		width: 100%;
		max-height: 80dvh;
	}

	.drawer[data-direction="bottom"] .drawerPanel {
		border-top-width: 1px;
		border-top-right-radius: var(--drawer-radius);
		border-top-left-radius: var(--drawer-radius);
	}

	.drawer[data-direction="top"] .drawerPanel {
		border-bottom-width: 1px;
		border-bottom-right-radius: var(--drawer-radius);
		border-bottom-left-radius: var(--drawer-radius);
	}

	/* Side drawers fill the height and take most of the width on narrow screens */
	.drawer[data-direction="right"] {
		justify-content: flex-end;
	}

	.drawer[data-direction="left"],
	.drawer[data-direction="right"] {
		align-items: stretch;
	}

	.drawer[data-direction="left"] .drawerPanel,
	.drawer[data-direction="right"] .drawerPanel {
		width: 75%;
		max-width: var(--drawer-width);
	}

	.drawer[data-direction="right"] .drawerPanel {
		border-left-width: 1px;
		border-top-left-radius: var(--drawer-radius);
		border-bottom-left-radius: var(--drawer-radius);
	}

	.drawer[data-direction="left"] .drawerPanel {
		border-right-width: 1px;
		border-top-right-radius: var(--drawer-radius);
		border-bottom-right-radius: var(--drawer-radius);
	}

	/* =============== Sizes =============== */

	/* Large; the header, footer, and side width read these */
	.drawer[data-size="lg"] {
		--drawer-padding: var(--spacing-xl);
		--drawer-width: 32rem; /* 512px */
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Medium — default */
	.drawer[data-size="md"] {
		--drawer-padding: var(--spacing-lg);
		--drawer-width: 24rem; /* 384px */
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Small */
	.drawer[data-size="sm"] {
		--drawer-padding: var(--spacing-md);
		--drawer-width: 20rem; /* 320px */
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Extra small */
	.drawer[data-size="xs"] {
		--drawer-padding: var(--spacing-sm);
		--drawer-width: 16rem; /* 256px */
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* =============== Rounded =============== */

	/* Radius of the corners facing the page; must stay after the size rules */
	.drawer[data-rounded="xs"] {
		--drawer-radius: var(--radius-xs);
	}

	.drawer[data-rounded="sm"] {
		--drawer-radius: var(--radius-sm);
	}

	.drawer[data-rounded="md"] {
		--drawer-radius: var(--radius-md);
	}

	.drawer[data-rounded="lg"] {
		--drawer-radius: var(--radius-lg);
	}

	.drawer[data-rounded="xl"] {
		--drawer-radius: var(--radius-xl);
	}

	.drawer[data-rounded="2xl"] {
		--drawer-radius: var(--radius-2xl);
	}

	.drawer[data-rounded="3xl"] {
		--drawer-radius: var(--radius-3xl);
	}

	.drawer[data-rounded="4xl"] {
		--drawer-radius: var(--radius-4xl);
	}

	/* A true pill; tall content can clip at the corners, so use 3xl or 4xl to stay safe */
	.drawer[data-rounded="pill"] {
		--drawer-radius: var(--radius-pill);
	}
</style>
