<script lang="ts">
	import { DOWN_COLOR, UP_COLOR, useCompCtx } from "./ctx.svelte.js";
	import type { InfoProps } from "./index.js";
	const { variant = "default", size, rounded, class: className, ...props }: InfoProps = $props();
	const ctx = useCompCtx();
	// Space in pixels between the info and the plot's top-left corner, matching the overlay legend.
	const INSET = 4;
	// The hovered or focused candle, else the latest, so the line always reads something.
	const index = $derived(ctx.data[ctx.activeIndex] ? ctx.activeIndex : ctx.data.length - 1);
	const candle = $derived(ctx.data[index]);
	const change = $derived(candle ? ctx.getChange(index) : null);

	// Clear the height once the info goes away, so an overlay legend moves back up.
	$effect(() => () => (ctx.infoHeight = 0));
</script>

<!-- Open, high, low, close, change, and volume of one candle on one row in the plot's top-left corner; the table and announcements carry the same values for screen readers. -->
{#if candle && change}
	<div class={["candlestickChartInfo", className]} aria-hidden="true" data-variant={variant} data-size={size} data-rounded={rounded} bind:clientHeight={ctx.infoHeight} style:--candlestick-chart-series-color={candle.close >= candle.open ? UP_COLOR : DOWN_COLOR} style:--candlestick-chart-info-top="{ctx.marginTop + INSET}px" style:--candlestick-chart-info-left="{ctx.marginLeft + INSET}px" style:--candlestick-chart-info-width="{Math.max(0, ctx.plotWidth - INSET * 2)}px" {...props}>
		<dl class="candlestickChartInfoRow">
			<dt>O</dt>
			<dd>{ctx.formatPriceValue(candle.open)}</dd>
			<dt>H</dt>
			<dd>{ctx.formatPriceValue(candle.high)}</dd>
			<dt>L</dt>
			<dd>{ctx.formatPriceValue(candle.low)}</dd>
			<dt>C</dt>
			<dd>{ctx.formatPriceValue(candle.close)}</dd>
			<dd>{change.change >= 0 ? "+" : "−"}{ctx.formatPriceValue(Math.abs(change.change))} ({change.change >= 0 ? "+" : "−"}{Math.abs(change.changePercent).toFixed(2)}%)</dd>
			<!-- Volume shares the row, marked V like the price letters. -->
			{#if candle.volume !== undefined}
				<dt>V</dt>
				<dd>{ctx.formatVolumeValue(candle.volume)}</dd>
			{/if}
		</dl>
	</div>
{/if}

<style>
	/* Lines of values over the plot's top-left corner; presses pass through to the plot so drags still start here */
	.candlestickChartInfo {
		display: flex;
		position: absolute;
		top: var(--candlestick-chart-info-top);
		left: var(--candlestick-chart-info-left);
		flex-direction: column;
		gap: calc(var(--spacing-xs) / 2);
		z-index: 1;
		max-width: var(--candlestick-chart-info-width);
		pointer-events: none;
		font-variant-numeric: tabular-nums;
	}

	/* One line of label and value pairs that wraps on narrow charts */
	.candlestickChartInfoRow {
		display: flex;
		flex-wrap: wrap;
		gap: 0 var(--spacing-xs);
		margin: 0;
	}

	/* Labels stay in text colors */
	.candlestickChartInfoRow dt {
		color: var(--muted-foreground);
	}

	/* Values take the candle's rising or falling color, with room before the next label */
	.candlestickChartInfoRow dd {
		margin: 0 var(--spacing-xs) 0 0;
		color: var(--candlestick-chart-series-color);
	}

	/* =============== Variants =============== */

	/* Boxed variants share the radius and padding */
	.candlestickChartInfo:is([data-variant="secondary"], [data-variant="outline"], [data-variant="card"]) {
		border-radius: var(--candlestick-chart-radius);
		padding: calc(var(--spacing-xs) / 2) var(--spacing-xs);
	}

	/* Filled box in the secondary color; the values keep the rising or falling color */
	.candlestickChartInfo[data-variant="secondary"] {
		background-color: var(--secondary);
	}

	/* Bordered box on the page background */
	.candlestickChartInfo[data-variant="outline"] {
		border: 1px solid var(--border);
		background-color: var(--background);
	}

	/* Blurred backdrop, so busy candles stay readable under the values */
	.candlestickChartInfo[data-variant="card"] {
		backdrop-filter: blur(4px);
		background-color: color-mix(in oklab, var(--background) 75%, transparent);
	}

	/* =============== Sizes =============== */

	/* Large */
	.candlestickChartInfo[data-size="lg"] {
		border-radius: var(--radius-lg);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	.candlestickChartInfo:is([data-variant="secondary"], [data-variant="outline"], [data-variant="card"])[data-size="lg"] {
		padding: calc(var(--spacing-xs) / 2) var(--spacing-sm);
	}

	/* Medium */
	.candlestickChartInfo[data-size="md"] {
		border-radius: var(--radius-md);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* Small */
	.candlestickChartInfo[data-size="sm"] {
		border-radius: var(--radius-sm);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* Extra small */
	.candlestickChartInfo[data-size="xs"] {
		border-radius: var(--radius-xs);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius with this exact value; it shows on the `card` backdrop and must stay after the size rules */
	.candlestickChartInfo[data-rounded="xs"] {
		border-radius: var(--radius-xs);
	}

	.candlestickChartInfo[data-rounded="sm"] {
		border-radius: var(--radius-sm);
	}

	.candlestickChartInfo[data-rounded="md"] {
		border-radius: var(--radius-md);
	}

	.candlestickChartInfo[data-rounded="lg"] {
		border-radius: var(--radius-lg);
	}

	.candlestickChartInfo[data-rounded="xl"] {
		border-radius: var(--radius-xl);
	}

	.candlestickChartInfo[data-rounded="2xl"] {
		border-radius: var(--radius-2xl);
	}

	.candlestickChartInfo[data-rounded="3xl"] {
		border-radius: var(--radius-3xl);
	}

	.candlestickChartInfo[data-rounded="4xl"] {
		border-radius: var(--radius-4xl);
	}

	/* Half the height of one line plus the card padding, since the info wraps on narrow charts */
	.candlestickChartInfo[data-rounded="pill"] {
		border-radius: calc(0.5lh + var(--spacing-xs) / 2);
	}
</style>
