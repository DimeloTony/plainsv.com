<svelte:options namespace="svg" />

<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	const ctx = useCompCtx();
	// Space in pixels between the plot and its labels.
	const TICK_PADDING = 8;
	// Space in pixels kept clear around the crosshair's time tag.
	const TAG_CLEARANCE = 4;
	const plotRight = $derived(ctx.marginLeft + ctx.plotWidth);

	/** Whether a price label sits under a tag on the price axis, so the tag can cover it cleanly. */
	function isPriceCovered(y: number) {
		return ctx.priceTagYs.some((tagY) => Math.abs(tagY - y) < ctx.tagHeight);
	}

	/** Whether a time label sits under the crosshair's time tag. */
	function isTimeCovered(x: number, label: string) {
		const tag = ctx.timeTag;
		const halfWidth = ctx.measureText([label]) / 2 + TAG_CLEARANCE;
		return !!tag && x + halfWidth > tag.x && x - halfWidth < tag.x + tag.width;
	}
</script>

<!-- Price grid with labels on the right, the trading convention. -->
<g class="candlestickChartGrid">
	{#each ctx.priceTicks as tick (tick)}
		{@const y = ctx.priceToY(tick)}
		{#if ctx.grid}
			<line x1={ctx.marginLeft} x2={plotRight} y1={y} y2={y} />
		{/if}
		{#if !isPriceCovered(y)}
			<text class="candlestickChartTick" x={plotRight + TICK_PADDING} {y} dominant-baseline="middle">{ctx.formatPriceValue(tick)}</text>
		{/if}
	{/each}
</g>

<!-- Time grid through both panes, with labels on calendar boundaries. -->
<g class="candlestickChartGrid">
	{#each ctx.timeTicks as tick (tick.index)}
		{@const x = ctx.x(tick.index)}
		{#if ctx.grid}
			<line x1={x} x2={x} y1={ctx.marginTop} y2={ctx.plotBottom} />
		{/if}
		{#if !isTimeCovered(x, tick.label)}
			<text class="candlestickChartTick" {x} y={ctx.plotBottom + TICK_PADDING} text-anchor="middle" dominant-baseline="hanging">{tick.label}</text>
		{/if}
	{/each}
</g>

<!-- Volume pane top edge and its highest value. -->
{#if ctx.showVolume && ctx.volumeHeight > 0}
	<g class="candlestickChartGrid">
		<line x1={ctx.marginLeft} x2={plotRight} y1={ctx.volumeTop} y2={ctx.volumeTop} />
		<text class="candlestickChartTick" x={plotRight + TICK_PADDING} y={ctx.volumeTop} dominant-baseline="hanging">{ctx.formatVolumeValue(ctx.maxVolume)}</text>
	</g>
{/if}

<!-- Axis lines along the right and bottom of the plot. -->
<g class="candlestickChartAxis">
	<line x1={plotRight} x2={plotRight} y1={ctx.marginTop} y2={ctx.plotBottom} />
	<line x1={ctx.marginLeft} x2={plotRight} y1={ctx.plotBottom} y2={ctx.plotBottom} />
</g>

<style>
	/* Recessive hairline grid */
	.candlestickChartGrid line {
		shape-rendering: crispEdges;
		stroke: color-mix(in oklab, var(--border) 70%, transparent);
		stroke-width: 1px;
	}

	/* Axis lines, one step stronger than the grid */
	.candlestickChartAxis line {
		shape-rendering: crispEdges;
		stroke: var(--border);
		stroke-width: 1px;
	}

	/* Axis text uses the muted text color */
	.candlestickChartTick {
		fill: var(--muted-foreground);
		font-size: inherit;
	}
</style>
