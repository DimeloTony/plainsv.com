<script lang="ts">
	import { scale } from "svelte/transition";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { Attachment } from "svelte/attachments";
	import type { ContentProps, HoverCardSide } from "./index.js";
	const { size, rounded, children, class: className, ...props }: ContentProps = $props();
	const ctx = useCompCtx();
	// Minimum gap in pixels between the card and the viewport edges.
	const VIEWPORT_PADDING = 8;
	const OPPOSITE_SIDE: Record<HoverCardSide, HoverCardSide> = { top: "bottom", bottom: "top", left: "right", right: "left" };
	let placement: Placement = $state({ x: 0, y: 0, side: "bottom" });

	/** Clamps a value between a minimum and maximum; the minimum wins when they cross. */
	const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

	/** Places the card beside the trigger, flipping to the other side and shifting along it to stay in the viewport. */
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
		const space: Record<HoverCardSide, number> = { top: rect.top, bottom: viewportHeight - rect.bottom, left: rect.left, right: viewportWidth - rect.right };
		const needed = (isVerticalSide ? height : width) + ctx.sideOffset + VIEWPORT_PADDING;
		const opposite = OPPOSITE_SIDE[ctx.side];
		const side = space[ctx.side] < needed && space[opposite] > space[ctx.side] ? opposite : ctx.side;
		const mainAxis: Record<HoverCardSide, number> = { top: rect.top - ctx.sideOffset - height, bottom: rect.bottom + ctx.sideOffset, left: rect.left - ctx.sideOffset - width, right: rect.right + ctx.sideOffset };

		// Align along the trigger's edge, then shift to keep the card inside the viewport.
		const [start, length, size, limit] = isVerticalSide ? [rect.left, rect.width, width, viewportWidth] : [rect.top, rect.height, height, viewportHeight];
		const aligned = { start, center: start + length / 2 - size / 2, end: start + length - size }[ctx.align];
		const cross = clamp(aligned, VIEWPORT_PADDING, limit - size - VIEWPORT_PADDING);
		placement = isVerticalSide ? { x: cross, y: mainAxis[side], side } : { x: mainAxis[side], y: cross, side };
	};

	/** Shows the card in the top layer and keeps it beside the trigger while open. */
	const placeContent: Attachment<HTMLDivElement> = (node) => {
		// Show in the top layer so no ancestor's overflow or z-index can cover the card.
		if ("showPopover" in node && !node.matches(":popover-open")) node.showPopover();
		updatePlacement(node);

		const update = () => updatePlacement(node);
		/** Closes the card on Escape. */
		const handleKeydown = (e: KeyboardEvent) => {
			if (e.key === "Escape") ctx.setOpen(false);
		};

		// Follow the trigger through scrolling, resizing, and content changes.
		const observer = new ResizeObserver(update);
		observer.observe(node);
		if (ctx.triggerEl) observer.observe(ctx.triggerEl);
		window.addEventListener("scroll", update, { capture: true, passive: true });
		window.addEventListener("resize", update);
		document.addEventListener("keydown", handleKeydown);
		return () => {
			observer.disconnect();
			window.removeEventListener("scroll", update, { capture: true });
			window.removeEventListener("resize", update);
			document.removeEventListener("keydown", handleKeydown);
		};
	};

	/** Position of the card in viewport pixels */
	interface Placement {
		/** Left edge of the card */
		x: number;
		/** Top edge of the card */
		y: number;
		/** Side the card opened on after flipping */
		side: HoverCardSide;
	}
</script>

<!-- Preview card in the top layer; it stays open while the pointer is over it, and does not take focus. -->
{#if ctx.open}
	<div class={["hoverCardContent not-typeset", className]} popover="manual" data-side={placement.side} data-size={size ?? ctx.size} data-rounded={rounded ?? ctx.rounded} style:left="{placement.x}px" style:top="{placement.y}px" {@attach placeContent} onpointerenter={() => ctx.cancelClose()} onpointerleave={() => ctx.scheduleClose()} transition:scale={{ duration: 150, start: 0.95 }} {...props}>
		{@render children()}
	</div>
{/if}

<style>
	/* Base card; resets the popover defaults so the computed position applies */
	.hoverCardContent {
		position: fixed;
		flex-direction: column;
		z-index: 50; /* Only applies where the popover top layer is unavailable */
		box-sizing: border-box;
		margin: 0;
		inset: auto;
		outline: none;
		border: 1px solid var(--border);
		background-color: var(--popover);
		width: 16rem; /* 256px */
		max-width: calc(100vw - 1rem);
		color: var(--popover-foreground);
	}

	/* Lays out the parts only while shown */
	.hoverCardContent:popover-open {
		display: flex;
	}

	/* Grows from the side facing the trigger */
	.hoverCardContent[data-side="top"] {
		transform-origin: bottom;
	}

	.hoverCardContent[data-side="bottom"] {
		transform-origin: top;
	}

	.hoverCardContent[data-side="left"] {
		transform-origin: right;
	}

	.hoverCardContent[data-side="right"] {
		transform-origin: left;
	}

	/* =============== Sizes =============== */

	/* Large */
	.hoverCardContent[data-size="lg"] {
		gap: var(--spacing-md);
		border-radius: var(--radius-lg);
		padding: var(--spacing-lg);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Medium — default */
	.hoverCardContent[data-size="md"] {
		gap: var(--spacing-sm);
		border-radius: var(--radius-md);
		padding: var(--spacing-lg);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Small */
	.hoverCardContent[data-size="sm"] {
		gap: var(--spacing-xs);
		border-radius: var(--radius-sm);
		padding: var(--spacing-md);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Extra small */
	.hoverCardContent[data-size="xs"] {
		gap: var(--spacing-xs);
		border-radius: var(--radius-xs);
		padding: var(--spacing-sm);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius; must stay after the size rules */
	.hoverCardContent[data-rounded="xs"] {
		border-radius: var(--radius-xs);
	}

	.hoverCardContent[data-rounded="sm"] {
		border-radius: var(--radius-sm);
	}

	.hoverCardContent[data-rounded="md"] {
		border-radius: var(--radius-md);
	}

	.hoverCardContent[data-rounded="lg"] {
		border-radius: var(--radius-lg);
	}

	.hoverCardContent[data-rounded="xl"] {
		border-radius: var(--radius-xl);
	}

	.hoverCardContent[data-rounded="2xl"] {
		border-radius: var(--radius-2xl);
	}

	.hoverCardContent[data-rounded="3xl"] {
		border-radius: var(--radius-3xl);
	}

	.hoverCardContent[data-rounded="4xl"] {
		border-radius: var(--radius-4xl);
	}

	/* A true pill; tall content can clip at the corners, so use 3xl or 4xl to stay safe */
	.hoverCardContent[data-rounded="pill"] {
		border-radius: var(--radius-pill);
	}
</style>
