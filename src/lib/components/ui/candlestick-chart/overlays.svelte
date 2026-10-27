<svelte:options namespace="svg" />

<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	import { getAreaPath, getLinePath } from "#lib/components/ui/chart/utils.js";
	import type { Point } from "#lib/components/ui/chart/utils.js";
	const ctx = useCompCtx();
	// One candle past each edge, so lines run to the edge of the plot before the clip.
	const indexes = $derived.by(() => {
		const first = Math.max(0, (ctx.visibleIndexes[0] ?? 0) - 1);
		const last = Math.min(ctx.data.length - 1, (ctx.visibleIndexes.at(-1) ?? -1) + 1);
		return Array.from({ length: Math.max(0, last - first + 1) }, (_, offset) => first + offset);
	});
	const overlays = $derived(
		ctx.visibleSeries.map((item) => ({
			...item,
			lineRuns: getRuns(item.line, item.breaks),
			bandRuns: item.bands.map((band) => ({ deviations: band.deviations, upper: getRuns(band.upper, item.breaks), lower: getRuns(band.lower, item.breaks) })),
		})),
	);

	/** Splits values into unbroken runs of points, so warm-up candles and restarts, such as a new VWAP day, leave no false line. */
	function getRuns(values: number[], breaks: number[]) {
		const runs: Point[][] = [];
		let current: Point[] | null = null;
		for (const index of indexes) {
			const value = values[index];
			// If the value is not defined yet: end the current run.
			if (!Number.isFinite(value)) {
				current = null;
				continue;
			}
			// If the indicator restarts here: begin a new run.
			if (!current || breaks.includes(index)) {
				current = [];
				runs.push(current);
			}
			current.push([ctx.x(index), ctx.priceToY(value)]);
		}
		return runs;
	}
</script>

<!-- Band fills first, then their edges, then every main line on top. -->
<g class="candlestickChartOverlays">
	{#each overlays as overlay (overlay.label)}
		{#each overlay.bandRuns as band (band.deviations)}
			{#each band.upper as upper, position (position)}
				<path class="candlestickChartBandFill" d={getAreaPath(upper, band.lower[position] ?? [], "linear")} style:--candlestick-chart-series-color={overlay.color} />
				<path class="candlestickChartBandEdge" d={getLinePath(upper, "linear")} style:--candlestick-chart-series-color={overlay.color} />
				<path class="candlestickChartBandEdge" d={getLinePath(band.lower[position] ?? [], "linear")} style:--candlestick-chart-series-color={overlay.color} />
			{/each}
		{/each}
	{/each}
	{#each overlays as overlay (overlay.label)}
		{#each overlay.lineRuns as run, position (position)}
			<path class="candlestickChartOverlayLine" d={getLinePath(run, "linear")} style:--candlestick-chart-series-color={overlay.color} />
		{/each}
	{/each}
</g>

<style>
	/* Soft wash between a band's edges */
	.candlestickChartBandFill {
		fill: color-mix(in oklab, var(--candlestick-chart-series-color) 8%, transparent);
	}

	/* Hairline band edges */
	.candlestickChartBandEdge {
		fill: none;
		stroke: color-mix(in oklab, var(--candlestick-chart-series-color) 55%, transparent);
		stroke-width: 1px;
	}

	/* Indicator line, thinner than a chart line so the candles stay the story */
	.candlestickChartOverlayLine {
		fill: none;
		stroke: var(--candlestick-chart-series-color);
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 1.5px;
	}
</style>
