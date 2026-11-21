<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	const ctx = useCompCtx();
</script>

<!-- Custom levels over the price pane, clipped so they stop at the price axis; the axis tags and table carry the prices for screen readers. -->
<div class="candlestickChartLevelLines" aria-hidden="true" style:--candlestick-chart-level-lines-top="{ctx.marginTop}px" style:--candlestick-chart-level-lines-left="{ctx.marginLeft}px" style:--candlestick-chart-level-lines-width="{ctx.plotWidth}px" style:--candlestick-chart-level-lines-height="{ctx.priceHeight}px">
	{#each ctx.levelLines as item (item.position)}
		<div class="candlestickChartLevelRow" style:--candlestick-chart-series-color={item.color} style:--candlestick-chart-level-x="{item.left - ctx.marginLeft}px" style:--candlestick-chart-level-y="{item.lineY - ctx.marginTop}px" style:--candlestick-chart-level-width="{item.right - item.left}px" style:--candlestick-chart-level-band="{item.bandHeight}px">
			{@render ctx.level?.({ level: item.level, color: item.color, bandHeight: item.bandHeight, width: item.right - item.left })}
		</div>
	{/each}
</div>

<style>
	/* Layer over the price pane, clipped so custom levels stop at the axes while panning */
	.candlestickChartLevelLines {
		position: absolute;
		top: var(--candlestick-chart-level-lines-top);
		left: var(--candlestick-chart-level-lines-left);
		width: var(--candlestick-chart-level-lines-width);
		height: var(--candlestick-chart-level-lines-height);
		overflow: hidden;
		pointer-events: none;
	}

	/* One level: a row across its span, centered on its price and at least as tall as its band; it moves with a transform so panning skips layout */
	.candlestickChartLevelRow {
		display: flex;
		position: absolute;
		top: var(--candlestick-chart-level-y);
		left: 0;
		align-items: center;
		transform: translate(var(--candlestick-chart-level-x), -50%);
		width: var(--candlestick-chart-level-width);
		min-height: var(--candlestick-chart-level-band);
	}
</style>
