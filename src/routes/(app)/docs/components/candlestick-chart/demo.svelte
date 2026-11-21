<script lang="ts">
	const { name = "preview" }: Props = $props();
	// Each demo is its own chunk, loaded only once it scrolls near the screen, so the page builds a few charts at a time.
	const demos = import.meta.glob<{ default: Component }>("./demos/*.svelte");
	let isVisible = $state(false);
	const loadDemo = $derived(demos[`./demos/${name}.svelte`]);

	/** Shows the demo once it comes within a screen of the viewport, and keeps it mounted after that so its state stays. */
	function revealNearViewport(element: HTMLElement) {
		const observer = new IntersectionObserver(
			([entry]) => {
				// If the demo is still far from the viewport: keep waiting.
				if (!entry.isIntersecting) return;
				isVisible = true;
				observer.disconnect();
			},
			{ rootMargin: "400px 0px" },
		);
		observer.observe(element);
		return () => observer.disconnect();
	}

	/** Live preview for one section of the candlestick chart docs */
	interface Props {
		/** Which example to render, matching a file in `./demos` */
		name?: "preview" | "sessions" | "highlights" | "live" | "levels" | "level-snippet" | "info" | "parts" | "ready" | "legend-variants" | "position-stages" | "vwap" | "averages" | "bollinger" | "volume" | "zoom" | "variant" | "colors" | "grid" | "format" | "tooltip" | "groups" | "markers" | "sentiment" | "marker-snippet" | "positions" | "legend-scroll" | "sizes" | "table";
	}
</script>

<div class="demo" {@attach revealNearViewport}>
	{#if isVisible}
		{#await loadDemo() then module}
			<module.default />
		{/await}
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: var(--spacing-xl);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 1rem 0;
	}

	/* Holds the space of a default chart until the demo renders, as Svelte's comment anchors still count as empty, so the page barely shifts while scrolling */
	.demo:empty {
		min-height: 24rem; /* 384px */
	}

	.demo :global(.demoColumn) {
		display: flex;
		flex: 1 1 100%;
		flex-direction: column;
		gap: var(--spacing-sm);
		min-width: 0;
		font-size: var(--text-sm);
	}

	.demo :global(.demoChart) {
		flex: 1 1 100%;
	}

	.demo :global(.demoHalf) {
		flex: 1 1 18rem; /* 288px */
	}

	/* Phone-width chart, so the scrolling legend overflows */
	.demo :global(.demoNarrow) {
		flex: 1 1 auto;
		max-width: 20rem; /* 320px */
	}
</style>
