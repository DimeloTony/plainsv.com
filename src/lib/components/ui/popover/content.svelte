<script lang="ts">
	import { tick } from "svelte";
	import { scale } from "svelte/transition";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { Attachment } from "svelte/attachments";
	import type { ContentProps, PopoverSide } from "./index.js";
	const { size, rounded, children, class: className, ...props }: ContentProps = $props();
	const ctx = useCompCtx();
	// Minimum gap in pixels between the popover and the viewport edges.
	const VIEWPORT_PADDING = 8;
	const OPPOSITE_SIDE: Record<PopoverSide, PopoverSide> = { top: "bottom", bottom: "top", left: "right", right: "left" };
	// Elements that can take focus with the keyboard, in order.
	const FOCUSABLE_SELECTOR = 'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';
	let placement: Placement = $state({ x: 0, y: 0, side: "bottom", maxHeight: 0 });

	/** Clamps a value between a minimum and maximum; the minimum wins when they cross. */
	const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

	/** Places the popover beside the trigger, flipping to the side with more room and scrolling when it is still too tall. */
	const updatePlacement = (node: HTMLElement) => {
		// If the trigger is not registered yet: keep the last placement.
		if (!ctx.triggerEl) return;
		const rect = ctx.triggerEl.getBoundingClientRect();
		// Offset sizes ignore the scale of the open transition.
		const width = node.offsetWidth;
		// Full height of the content plus the borders, ignoring the current max height.
		const naturalHeight = node.scrollHeight + node.offsetHeight - node.clientHeight;
		const viewportWidth = document.documentElement.clientWidth;
		const viewportHeight = document.documentElement.clientHeight;
		const isVerticalSide = ctx.side === "top" || ctx.side === "bottom";

		// If the preferred side is too tight and the opposite side has more room: flip.
		const space: Record<PopoverSide, number> = { top: rect.top, bottom: viewportHeight - rect.bottom, left: rect.left, right: viewportWidth - rect.right };
		const needed = (isVerticalSide ? naturalHeight : width) + ctx.sideOffset + VIEWPORT_PADDING;
		const opposite = OPPOSITE_SIDE[ctx.side];
		const placedSide = space[ctx.side] < needed && space[opposite] > space[ctx.side] ? opposite : ctx.side;

		// Above or below the trigger, the popover gets the room on that side and scrolls past it, so it never covers the trigger.
		const maxHeight = isVerticalSide ? space[placedSide] - ctx.sideOffset - VIEWPORT_PADDING : viewportHeight - 2 * VIEWPORT_PADDING;
		const height = Math.min(naturalHeight, maxHeight);
		const mainAxis: Record<PopoverSide, number> = { top: rect.top - ctx.sideOffset - height, bottom: rect.bottom + ctx.sideOffset, left: rect.left - ctx.sideOffset - width, right: rect.right + ctx.sideOffset };

		// Align along the trigger's edge, then shift to keep the popover inside the viewport.
		const [start, length, size, limit] = isVerticalSide ? [rect.left, rect.width, width, viewportWidth] : [rect.top, rect.height, height, viewportHeight];
		const aligned = { start, center: start + length / 2 - size / 2, end: start + length - size }[ctx.align];
		const cross = clamp(aligned, VIEWPORT_PADDING, limit - size - VIEWPORT_PADDING);

		// If a side popover does not fit beside the trigger: keep it inside the viewport, even if it covers the trigger.
		const main = isVerticalSide ? mainAxis[placedSide] : clamp(mainAxis[placedSide], VIEWPORT_PADDING, viewportWidth - width - VIEWPORT_PADDING);
		placement = isVerticalSide ? { x: cross, y: main, side: placedSide, maxHeight } : { x: main, y: cross, side: placedSide, maxHeight };
	};

	/** Shows the popover in the top layer, places it, moves focus into it, and closes it when focus leaves. */
	const placeContent: Attachment<HTMLDivElement> = (node) => {
		// Show in the top layer so no ancestor's overflow or z-index can clip the popover.
		if ("showPopover" in node && !node.matches(":popover-open")) node.showPopover();
		updatePlacement(node);
		// Focus the first control once placed, or the popover itself when it has none.
		tick().then(() => (node.querySelector<HTMLElement>(FOCUSABLE_SELECTOR) ?? node).focus({ preventScroll: true }));

		const update = () => updatePlacement(node);
		/** Closes the popover when focus moves to an element outside it, such as by tabbing past its last control. */
		const handleFocusOut = (e: FocusEvent) => {
			const next = e.relatedTarget;
			// If focus left the page, stayed inside, or moved to the trigger: keep it open; the trigger toggles it itself.
			if (!(next instanceof Node) || node.contains(next) || ctx.triggerEl?.contains(next)) return;
			ctx.setOpen(false);
		};

		// Follow the trigger through scrolling, resizing, and content changes.
		const observer = new ResizeObserver(update);
		observer.observe(node);
		if (ctx.triggerEl) observer.observe(ctx.triggerEl);
		window.addEventListener("scroll", update, { capture: true, passive: true });
		window.addEventListener("resize", update);
		node.addEventListener("focusout", handleFocusOut);
		return () => {
			observer.disconnect();
			window.removeEventListener("scroll", update, { capture: true });
			window.removeEventListener("resize", update);
			node.removeEventListener("focusout", handleFocusOut);
		};
	};

	/** Syncs the open state after the browser hides the popover itself, such as on an outside click or Escape. */
	const handleToggle = (e: ToggleEvent & { currentTarget: HTMLDivElement }) => {
		// If the popover is showing: this is the open toggle, so there is nothing to sync.
		if (e.currentTarget.matches(":popover-open")) return;
		const hadFocus = document.activeElement === document.body || e.currentTarget.contains(document.activeElement);
		ctx.setOpen(false);
		// If focus was in the popover or dropped to the page: return it to the trigger.
		if (hadFocus) ctx.triggerEl?.focus({ preventScroll: true });
	};

	/** Position and size of the popover in viewport pixels */
	interface Placement {
		/** Left edge of the popover */
		x: number;
		/** Top edge of the popover */
		y: number;
		/** Side the popover opened on after flipping */
		side: PopoverSide;
		/** Room on the chosen side; the popover scrolls past it */
		maxHeight: number;
	}
</script>

<!-- Non-modal dialog in the top layer beside the trigger; named by its title, or by the trigger without one. -->
{#if ctx.open}
	<div class={["popoverContent not-typeset", className]} id={ctx.contentId} role="dialog" tabindex="-1" aria-labelledby={ctx.hasTitle ? ctx.titleId : ctx.triggerId} aria-describedby={ctx.hasDescription ? ctx.descriptionId : undefined} popover="auto" data-side={placement.side} data-size={size ?? ctx.size} data-rounded={rounded ?? ctx.rounded} style:left="{placement.x}px" style:top="{placement.y}px" style:max-height="{placement.maxHeight}px" {@attach placeContent} ontoggle={handleToggle} transition:scale={{ duration: 150, start: 0.95 }} {...props}>
		{@render children()}
	</div>
{/if}

<style>
	/* Base popover; resets the popover defaults so the computed position applies */
	.popoverContent {
		position: fixed;
		flex-direction: column;
		z-index: 50; /* Only applies where the popover top layer is unavailable */
		box-sizing: border-box;
		margin: 0;
		inset: auto;
		outline: none;
		border: 1px solid var(--border);
		background-color: var(--popover);
		width: 18rem;
		max-width: calc(100vw - 1rem);
		overflow-y: auto;
		color: var(--popover-foreground);
	}

	/* Lays out the parts only while shown, so the browser's hidden state still applies after a dismiss */
	.popoverContent:popover-open {
		display: flex;
	}

	/* Grows from the side facing the trigger */
	.popoverContent[data-side="top"] {
		transform-origin: bottom;
	}

	.popoverContent[data-side="bottom"] {
		transform-origin: top;
	}

	.popoverContent[data-side="left"] {
		transform-origin: right;
	}

	.popoverContent[data-side="right"] {
		transform-origin: left;
	}

	/* =============== Sizes =============== */

	/* Large */
	.popoverContent[data-size="lg"] {
		gap: var(--spacing-md);
		border-radius: var(--radius-lg);
		padding: var(--spacing-lg);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Medium — default */
	.popoverContent[data-size="md"] {
		gap: var(--spacing-sm);
		border-radius: var(--radius-md);
		padding: var(--spacing-md);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Small */
	.popoverContent[data-size="sm"] {
		gap: var(--spacing-xs);
		border-radius: var(--radius-sm);
		padding: var(--spacing-sm);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Extra small */
	.popoverContent[data-size="xs"] {
		gap: var(--spacing-xs);
		border-radius: var(--radius-xs);
		padding: var(--spacing-sm);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius; must stay after the size rules */
	.popoverContent[data-rounded="xs"] {
		border-radius: var(--radius-xs);
	}

	.popoverContent[data-rounded="sm"] {
		border-radius: var(--radius-sm);
	}

	.popoverContent[data-rounded="md"] {
		border-radius: var(--radius-md);
	}

	.popoverContent[data-rounded="lg"] {
		border-radius: var(--radius-lg);
	}

	.popoverContent[data-rounded="xl"] {
		border-radius: var(--radius-xl);
	}

	.popoverContent[data-rounded="2xl"] {
		border-radius: var(--radius-2xl);
	}

	.popoverContent[data-rounded="3xl"] {
		border-radius: var(--radius-3xl);
	}

	.popoverContent[data-rounded="4xl"] {
		border-radius: var(--radius-4xl);
	}

	/* A true pill; tall content can clip at the corners, so use 3xl or 4xl to stay safe */
	.popoverContent[data-rounded="pill"] {
		border-radius: var(--radius-pill);
	}
</style>
