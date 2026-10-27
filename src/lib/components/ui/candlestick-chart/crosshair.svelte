<svelte:options namespace="svg" />

<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	const ctx = useCompCtx();
	// Space in pixels around a tag's text.
	const TAG_PADDING = 5;
	const tagHeight = $derived(ctx.tagHeight);
	const plotRight = $derived(ctx.marginLeft + ctx.plotWidth);
	const x = $derived(ctx.x(ctx.activeIndex));
	const y = $derived(ctx.crosshairY);
	const priceText = $derived(ctx.formatPriceValue(ctx.yToPrice(y)));
</script>

<!-- Crosshair: a vertical line snapped to the candle, a horizontal line at the pointer, and tags on both axes. -->
{#if ctx.timeTag}
	<g class="candlestickChartCrosshair">
		<line x1={x} x2={x} y1={ctx.marginTop} y2={ctx.plotBottom} />
		<line x1={ctx.marginLeft} x2={plotRight} y1={y} y2={y} />
		<rect class="candlestickChartCrosshairTag" x={plotRight + 1} y={y - tagHeight / 2} width={ctx.measureText([priceText]) + TAG_PADDING * 2} height={tagHeight} />
		<text class="candlestickChartCrosshairText" x={plotRight + 1 + TAG_PADDING} {y} dominant-baseline="middle">{priceText}</text>
		<rect class="candlestickChartCrosshairTag" x={ctx.timeTag.x} y={ctx.plotBottom + 2} width={ctx.timeTag.width} height={tagHeight} />
		<text class="candlestickChartCrosshairText" x={ctx.timeTag.x + ctx.timeTag.width / 2} y={ctx.plotBottom + 2 + tagHeight / 2} text-anchor="middle" dominant-baseline="middle">{ctx.timeTag.text}</text>
	</g>
{/if}

<style>
	/* Recessive hairlines */
	.candlestickChartCrosshair line {
		shape-rendering: crispEdges;
		stroke: color-mix(in oklab, var(--muted-foreground) 60%, transparent);
		stroke-width: 1px;
	}

	/* Inverted tag, so it reads over the axis labels it covers */
	.candlestickChartCrosshairTag {
		fill: var(--foreground);
		rx: var(--radius-xs);
	}

	.candlestickChartCrosshairText {
		fill: var(--background);
		font-size: inherit;
	}
</style>
