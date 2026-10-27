<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	const ctx = useCompCtx();
</script>

<!-- Indicator legend above the plot; each button hides or shows its indicator, which keeps its color either way. -->
<ul class="candlestickChartLegend" aria-label="Indicators">
	{#each ctx.series as item (item.label)}
		{@const isShown = !ctx.hidden.includes(item.label)}
		<li>
			<button type="button" class="candlestickChartLegendButton" aria-pressed={isShown} onclick={() => ctx.toggleIndicator(item.label)}>
				<span class="candlestickChartLegendKey" data-hidden={!isShown || undefined} style:--candlestick-chart-series-color={item.color}></span>
				{item.label}
			</button>
		</li>
	{/each}
</ul>

<style>
	/* Base legend, one left-aligned row */
	.candlestickChartLegend {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-xs) var(--spacing-md);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.candlestickChartLegendButton {
		display: inline-flex;
		align-items: center;
		gap: calc(var(--spacing-xs) * 1.5); /* 6px */
		transition-duration: 150ms;
		transition-property: color, box-shadow;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		cursor: pointer;
		border-radius: var(--radius-sm);
		padding: calc(var(--spacing-xs) / 2) var(--spacing-xs);
		color: var(--foreground);
	}

	/* Line key, matching the indicator line */
	.candlestickChartLegendKey {
		flex-shrink: 0;
		border-radius: var(--radius-pill);
		background-color: var(--candlestick-chart-series-color);
		width: 0.875rem; /* 14px */
		height: 2px;
	}

	/* =============== States =============== */

	.candlestickChartLegendButton:hover {
		color: var(--muted-foreground);
	}

	/* Hidden indicator: faded key and muted text */
	.candlestickChartLegendButton[aria-pressed="false"] {
		color: var(--muted-foreground);
	}

	.candlestickChartLegendKey[data-hidden] {
		background-color: color-mix(in oklab, var(--candlestick-chart-series-color) 35%, transparent);
	}

	/* Keyboard focus ring */
	.candlestickChartLegendButton:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
	}
</style>
