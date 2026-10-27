<svelte:options namespace="svg" />

<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	const ctx = useCompCtx();
	// Space in pixels between the plot and its labels.
	const TICK_PADDING = 8;
	const plotRight = $derived(ctx.marginLeft + ctx.innerWidth);
	const plotBottom = $derived(ctx.marginTop + ctx.innerHeight);
	// Longest category label that fits beside horizontal bars.
	const maxLabelLength = $derived(Math.max(1, Math.floor((ctx.marginLeft - TICK_PADDING) / (ctx.fontSize * 0.6))));

	/** Shortens a category label that would run past the side margin. */
	function fitLabel(text: string) {
		return text.length > maxLabelLength ? `${text.slice(0, maxLabelLength - 1)}…` : text;
	}

	/** Anchors the first and last labels of a line or area to their edge, so they stay inside the plot. */
	function getAnchor(index: number) {
		// If the categories sit in bar slots: every label centers on its slot.
		if (ctx.type === "bar" || ctx.data.length < 2) return "middle";
		if (index === 0) return "start";
		return index === ctx.data.length - 1 ? "end" : "middle";
	}
</script>

<!-- Gridlines and value labels: across the plot for vertical charts, down it for horizontal bars. -->
<g class="chartGrid">
	{#each ctx.ticks as tick, position (tick)}
		{@const offset = ctx.valueToPixel(tick)}
		{#if ctx.isHorizontal}
			<line x1={offset} x2={offset} y1={ctx.marginTop} y2={plotBottom} />
			<text class="chartTick" x={offset} y={plotBottom + TICK_PADDING} text-anchor="middle" dominant-baseline="hanging">{ctx.tickLabels[position]}</text>
		{:else}
			<line x1={ctx.marginLeft} x2={plotRight} y1={offset} y2={offset} />
			<text class="chartTick" x={ctx.marginLeft - TICK_PADDING} y={offset} text-anchor="end" dominant-baseline="middle">{ctx.tickLabels[position]}</text>
		{/if}
	{/each}
</g>

<!-- Category labels, thinned so they never overlap. -->
<g class="chartCategories">
	{#each ctx.labels as text, position (position)}
		{#if position % ctx.labelStep === 0}
			{@const offset = ctx.categoryToPixel(position)}
			{#if ctx.isHorizontal}
				<text class="chartTick" x={ctx.marginLeft - TICK_PADDING} y={offset} text-anchor="end" dominant-baseline="middle">{fitLabel(text)}</text>
			{:else}
				<text class="chartTick" x={offset} y={plotBottom + TICK_PADDING} text-anchor={getAnchor(position)} dominant-baseline="hanging">{text}</text>
			{/if}
		{/if}
	{/each}
</g>

<style>
	/* Recessive hairline grid */
	.chartGrid line {
		shape-rendering: crispEdges;
		stroke: var(--border);
		stroke-width: 1px;
	}

	/* Axis text uses the muted text color, never a series color */
	.chartTick {
		fill: var(--muted-foreground);
		font-size: inherit;
	}
</style>
