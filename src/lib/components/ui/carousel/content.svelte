<script lang="ts">
	import { untrack } from "svelte";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { Attachment } from "svelte/attachments";
	import type { ContentProps } from "./index.js";
	const { children, class: className, ...props }: ContentProps = $props();
	const ctx = useCompCtx();
	// Pixels a mouse drag must travel before it counts as a drag, so short clicks still click.
	const DRAG_THRESHOLD = 5;
	let isDragging = $state(false);

	/** Registers the viewport, and updates the selected slide on scroll and resize. */
	const registerViewport: Attachment<HTMLDivElement> = (node) => {
		// Untracked, so the state this writes and then reads cannot re-run the attachment in a loop.
		untrack(() => {
			ctx.viewportEl = node;
			ctx.update();
		});
		const update = () => ctx.update();
		const observer = new ResizeObserver(update);
		observer.observe(node);
		if (node.firstElementChild) observer.observe(node.firstElementChild);
		const startDrag = (e: PointerEvent) => handlePointerdown(node, e);
		node.addEventListener("scroll", update, { passive: true });
		node.addEventListener("pointerdown", startDrag);
		return () => {
			observer.disconnect();
			node.removeEventListener("scroll", update);
			node.removeEventListener("pointerdown", startDrag);
			// If another viewport has not taken over: clear the reference.
			if (ctx.viewportEl === node) ctx.viewportEl = undefined;
		};
	};

	/** Scrolls with a mouse drag, then snaps to the nearest slide; touch and trackpads scroll natively. */
	const handlePointerdown = (viewport: HTMLDivElement, e: PointerEvent) => {
		// If this is not a mouse's main button: let the browser scroll natively.
		if (e.pointerType !== "mouse" || e.button !== 0) return;
		const isVertical = ctx.orientation === "vertical";
		const startPointer = isVertical ? e.clientY : e.clientX;
		const startScroll = isVertical ? viewport.scrollTop : viewport.scrollLeft;
		let hasMoved = false;

		/** Scrolls by the distance the mouse moved, once it passes the threshold. */
		const handleMove = (moveEvent: PointerEvent) => {
			const delta = (isVertical ? moveEvent.clientY : moveEvent.clientX) - startPointer;
			// If the mouse has barely moved: wait, so a click still clicks.
			if (!hasMoved && Math.abs(delta) < DRAG_THRESHOLD) return;
			if (!hasMoved) {
				hasMoved = true;
				isDragging = true;
				viewport.setPointerCapture(moveEvent.pointerId);
			}
			if (isVertical) viewport.scrollTop = startScroll - delta;
			else viewport.scrollLeft = startScroll - delta;
		};

		/** Stops following the mouse, snaps to the nearest slide, and swallows the click a drag ends with. */
		const handleUp = () => {
			viewport.removeEventListener("pointermove", handleMove);
			viewport.removeEventListener("pointerup", handleUp);
			viewport.removeEventListener("pointercancel", handleUp);
			// If the mouse never moved far enough: this was a click, so leave it alone.
			if (!hasMoved) return;
			isDragging = false;
			ctx.scrollTo(ctx.firstVisibleIndex());
			viewport.addEventListener("click", (clickEvent) => clickEvent.preventDefault(), { capture: true, once: true });
		};

		viewport.addEventListener("pointermove", handleMove);
		viewport.addEventListener("pointerup", handleUp);
		viewport.addEventListener("pointercancel", handleUp);
	};
</script>

<!-- Scrolling viewport; slides snap to its start edge, and the mouse can drag it. -->
<div class="carouselViewport" data-orientation={ctx.orientation} data-dragging={isDragging || undefined} {@attach registerViewport}>
	<div class={["carouselTrack", className]} data-orientation={ctx.orientation} {...props}>
		{@render children()}
	</div>
</div>

<style>
	/* Base viewport; native scrolling with the scrollbar hidden */
	.carouselViewport {
		position: relative;
		overflow: hidden;
		scrollbar-width: none;
	}

	.carouselViewport::-webkit-scrollbar {
		display: none;
	}

	.carouselViewport[data-orientation="horizontal"] {
		overflow-x: auto;
		scroll-snap-type: x mandatory;
	}

	.carouselViewport[data-orientation="vertical"] {
		height: 100%;
		overflow-y: auto;
		scroll-snap-type: y mandatory;
	}

	/* Snapping waits until a mouse drag ends, so the slides follow the mouse */
	.carouselViewport[data-dragging] {
		cursor: grabbing;
		scroll-snap-type: none;
		user-select: none;
	}

	/* Row or column of slides */
	.carouselTrack {
		display: flex;
		gap: var(--carousel-gap);
	}

	.carouselTrack[data-orientation="vertical"] {
		flex-direction: column;
		height: 100%;
	}
</style>
