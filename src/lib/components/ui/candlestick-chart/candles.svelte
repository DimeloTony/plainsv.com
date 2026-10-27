<svelte:options namespace="svg" />

<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	import { getAreaPath, getLinePath } from "#lib/components/ui/chart/utils.js";
	import type { Point } from "#lib/components/ui/chart/utils.js";
	const ctx = useCompCtx();
	const isCloseLine = $derived(ctx.variant === "line" || ctx.variant === "area");
	// One candle past each edge, so the close line runs to the edge of the plot before the clip.
	const closePoints: Point[] = $derived.by(() => {
		const first = Math.max(0, (ctx.visibleIndexes[0] ?? 0) - 1);
		const last = Math.min(ctx.data.length - 1, (ctx.visibleIndexes.at(-1) ?? -1) + 1);
		return Array.from({ length: Math.max(0, last - first + 1) }, (_, offset): Point => [ctx.x(first + offset), ctx.priceToY(ctx.data[first + offset].close)]);
	});
	const priceBottom = $derived(ctx.marginTop + ctx.priceHeight);
</script>

{#if isCloseLine}
	<!-- Line or area of the closes, for a calmer view of the trend. -->
	<g class="candlestickChartCloses">
		{#if ctx.variant === "area"}
			<path
				class="candlestickChartCloseArea"
				d={getAreaPath(
					closePoints,
					closePoints.map(([x]): Point => [x, priceBottom]),
					"linear",
				)}
			/>
		{/if}
		<path class="candlestickChartCloseLine" d={getLinePath(closePoints, "linear")} />
		{#if ctx.activeIndex >= 0 && ctx.data[ctx.activeIndex]}
			<circle class="candlestickChartCloseDot" cx={ctx.x(ctx.activeIndex)} cy={ctx.priceToY(ctx.data[ctx.activeIndex].close)} r="4" />
		{/if}
	</g>
{:else}
	<!-- One mark per visible candle: a wick and body, or an OHLC bar with open and close ticks; a close at or above the open rises. -->
	<g class="candlestickChartCandles" data-variant={ctx.variant}>
		{#each ctx.visibleIndexes as index (index)}
			{@const candle = ctx.data[index]}
			{@const x = ctx.x(index)}
			{@const openY = ctx.priceToY(candle.open)}
			{@const closeY = ctx.priceToY(candle.close)}
			{@const tick = ctx.bodyWidth / 2}
			<g class="candlestickChartCandle" data-direction={candle.close >= candle.open ? "up" : "down"} data-active={index === ctx.activeIndex || undefined}>
				<line class="candlestickChartWick" x1={x} x2={x} y1={ctx.priceToY(candle.high)} y2={ctx.priceToY(candle.low)} />
				{#if ctx.variant === "ohlc"}
					<!-- Open ticks left and close ticks right, so direction reads without color. -->
					<line class="candlestickChartTick" x1={x - tick} x2={x} y1={openY} y2={openY} />
					<line class="candlestickChartTick" x1={x} x2={x + tick} y1={closeY} y2={closeY} />
				{:else}
					<!-- A flat candle keeps a 1px body, so it still shows. -->
					<rect class="candlestickChartBody" x={x - ctx.bodyWidth / 2} y={Math.min(openY, closeY)} width={ctx.bodyWidth} height={Math.max(1, Math.abs(closeY - openY))} />
				{/if}
			</g>
		{/each}
	</g>
{/if}

<style>
	.candlestickChartWick {
		shape-rendering: crispEdges;
		stroke-width: 1px;
	}

	.candlestickChartBody {
		transition: filter 150ms cubic-bezier(0.4, 0, 0.2, 1);
	}

	/* Line of the closes */
	.candlestickChartCloseLine {
		fill: none;
		stroke: var(--candlestick-chart-line, var(--chart-1));
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 2px;
	}

	/* Soft wash under the close line */
	.candlestickChartCloseArea {
		fill: color-mix(in oklab, var(--candlestick-chart-line, var(--chart-1)) 12%, transparent);
	}

	/* 8px dot on the hovered close, with a ring in the surface color */
	.candlestickChartCloseDot {
		fill: var(--candlestick-chart-line, var(--chart-1));
		stroke: var(--candlestick-chart-surface, var(--background));
		stroke-width: 2px;
	}

	/* =============== Variants =============== */

	/* Rising candles */
	.candlestickChartCandle[data-direction="up"] :is(.candlestickChartWick, .candlestickChartTick) {
		stroke: var(--candlestick-chart-up, var(--chart-3));
	}

	.candlestickChartCandle[data-direction="up"] .candlestickChartBody {
		fill: var(--candlestick-chart-up, var(--chart-3));
	}

	/* Falling candles */
	.candlestickChartCandle[data-direction="down"] :is(.candlestickChartWick, .candlestickChartTick) {
		stroke: var(--candlestick-chart-down, var(--destructive));
	}

	.candlestickChartCandle[data-direction="down"] .candlestickChartBody {
		fill: var(--candlestick-chart-down, var(--destructive));
	}

	/* Hollow rising bodies, a second cue besides color */
	.candlestickChartCandles[data-variant="hollow"] .candlestickChartCandle[data-direction="up"] .candlestickChartBody {
		fill: var(--candlestick-chart-surface, var(--background));
		stroke: var(--candlestick-chart-up, var(--chart-3));
		stroke-width: 1px;
	}

	/* OHLC bars use thicker strokes, since they have no body */
	.candlestickChartCandles[data-variant="ohlc"] :is(.candlestickChartWick, .candlestickChartTick) {
		stroke-width: 1.5px;
	}

	/* =============== States =============== */

	/* Hovered candle lifts slightly */
	.candlestickChartCandle[data-active] .candlestickChartBody {
		filter: brightness(1.12);
	}
</style>
