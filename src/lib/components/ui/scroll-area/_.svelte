<script lang="ts">
	import type { Attachment } from "svelte/attachments";
	import type { Props } from "./index.js";
	let { orientation = "vertical", type = "hover", viewport = $bindable(), size = "md", rounded, children, class: className, ...props }: Props = $props();
	// Milliseconds the scrollbars stay shown after scrolling stops.
	const SCROLL_HIDE_DELAY = 600;
	let metrics = $state({ scrollTop: 0, scrollLeft: 0, scrollHeight: 0, scrollWidth: 0, clientHeight: 0, clientWidth: 0 });
	let isScrolling = $state(false);
	let scrollTimer: ReturnType<typeof setTimeout> | undefined;
	// A scrollbar shows only when its direction is enabled and the content overflows.
	const hasVertical = $derived(orientation !== "horizontal" && metrics.scrollHeight > metrics.clientHeight + 1);
	const hasHorizontal = $derived(orientation !== "vertical" && metrics.scrollWidth > metrics.clientWidth + 1);
	// Thumb length as a share of the track, and how far the content is scrolled from 0 to 1.
	const verticalThumb = $derived(metrics.scrollHeight ? (metrics.clientHeight / metrics.scrollHeight) * 100 : 100);
	const horizontalThumb = $derived(metrics.scrollWidth ? (metrics.clientWidth / metrics.scrollWidth) * 100 : 100);
	const verticalProgress = $derived(metrics.scrollHeight > metrics.clientHeight ? metrics.scrollTop / (metrics.scrollHeight - metrics.clientHeight) : 0);
	const horizontalProgress = $derived(metrics.scrollWidth > metrics.clientWidth ? metrics.scrollLeft / (metrics.scrollWidth - metrics.clientWidth) : 0);

	/** Reads the scroll position and sizes the scrollbars follow. */
	const measure = () => {
		// If the viewport is not mounted yet: there is nothing to measure.
		if (!viewport) return;
		const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } = viewport;
		metrics = { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth };
	};

	/** Measures on mount, on scroll, and whenever the viewport or its content resizes. */
	const trackViewport: Attachment<HTMLDivElement> = (node) => {
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(node);
		if (node.firstElementChild) observer.observe(node.firstElementChild);
		return () => {
			observer.disconnect();
			clearTimeout(scrollTimer);
		};
	};

	/** Updates the thumbs and keeps the scrollbars shown for a moment after scrolling. */
	const handleScroll = () => {
		measure();
		isScrolling = true;
		clearTimeout(scrollTimer);
		scrollTimer = setTimeout(() => (isScrolling = false), SCROLL_HIDE_DELAY);
	};

	/** Drags the thumb, or jumps toward a click on the track, along one axis. */
	const handleTrackPointerdown = (e: PointerEvent & { currentTarget: HTMLDivElement }, axis: "vertical" | "horizontal") => {
		// If the viewport is gone or this is not the main button: ignore the press.
		if (!viewport || e.button !== 0) return;
		e.preventDefault();
		const track = e.currentTarget;
		const thumb = track.firstElementChild;
		// If the thumb is missing: there is nothing to drag.
		if (!(thumb instanceof HTMLElement)) return;
		const isVertical = axis === "vertical";
		const scrollKey = isVertical ? "scrollTop" : "scrollLeft";
		const trackLength = isVertical ? track.clientHeight : track.clientWidth;
		const thumbLength = isVertical ? thumb.offsetHeight : thumb.offsetWidth;
		const scrollRange = isVertical ? viewport.scrollHeight - viewport.clientHeight : viewport.scrollWidth - viewport.clientWidth;
		// Pixels of scrolling per pixel the thumb moves.
		const scale = scrollRange / Math.max(trackLength - thumbLength, 1);
		// If the press missed the thumb: center the thumb on the press, then keep dragging from there.
		if (e.target !== thumb) {
			const trackStart = isVertical ? track.getBoundingClientRect().top : track.getBoundingClientRect().left;
			const pointer = (isVertical ? e.clientY : e.clientX) - trackStart;
			viewport[scrollKey] = (pointer - thumbLength / 2) * scale;
		}
		const startPointer = isVertical ? e.clientY : e.clientX;
		const startScroll = viewport[scrollKey];
		track.setPointerCapture(e.pointerId);

		/** Scrolls by the distance the pointer moved since the press. */
		const handleMove = (moveEvent: PointerEvent) => {
			// If the viewport unmounted mid-drag: stop following.
			if (!viewport) return;
			viewport[scrollKey] = startScroll + ((isVertical ? moveEvent.clientY : moveEvent.clientX) - startPointer) * scale;
		};

		/** Stops following the pointer. */
		const handleUp = () => {
			track.removeEventListener("pointermove", handleMove);
			track.removeEventListener("pointerup", handleUp);
			track.removeEventListener("pointercancel", handleUp);
		};

		track.addEventListener("pointermove", handleMove);
		track.addEventListener("pointerup", handleUp);
		track.addEventListener("pointercancel", handleUp);
	};
</script>

<!-- Box with a scrolling viewport; the scrollbars sit over its edges. -->
<div class={["scrollArea not-typeset", className]} data-type={type} data-scrolling={isScrolling || undefined} data-size={size} data-rounded={rounded} {...props}>
	<!-- Browsers make an overflowing viewport focusable, so keyboard users can scroll it with the arrow keys. -->
	<div bind:this={viewport} class="scrollAreaViewport" data-orientation={orientation} {@attach trackViewport} onscroll={handleScroll}>
		<div class="scrollAreaContent">
			{@render children()}
		</div>
	</div>

	<!-- Vertical scrollbar; decorative, since the viewport scrolls with the keyboard and wheel. -->
	{#if hasVertical}
		<div class="scrollAreaTrack" data-orientation="vertical" data-corner={hasHorizontal || undefined} aria-hidden="true" onpointerdown={(e) => handleTrackPointerdown(e, "vertical")}>
			<div class="scrollAreaThumb" style:--scroll-area-thumb-size="{verticalThumb}%" style:--scroll-area-progress={verticalProgress}></div>
		</div>
	{/if}

	<!-- Horizontal scrollbar. -->
	{#if hasHorizontal}
		<div class="scrollAreaTrack" data-orientation="horizontal" data-corner={hasVertical || undefined} aria-hidden="true" onpointerdown={(e) => handleTrackPointerdown(e, "horizontal")}>
			<div class="scrollAreaThumb" style:--scroll-area-thumb-size="{horizontalThumb}%" style:--scroll-area-progress={horizontalProgress}></div>
		</div>
	{/if}
</div>

<style>
	/* Base box; set its height or max height from outside */
	.scrollArea {
		display: flex;
		position: relative;
		flex-direction: column;
		overflow: hidden;
	}

	/* Scrolling element with the native scrollbars hidden */
	.scrollAreaViewport {
		flex: 1;
		transition: box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1);
		outline: none;
		border-radius: inherit;
		width: 100%;
		min-height: 0;
		max-height: inherit;
		scrollbar-width: none;
	}

	.scrollAreaViewport::-webkit-scrollbar {
		display: none;
	}

	.scrollAreaViewport[data-orientation="vertical"] {
		overflow-x: hidden;
		overflow-y: auto;
	}

	.scrollAreaViewport[data-orientation="horizontal"] {
		overflow-x: auto;
		overflow-y: hidden;
	}

	.scrollAreaViewport[data-orientation="both"] {
		overflow: auto;
	}

	/* Content wider than the box scrolls sideways instead of wrapping */
	.scrollAreaViewport:not([data-orientation="vertical"]) > .scrollAreaContent {
		width: max-content;
		min-width: 100%;
	}

	/* Track along the edge; holds the thumb */
	.scrollAreaTrack {
		position: absolute;
		transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);
		box-sizing: border-box;
		padding: 1px;
		touch-action: none;
		user-select: none;
	}

	.scrollAreaTrack[data-orientation="vertical"] {
		top: 0;
		right: 0;
		bottom: 0;
		width: var(--scroll-area-thickness);
	}

	.scrollAreaTrack[data-orientation="horizontal"] {
		right: 0;
		bottom: 0;
		left: 0;
		height: var(--scroll-area-thickness);
	}

	/* With both scrollbars, each leaves the corner free */
	.scrollAreaTrack[data-orientation="vertical"][data-corner] {
		bottom: var(--scroll-area-thickness);
	}

	.scrollAreaTrack[data-orientation="horizontal"][data-corner] {
		right: var(--scroll-area-thickness);
	}

	/* Thumb sized to the visible share of the content and placed by the scroll progress */
	.scrollAreaThumb {
		position: relative;
		border-radius: var(--radius-pill);
		background-color: var(--border);
	}

	.scrollAreaThumb:hover {
		background-color: color-mix(in oklab, var(--muted-foreground) 50%, transparent);
	}

	.scrollAreaTrack[data-orientation="vertical"] .scrollAreaThumb {
		top: calc((100% - max(var(--scroll-area-thumb-size), 1.5rem)) * var(--scroll-area-progress));
		width: 100%;
		height: max(var(--scroll-area-thumb-size), 1.5rem); /* never shorter than 24px */
	}

	.scrollAreaTrack[data-orientation="horizontal"] .scrollAreaThumb {
		left: calc((100% - max(var(--scroll-area-thumb-size), 1.5rem)) * var(--scroll-area-progress));
		width: max(var(--scroll-area-thumb-size), 1.5rem); /* never shorter than 24px */
		height: 100%;
	}

	/* =============== Variants =============== */

	/* Hover and scroll types hide the scrollbars until needed */
	.scrollArea[data-type="hover"] .scrollAreaTrack,
	.scrollArea[data-type="scroll"] .scrollAreaTrack {
		opacity: 0;
	}

	.scrollArea[data-type="hover"]:hover .scrollAreaTrack,
	.scrollArea[data-type="hover"][data-scrolling] .scrollAreaTrack,
	.scrollArea[data-type="scroll"][data-scrolling] .scrollAreaTrack {
		opacity: 1;
	}

	/* =============== States =============== */

	/* Keyboard focus ring inside the box, so the edges do not clip it */
	.scrollAreaViewport:focus-visible {
		box-shadow: inset 0 0 0 2px color-mix(in oklab, var(--ring) 50%, transparent);
	}

	/* =============== Sizes =============== */

	/* Large */
	.scrollArea[data-size="lg"] {
		--scroll-area-thickness: 0.75rem; /* 12px */
	}

	/* Medium — default */
	.scrollArea[data-size="md"] {
		--scroll-area-thickness: 0.625rem; /* 10px */
	}

	/* Small */
	.scrollArea[data-size="sm"] {
		--scroll-area-thickness: 0.5rem; /* 8px */
	}

	/* Extra small */
	.scrollArea[data-size="xs"] {
		--scroll-area-thickness: 0.375rem; /* 6px */
	}

	/* =============== Rounded =============== */

	/* Rounds the box; the viewport and its focus ring follow */
	.scrollArea[data-rounded="xs"] {
		border-radius: var(--radius-xs);
	}

	.scrollArea[data-rounded="sm"] {
		border-radius: var(--radius-sm);
	}

	.scrollArea[data-rounded="md"] {
		border-radius: var(--radius-md);
	}

	.scrollArea[data-rounded="lg"] {
		border-radius: var(--radius-lg);
	}

	.scrollArea[data-rounded="xl"] {
		border-radius: var(--radius-xl);
	}

	.scrollArea[data-rounded="2xl"] {
		border-radius: var(--radius-2xl);
	}

	.scrollArea[data-rounded="3xl"] {
		border-radius: var(--radius-3xl);
	}

	.scrollArea[data-rounded="4xl"] {
		border-radius: var(--radius-4xl);
	}

	/* A true pill; tall content can clip at the corners, so use 3xl or 4xl to stay safe */
	.scrollArea[data-rounded="pill"] {
		border-radius: var(--radius-pill);
	}
</style>
