<script lang="ts">
	import { MARKER_GAP, useCompCtx } from "./ctx.svelte.js";
	const ctx = useCompCtx();
	// Markers on the candles on screen, anchored in layer pixels: the edge nearest the candle, or the center for price markers.
	const visibleMarkers = $derived.by(() => {
		const first = ctx.visibleIndexes[0] ?? 0;
		const last = ctx.visibleIndexes.at(-1) ?? -1;
		return ctx.placedMarkers
			.filter((item) => item.index >= first && item.index <= last)
			.map((item) => {
				const candle = ctx.data[item.index];
				const y = item.side === "above" ? ctx.priceToY(candle.high) - MARKER_GAP - item.offset : item.side === "below" ? ctx.priceToY(candle.low) + MARKER_GAP + item.offset : ctx.priceToY(item.marker.price ?? candle.close);
				return { ...item, candle, x: ctx.x(item.index) - ctx.marginLeft, y };
			});
	});
</script>

<!-- Marks pinned to candles, clipped to the price pane; the tooltip and table describe them for screen readers. -->
<div class="candlestickChartMarkers" aria-hidden="true" style:--candlestick-chart-markers-left="{ctx.marginLeft}px" style:--candlestick-chart-markers-width="{ctx.plotWidth}px" style:--candlestick-chart-markers-height="{ctx.marginTop + ctx.priceHeight}px" style:--candlestick-chart-marker-tag-height="{ctx.tagHeight}px" style:--candlestick-chart-marker-gap="{MARKER_GAP}px">
	{#each visibleMarkers as item (item.position)}
		<span class="candlestickChartMarker" data-side={item.side} data-shape={item.shape} data-active={item.index === ctx.activeIndex || undefined} style:--candlestick-chart-series-color={item.color} style:--candlestick-chart-marker-x="{item.x}px" style:--candlestick-chart-marker-y="{item.y}px" style:--candlestick-chart-marker-size="{item.size}px">
			{#if ctx.marker}
				{@render ctx.marker({ marker: item.marker, index: item.index, candle: item.candle, color: item.color })}
			{:else}
				<span class="candlestickChartMarkerShape"></span>
				{#if item.marker.text}
					<span class="candlestickChartMarkerText">{item.marker.text}</span>
				{/if}
			{/if}
		</span>
	{/each}
</div>

<style>
	/* Layer over the plot, clipped so markers stop at the price axis while panning */
	.candlestickChartMarkers {
		position: absolute;
		top: 0;
		left: var(--candlestick-chart-markers-left);
		width: var(--candlestick-chart-markers-width);
		height: var(--candlestick-chart-markers-height);
		overflow: hidden;
		pointer-events: none;
	}

	/* One marker: its shape and text tag, anchored at `--candlestick-chart-marker-x` and `--candlestick-chart-marker-y` */
	.candlestickChartMarker {
		display: flex;
		position: absolute;
		top: var(--candlestick-chart-marker-y);
		left: var(--candlestick-chart-marker-x);
		align-items: center;
		gap: var(--spacing-xs);
		transition: filter 150ms cubic-bezier(0.4, 0, 0.2, 1);
	}

	.candlestickChartMarkerShape {
		flex-shrink: 0;
		box-sizing: border-box;
		background-color: var(--candlestick-chart-series-color);
		width: var(--candlestick-chart-marker-size);
		height: var(--candlestick-chart-marker-size);
	}

	/* Short text in a tag outlined in the marker color; the text stays in text colors */
	.candlestickChartMarkerText {
		display: flex;
		align-items: center;
		box-sizing: border-box;
		border: 1px solid var(--candlestick-chart-series-color);
		border-radius: var(--radius-xs);
		background-color: var(--popover);
		padding: 0 calc(var(--spacing-xs) / 2);
		height: var(--candlestick-chart-marker-tag-height);
		color: var(--popover-foreground);
		font-weight: 600;
		white-space: nowrap;
	}

	/* =============== Variants =============== */

	/* Above the high: the shape sits nearest the candle with the tag over it */
	.candlestickChartMarker[data-side="above"] {
		flex-direction: column-reverse;
		gap: var(--candlestick-chart-marker-gap);
		transform: translate(-50%, -100%);
	}

	/* Below the low: the shape sits nearest the candle with the tag under it */
	.candlestickChartMarker[data-side="below"] {
		flex-direction: column;
		gap: var(--candlestick-chart-marker-gap);
		transform: translateX(-50%);
	}

	/* At a price: the shape centers on the price with the tag to its right */
	.candlestickChartMarker[data-side="price"] {
		transform: translate(calc(var(--candlestick-chart-marker-size) / -2), -50%);
	}

	.candlestickChartMarker[data-shape="arrowUp"] .candlestickChartMarkerShape {
		clip-path: polygon(50% 0, 100% 100%, 0 100%);
	}

	.candlestickChartMarker[data-shape="arrowDown"] .candlestickChartMarkerShape {
		clip-path: polygon(0 0, 100% 0, 50% 100%);
	}

	/* Bubble: a soft fill and a solid ring, so overlapping candles still show through */
	.candlestickChartMarker[data-shape="circle"] .candlestickChartMarkerShape {
		border: 1px solid var(--candlestick-chart-series-color);
		border-radius: var(--radius-pill);
		background-color: color-mix(in oklab, var(--candlestick-chart-series-color) 35%, transparent);
	}

	.candlestickChartMarker[data-shape="square"] .candlestickChartMarkerShape {
		border-radius: var(--radius-xs);
	}

	/* =============== States =============== */

	/* Markers on the hovered candle lift slightly, like its body */
	.candlestickChartMarker[data-active] {
		filter: brightness(1.12);
	}
</style>
