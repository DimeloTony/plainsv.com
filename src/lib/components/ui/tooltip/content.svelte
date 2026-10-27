<script lang="ts">
	import { scale } from "svelte/transition";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { Attachment } from "svelte/attachments";
	import type { ContentProps, TooltipSide } from "./index.js";
	const { variant, size, rounded, children, class: className, ...props }: ContentProps = $props();
	const ctx = useCompCtx();
	// Minimum gap in pixels between the tooltip and the viewport edges.
	const VIEWPORT_PADDING = 8;
	// Closest the arrow gets to the tooltip's ends, so it clears the rounded corners.
	const ARROW_EDGE = 12;
	const OPPOSITE_SIDE: Record<TooltipSide, TooltipSide> = { top: "bottom", bottom: "top", left: "right", right: "left" };
	let placement: Placement = $state({ x: 0, y: 0, side: "top", arrowOffset: 0 });

	/** Clamps a value between a minimum and maximum; the minimum wins when they cross. */
	const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

	/** Places the content beside the trigger, flipping to the other side and shifting along it to stay in the viewport. */
	const updatePlacement = (node: HTMLElement) => {
		// If the trigger is not registered yet: keep the last placement.
		if (!ctx.triggerEl) return;
		const rect = ctx.triggerEl.getBoundingClientRect();
		// Offset sizes ignore the scale of the open transition.
		const width = node.offsetWidth;
		const height = node.offsetHeight;
		const viewportWidth = document.documentElement.clientWidth;
		const viewportHeight = document.documentElement.clientHeight;
		const isVerticalSide = ctx.side === "top" || ctx.side === "bottom";

		// If the preferred side is too tight and the opposite side has more room: flip.
		const space: Record<TooltipSide, number> = { top: rect.top, bottom: viewportHeight - rect.bottom, left: rect.left, right: viewportWidth - rect.right };
		const needed = (isVerticalSide ? height : width) + ctx.sideOffset + VIEWPORT_PADDING;
		const opposite = OPPOSITE_SIDE[ctx.side];
		const side = space[ctx.side] < needed && space[opposite] > space[ctx.side] ? opposite : ctx.side;
		const mainAxis: Record<TooltipSide, number> = { top: rect.top - ctx.sideOffset - height, bottom: rect.bottom + ctx.sideOffset, left: rect.left - ctx.sideOffset - width, right: rect.right + ctx.sideOffset };

		// Align along the trigger's edge, then shift to keep the tooltip inside the viewport.
		const [start, length, size, limit] = isVerticalSide ? [rect.left, rect.width, width, viewportWidth] : [rect.top, rect.height, height, viewportHeight];
		const aligned = { start, center: start + length / 2 - size / 2, end: start + length - size }[ctx.align];
		const cross = clamp(aligned, VIEWPORT_PADDING, limit - size - VIEWPORT_PADDING);

		// Point the arrow at the trigger's center, even after the shift.
		const arrowOffset = clamp(start + length / 2 - cross, ARROW_EDGE, size - ARROW_EDGE);
		placement = isVerticalSide ? { x: cross, y: mainAxis[side], side, arrowOffset } : { x: mainAxis[side], y: cross, side, arrowOffset };
	};

	/** Shows the content in the top layer and keeps it beside the trigger while open. */
	const placeContent: Attachment<HTMLDivElement> = (node) => {
		// Show in the top layer so no ancestor's overflow or z-index can cover the tooltip.
		if ("showPopover" in node && !node.matches(":popover-open")) node.showPopover();
		updatePlacement(node);

		const update = () => updatePlacement(node);
		const keepOpen = () => ctx.cancelClose();
		const leaveContent = () => ctx.scheduleClose();
		/** Closes the tooltip on Escape. */
		const handleKeydown = (e: KeyboardEvent) => {
			if (e.key === "Escape") ctx.close();
		};

		// Follow the trigger through scrolling, resizing, and content changes.
		const observer = new ResizeObserver(update);
		observer.observe(node);
		if (ctx.triggerEl) observer.observe(ctx.triggerEl);
		window.addEventListener("scroll", update, { capture: true, passive: true });
		window.addEventListener("resize", update);
		document.addEventListener("keydown", handleKeydown);

		// Stay open while the pointer is over the content, so its text can be read or selected.
		// Listen directly so pointer handlers passed through props still run.
		node.addEventListener("pointerenter", keepOpen);
		node.addEventListener("pointerleave", leaveContent);
		return () => {
			observer.disconnect();
			window.removeEventListener("scroll", update, { capture: true });
			window.removeEventListener("resize", update);
			document.removeEventListener("keydown", handleKeydown);
			node.removeEventListener("pointerenter", keepOpen);
			node.removeEventListener("pointerleave", leaveContent);
		};
	};

	/** Position of the content and its arrow in viewport pixels */
	interface Placement {
		/** Left edge of the content */
		x: number;
		/** Top edge of the content */
		y: number;
		/** Side the content opened on after flipping */
		side: TooltipSide;
		/** Distance from the content's start edge to the arrow's center */
		arrowOffset: number;
	}
</script>

<!-- Tooltip text in the top layer, with an arrow pointing at the trigger. -->
{#if ctx.open}
	<div class={["tooltip not-typeset", className]} id={ctx.contentId} role="tooltip" popover="manual" data-side={placement.side} data-variant={variant ?? ctx.variant} data-size={size ?? ctx.size} data-rounded={rounded ?? ctx.rounded} style:left="{placement.x}px" style:top="{placement.y}px" style:--tooltip-arrow-offset="{placement.arrowOffset}px" {@attach placeContent} transition:scale={{ duration: 150, start: 0.95 }} {...props}>
		{@render children()}
		{#if ctx.arrow}
			<span class="tooltipArrow" aria-hidden="true"></span>
		{/if}
	</div>
{/if}

<style>
	/* Base tooltip; resets the popover defaults so the computed position applies */
	.tooltip {
		position: fixed;
		z-index: 50; /* Only applies where the popover top layer is unavailable */
		box-sizing: border-box;
		margin: 0;
		inset: auto;
		border: 1px solid transparent;
		width: fit-content;
		max-width: min(20rem, calc(100vw - 1rem));
		overflow: visible;
		text-wrap: balance;
	}

	.tooltip :global(p) {
		margin: 0;
	}

	/* Grows from the side facing the trigger */
	.tooltip[data-side="top"] {
		transform-origin: var(--tooltip-arrow-offset) bottom;
	}

	.tooltip[data-side="bottom"] {
		transform-origin: var(--tooltip-arrow-offset) top;
	}

	.tooltip[data-side="left"] {
		transform-origin: right var(--tooltip-arrow-offset);
	}

	.tooltip[data-side="right"] {
		transform-origin: left var(--tooltip-arrow-offset);
	}

	/* Rotated square centered on the edge facing the trigger; only its outer half shows */
	.tooltipArrow {
		position: absolute;
		box-sizing: border-box;
		border: inherit;
		background-color: inherit;
		width: 0.5rem; /* 8px */
		height: 0.5rem; /* 8px */
	}

	/* Each side hides the arrow borders that fall inside the tooltip */
	.tooltip[data-side="top"] .tooltipArrow {
		top: 100%;
		left: var(--tooltip-arrow-offset);
		transform: translate(-50%, -50%) rotate(45deg);
		border-top-color: transparent;
		border-left-color: transparent;
	}

	.tooltip[data-side="bottom"] .tooltipArrow {
		bottom: 100%;
		left: var(--tooltip-arrow-offset);
		transform: translate(-50%, 50%) rotate(45deg);
		border-right-color: transparent;
		border-bottom-color: transparent;
	}

	.tooltip[data-side="left"] .tooltipArrow {
		top: var(--tooltip-arrow-offset);
		left: 100%;
		transform: translate(-50%, -50%) rotate(45deg);
		border-bottom-color: transparent;
		border-left-color: transparent;
	}

	.tooltip[data-side="right"] .tooltipArrow {
		top: var(--tooltip-arrow-offset);
		right: 100%;
		transform: translate(50%, -50%) rotate(45deg);
		border-top-color: transparent;
		border-right-color: transparent;
	}

	/* =============== Variants =============== */

	/* Inverted colors so the tooltip stands out from the page */
	.tooltip[data-variant="default"] {
		background-color: var(--foreground);
		color: var(--background);
	}

	.tooltip[data-variant="secondary"] {
		background-color: var(--secondary);
		color: var(--secondary-foreground);
	}

	/* Popover surface with a border that continues around the arrow */
	.tooltip[data-variant="outline"] {
		border-color: var(--border);
		background-color: var(--popover);
		color: var(--popover-foreground);
	}

	.tooltip[data-variant="destructive"] {
		background-color: var(--destructive);
		color: var(--destructive-foreground);
	}

	/* =============== Sizes =============== */

	/* Large */
	.tooltip[data-size="lg"] {
		--tooltip-pill-radius: calc(var(--spacing-sm) + var(--line-height-sm) / 2); /* 18px */
		border-radius: var(--radius-lg);
		padding: var(--spacing-sm) var(--spacing-md);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Medium — default */
	.tooltip[data-size="md"] {
		--tooltip-pill-radius: calc(0.375rem + var(--line-height-xs) / 2); /* 14px */
		border-radius: var(--radius-md);
		padding: 0.375rem var(--spacing-md); /* 6px block */
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* Small */
	.tooltip[data-size="sm"] {
		--tooltip-pill-radius: calc(var(--spacing-xs) + var(--line-height-xs) / 2); /* 12px */
		border-radius: var(--radius-sm);
		padding: var(--spacing-xs) var(--spacing-sm);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* Extra small */
	.tooltip[data-size="xs"] {
		--tooltip-pill-radius: calc(0.125rem + var(--line-height-xs) / 2); /* 10px */
		border-radius: var(--radius-xs);
		padding: 0.125rem var(--spacing-xs); /* 2px block */
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius; must stay after the size rules */
	.tooltip[data-rounded="xs"] {
		border-radius: var(--radius-xs);
	}

	.tooltip[data-rounded="sm"] {
		border-radius: var(--radius-sm);
	}

	.tooltip[data-rounded="md"] {
		border-radius: var(--radius-md);
	}

	.tooltip[data-rounded="lg"] {
		border-radius: var(--radius-lg);
	}

	.tooltip[data-rounded="xl"] {
		border-radius: var(--radius-xl);
	}

	.tooltip[data-rounded="2xl"] {
		border-radius: var(--radius-2xl);
	}

	.tooltip[data-rounded="3xl"] {
		border-radius: var(--radius-3xl);
	}

	.tooltip[data-rounded="4xl"] {
		border-radius: var(--radius-4xl);
	}

	/* Half the one-line height, set by each size: a pill on one line, round corners when the text wraps */
	.tooltip[data-rounded="pill"] {
		border-radius: var(--tooltip-pill-radius);
	}
</style>
