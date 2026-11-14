<svelte:options namespace="svg" />

<script lang="ts">
	import { DOWN_COLOR, UP_COLOR, useCompCtx } from "./ctx.svelte.js";
	const ctx = useCompCtx();
	const plotRight = $derived(ctx.marginLeft + ctx.plotWidth);
	// Zone edges in pixels: from the entry candle to the exit candle, or to the right edge while open.
	const zones = $derived(
		ctx.placedPositions.map((item) => {
			const left = ctx.x(item.start);
			const right = item.end === null ? plotRight : ctx.x(item.end);
			const entryY = ctx.priceToY(item.position.entry);
			return { ...item, left, width: Math.max(0, right - left), entryY };
		}),
	);

	/** Top and height of the zone between the entry and another price. */
	function getZone(entryY: number, price: number) {
		const y = ctx.priceToY(price);
		return { y: Math.min(entryY, y), height: Math.abs(entryY - y) };
	}
</script>

<!-- Trade positions: a profit zone out to the target and a risk zone out to the stop, with a line at each price. -->
<g class="candlestickChartPositions">
	{#each zones as zone (zone.position.id)}
		{#if zone.width > 0}
			<g class="candlestickChartPosition" data-closed={zone.end !== null || undefined}>
				{#if zone.target !== undefined}
					{@const profit = getZone(zone.entryY, zone.target)}
					<rect class="candlestickChartPositionZone" x={zone.left} y={profit.y} width={zone.width} height={profit.height} style:--candlestick-chart-series-color={UP_COLOR} />
				{/if}
				{#if zone.stop !== undefined}
					{@const risk = getZone(zone.entryY, zone.stop)}
					<rect class="candlestickChartPositionZone" x={zone.left} y={risk.y} width={zone.width} height={risk.height} style:--candlestick-chart-series-color={DOWN_COLOR} />
				{/if}
				{#each zone.lines as line (line.field)}
					{@const y = ctx.priceToY(line.price)}
					<line class="candlestickChartPositionLine" x1={zone.left} x2={zone.left + zone.width} y1={y} y2={y} data-field={line.field} style:--candlestick-chart-series-color={line.color} />
				{/each}
			</g>
		{/if}
	{/each}
</g>

<style>
	/* Soft wash in the profit or risk color, so candles stay readable through it */
	.candlestickChartPositionZone {
		fill: color-mix(in oklab, var(--candlestick-chart-series-color) 14%, transparent);
	}

	/* Solid line at each price, apart from the dashed levels */
	.candlestickChartPositionLine {
		shape-rendering: crispEdges;
		stroke: var(--candlestick-chart-series-color);
		stroke-width: 1px;
	}

	/* The entry line reads a step stronger than the target and stop */
	.candlestickChartPositionLine[data-field="entry"] {
		stroke: var(--foreground);
	}

	/* =============== States =============== */

	/* Closed positions fade, so open trades lead */
	.candlestickChartPosition[data-closed] .candlestickChartPositionZone {
		fill: color-mix(in oklab, var(--candlestick-chart-series-color) 7%, transparent);
	}

	.candlestickChartPosition[data-closed] .candlestickChartPositionLine {
		stroke: color-mix(in oklab, var(--candlestick-chart-series-color) 50%, transparent);
	}

	.candlestickChartPosition[data-closed] .candlestickChartPositionLine[data-field="entry"] {
		stroke: color-mix(in oklab, var(--foreground) 50%, transparent);
	}
</style>
