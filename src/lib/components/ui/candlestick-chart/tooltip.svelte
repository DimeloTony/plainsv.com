<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	const ctx = useCompCtx();
	// Space in pixels between the tooltip and the candle it describes.
	const OFFSET = 16;
	let tooltipWidth = $state(0);
	let tooltipHeight = $state(0);
	const candle = $derived(ctx.data[ctx.activeIndex]);
	const label = $derived(ctx.formatCandleTime(ctx.activeIndex));
	const session = $derived(ctx.getSessionLabel(ctx.activeIndex));
	const change = $derived(ctx.getChange(ctx.activeIndex));
	const indicators = $derived(ctx.getIndicatorValues(ctx.activeIndex));
	const fields = $derived([
		["Open", ctx.formatPriceValue(candle.open)],
		["High", ctx.formatPriceValue(candle.high)],
		["Low", ctx.formatPriceValue(candle.low)],
		["Close", ctx.formatPriceValue(candle.close)],
	]);
	// Sit beside the candle, near the top of the price pane, and flip left when the right side has no room.
	const anchorX = $derived(ctx.x(ctx.activeIndex));
	const left = $derived(Math.max(0, anchorX + OFFSET + tooltipWidth > ctx.marginLeft + ctx.plotWidth ? anchorX - OFFSET - tooltipWidth : anchorX + OFFSET));
	const top = $derived(Math.min(ctx.marginTop + 4, Math.max(0, ctx.height - tooltipHeight)));
</script>

<!-- Readout of the active candle; screen readers get the live region instead. -->
<div class="candlestickChartTooltip" aria-hidden="true" style:--candlestick-chart-tooltip-x="{left}px" style:--candlestick-chart-tooltip-y="{top}px" bind:offsetWidth={tooltipWidth} bind:offsetHeight={tooltipHeight}>
	{#if ctx.tooltip}
		{@render ctx.tooltip({ index: ctx.activeIndex, candle, label, session, ...change, indicators })}
	{:else}
		<p class="candlestickChartTooltipLabel">{label}</p>
		{#if session}
			<p class="candlestickChartTooltipSession">{session}</p>
		{/if}
		<dl class="candlestickChartTooltipGrid">
			{#each fields as [name, value] (name)}
				<dt>{name}</dt>
				<dd>{value}</dd>
			{/each}
			<dt>Change</dt>
			<!-- The arrow carries the direction, so the text keeps the text color. -->
			<dd>{change.change >= 0 ? "▲" : "▼"} {ctx.formatPriceValue(Math.abs(change.change))} ({Math.abs(change.changePercent).toFixed(2)}%)</dd>
			{#if candle.volume !== undefined}
				<dt>Volume</dt>
				<dd>{ctx.formatVolumeValue(candle.volume)}</dd>
			{/if}
		</dl>
		{#if indicators.length}
			<ul class="candlestickChartTooltipList">
				{#each indicators as indicator (indicator.label)}
					<li class="candlestickChartTooltipItem">
						<span class="candlestickChartTooltipKey" style:--candlestick-chart-series-color={indicator.color}></span>
						<span class="candlestickChartTooltipName">{indicator.label}</span>
						<span class="candlestickChartTooltipValue">{indicator.formattedValue}</span>
					</li>
				{/each}
			</ul>
		{/if}
	{/if}
</div>

<style>
	/* Base tooltip; placed by the chart through `--candlestick-chart-tooltip-x` and `--candlestick-chart-tooltip-y` */
	.candlestickChartTooltip {
		display: flex;
		position: absolute;
		top: var(--candlestick-chart-tooltip-y);
		left: var(--candlestick-chart-tooltip-x);
		flex-direction: column;
		gap: var(--spacing-xs);
		z-index: 1;
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		background-color: var(--popover);
		padding: var(--spacing-xs) var(--spacing-sm);
		min-width: 9rem; /* 144px */
		pointer-events: none;
		color: var(--popover-foreground);
	}

	/* Candle time */
	.candlestickChartTooltipLabel {
		margin: 0;
		font-weight: 500;
	}

	/* Session or highlight the candle falls in */
	.candlestickChartTooltipSession {
		margin: 0;
		color: var(--muted-foreground);
	}

	/* Two columns of names and values */
	.candlestickChartTooltipGrid {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: calc(var(--spacing-xs) / 2) var(--spacing-md);
		margin: 0;
	}

	.candlestickChartTooltipGrid dt {
		color: var(--muted-foreground);
	}

	/* Values lead: strong and aligned */
	.candlestickChartTooltipGrid dd {
		margin: 0;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		text-align: end;
	}

	.candlestickChartTooltipList {
		display: flex;
		flex-direction: column;
		gap: calc(var(--spacing-xs) / 2);
		margin: 0;
		border-top: 1px solid var(--border);
		padding: var(--spacing-xs) 0 0;
		list-style: none;
	}

	.candlestickChartTooltipItem {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
	}

	/* Short line in the indicator color; the text stays in text colors */
	.candlestickChartTooltipKey {
		flex-shrink: 0;
		border-radius: var(--radius-pill);
		background-color: var(--candlestick-chart-series-color);
		width: 0.75rem; /* 12px */
		height: 2px;
	}

	.candlestickChartTooltipName {
		flex: 1;
		color: var(--muted-foreground);
	}

	.candlestickChartTooltipValue {
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}
</style>
