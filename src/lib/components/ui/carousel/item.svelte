<script lang="ts">
	import type { ItemProps } from "./index.js";
	const { children, class: className, ...props }: ItemProps = $props();
</script>

<!-- One slide; its width is a share of the view, minus the gaps. -->
<div class={["carouselItem", className]} role="group" aria-roledescription="slide" data-carousel-item {...props}>
	{@render children()}
</div>

<style>
	/* Base slide; `--carousel-per-view` slides fill the view */
	.carouselItem {
		flex: 0 0 calc((100% - (var(--carousel-per-view) - 1) * var(--carousel-gap)) / var(--carousel-per-view));
		box-sizing: border-box;
		min-width: 0;
		min-height: 0;
		scroll-snap-align: start;
	}
</style>
