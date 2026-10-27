<script lang="ts">
	import { GripVerticalIcon } from "@lucide/svelte";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { Attachment } from "svelte/attachments";
	import type { HandleProps } from "./index.js";
	const { withHandle = false, disabled = false, class: className, ...props }: HandleProps = $props();
	const ctx = useCompCtx();
	// Percent each arrow key press moves the handle.
	const KEYBOARD_STEP = 5;
	// Ids of the panels before and after the handle, read from its neighbors once mounted.
	let beforeId = $state("");
	let afterId = $state("");
	const beforePanel = $derived(ctx.panels.find((panel) => panel.id === beforeId));
	const beforeSize = $derived(ctx.sizes[beforeId] ?? 0);
	const isHorizontal = $derived(ctx.direction === "horizontal");

	/** Finds the panels on both sides of the handle. */
	const findNeighbors: Attachment<HTMLDivElement> = (node) => {
		beforeId = node.previousElementSibling?.getAttribute("data-resizable-panel") ?? "";
		afterId = node.nextElementSibling?.getAttribute("data-resizable-panel") ?? "";
	};

	/** Resizes the neighboring panels while the handle is dragged. */
	const handlePointerdown = (e: PointerEvent & { currentTarget: HTMLDivElement }) => {
		const handle = e.currentTarget;
		const before = handle.previousElementSibling;
		const after = handle.nextElementSibling;
		// If disabled, not the main button, or missing a neighbor: ignore the press.
		if (disabled || e.button !== 0 || !(before instanceof HTMLElement) || !(after instanceof HTMLElement)) return;
		e.preventDefault();
		handle.focus();
		handle.setPointerCapture(e.pointerId);
		ctx.isDragging = true;
		const startPointer = isHorizontal ? e.clientX : e.clientY;
		const startSize = beforeSize;
		// Pixels and percent of the two panels together, so a pixel of movement maps to a share of the pair.
		const pairPixels = isHorizontal ? before.offsetWidth + after.offsetWidth : before.offsetHeight + after.offsetHeight;
		const pairPercent = beforeSize + (ctx.sizes[afterId] ?? 0);

		/** Moves the boundary by the distance the pointer traveled. */
		const handleMove = (moveEvent: PointerEvent) => {
			const delta = (isHorizontal ? moveEvent.clientX : moveEvent.clientY) - startPointer;
			ctx.resizePair(beforeId, afterId, startSize + (delta / Math.max(pairPixels, 1)) * pairPercent);
		};

		/** Stops following the pointer. */
		const handleUp = () => {
			ctx.isDragging = false;
			handle.removeEventListener("pointermove", handleMove);
			handle.removeEventListener("pointerup", handleUp);
			handle.removeEventListener("pointercancel", handleUp);
		};

		handle.addEventListener("pointermove", handleMove);
		handle.addEventListener("pointerup", handleUp);
		handle.addEventListener("pointercancel", handleUp);
	};

	/** Moves the handle with the arrow keys along the group direction, and to the limits with Home and End. */
	const handleKeydown = (e: KeyboardEvent) => {
		// If the handle is disabled or has no panel before it: leave the key alone.
		if (disabled || !beforePanel) return;
		const keySizes: Record<string, number> = {
			[isHorizontal ? "ArrowLeft" : "ArrowUp"]: beforeSize - KEYBOARD_STEP,
			[isHorizontal ? "ArrowRight" : "ArrowDown"]: beforeSize + KEYBOARD_STEP,
			Home: beforePanel.minSize,
			End: beforePanel.maxSize,
		};
		// If the key does not move the handle: let it through.
		if (!(e.key in keySizes)) return;
		e.preventDefault();
		ctx.resizePair(beforeId, afterId, keySizes[e.key]);
	};
</script>

<!-- Focusable divider; announced as a splitter with the size of the panel before it. -->
<!-- A focusable separator with a value is an interactive splitter in ARIA, which this check does not know. -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div class={["resizableHandle", className]} role="separator" tabindex={disabled ? -1 : 0} aria-orientation={isHorizontal ? "vertical" : "horizontal"} aria-controls={beforeId || undefined} aria-valuenow={Math.round(beforeSize)} aria-valuemin={beforePanel?.minSize ?? 0} aria-valuemax={beforePanel?.maxSize ?? 100} aria-disabled={disabled || undefined} data-direction={ctx.direction} {@attach findNeighbors} onpointerdown={handlePointerdown} onkeydown={handleKeydown} {...props}>
	{#if withHandle}
		<span class="resizableGrip"><GripVerticalIcon /></span>
	{/if}
</div>

<style>
	/* Base handle; a hairline with a wider invisible hit area */
	.resizableHandle {
		display: flex;
		position: relative;
		flex-shrink: 0;
		justify-content: center;
		align-items: center;
		transition: box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1);
		outline: none;
		background-color: var(--border);
		touch-action: none;
	}

	.resizableHandle::after {
		position: absolute;
		content: "";
	}

	/* Between side-by-side panels */
	.resizableHandle[data-direction="horizontal"] {
		cursor: col-resize;
		width: 1px;
	}

	.resizableHandle[data-direction="horizontal"]::after {
		inset-block: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 0.5rem; /* 8px hit area */
	}

	/* Between stacked panels */
	.resizableHandle[data-direction="vertical"] {
		cursor: row-resize;
		height: 1px;
	}

	.resizableHandle[data-direction="vertical"]::after {
		inset-inline: 0;
		top: 50%;
		transform: translateY(-50%);
		height: 0.5rem; /* 8px hit area */
	}

	/* Grip drawn over the middle of the line */
	.resizableGrip {
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1;
		box-sizing: border-box;
		border: 1px solid var(--border);
		border-radius: var(--radius-xs);
		background-color: var(--border);
		width: 0.75rem; /* 12px */
		height: 1rem; /* 16px */
	}

	.resizableGrip :global(svg) {
		width: 0.625rem; /* 10px */
		height: 0.625rem; /* 10px */
	}

	/* Turns the grip sideways between stacked panels */
	.resizableHandle[data-direction="vertical"] .resizableGrip {
		transform: rotate(90deg);
	}

	/* =============== States =============== */

	/* Keyboard focus ring */
	.resizableHandle:focus-visible {
		box-shadow: 0 0 0 2px color-mix(in oklab, var(--ring) 50%, transparent);
	}

	/* Disabled handles do not resize */
	.resizableHandle[aria-disabled="true"] {
		cursor: default;
	}
</style>
