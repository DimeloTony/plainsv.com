<script lang="ts">
	import { untrack } from "svelte";
	import { setCompCtx } from "./ctx.svelte.js";
	import type { Props } from "./index.js";
	import type { CompCtxProps } from "./ctx.svelte.js";
	let { orientation = "horizontal", perView = 1, loop = false, selectedIndex = $bindable(0), onSelectedIndexChange, size = "md", children, onkeydown, class: className, ...props }: Props = $props();
	const contextData: CompCtxProps = $derived({ orientation, loop, size, onSelectedIndexChange });
	const ctx = setCompCtx({ ...contextData });

	// Keep the shared settings in sync when the props change.
	$effect.pre(() => void Object.assign(ctx, contextData));

	// Scroll to a slide when the parent sets `selectedIndex`, and report the slide the user scrolled to.
	$effect.pre(() => {
		const index = selectedIndex;
		if (index !== untrack(() => ctx.selectedIndex)) ctx.scrollTo(index);
	});
	$effect.pre(() => void (selectedIndex = ctx.selectedIndex));

	/** Moves between slides with the arrow keys along the orientation. */
	const handleKeydown = (e: KeyboardEvent) => {
		onkeydown?.(e);
		// If a passed handler prevented the default, or focus is in a text field: leave the key alone.
		if (e.defaultPrevented || (e.target instanceof Element && e.target.closest("input, textarea, select, [contenteditable='true']"))) return;
		const isVertical = ctx.orientation === "vertical";
		if (e.key === (isVertical ? "ArrowUp" : "ArrowLeft")) {
			e.preventDefault();
			ctx.scrollPrev();
		} else if (e.key === (isVertical ? "ArrowDown" : "ArrowRight")) {
			e.preventDefault();
			ctx.scrollNext();
		}
	};
</script>

<!-- Carousel landmark; the buttons sit outside its edges. -->
<div class={["carousel not-typeset", className]} role="region" aria-roledescription="carousel" data-orientation={ctx.orientation} data-size={ctx.size} style:--carousel-per-view={perView} onkeydown={handleKeydown} {...props}>
	{@render children()}
</div>

<style>
	/* Base carousel; the buttons are placed against it */
	.carousel {
		position: relative;
	}

	/* =============== Sizes =============== */

	/* Large; the track, slides, and buttons read these */
	.carousel[data-size="lg"] {
		--carousel-gap: var(--spacing-xl);
		--carousel-button: var(--control-height-md);
	}

	/* Medium — default */
	.carousel[data-size="md"] {
		--carousel-gap: var(--spacing-lg);
		--carousel-button: var(--control-height-sm);
	}

	/* Small */
	.carousel[data-size="sm"] {
		--carousel-gap: var(--spacing-md);
		--carousel-button: var(--control-height-xs);
	}

	/* Extra small */
	.carousel[data-size="xs"] {
		--carousel-gap: var(--spacing-sm);
		--carousel-button: var(--control-height-xs);
	}
</style>
