<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	const { overlay = false }: Props = $props();
	const ctx = useCompCtx();
	// Space in pixels between the overlay legend and the plot's top-left corner.
	const OVERLAY_INSET = 4;

	/** Keeps presses on the overlay legend from starting a drag on the plot, whose pointer capture would swallow the click. */
	const stopPlotGesture = (e: Event) => e.stopPropagation();

	/** Legend of the indicators and the level and marker groups */
	interface Props {
		/** Floats the legend inside the plot instead of above it */
		overlay?: boolean;
	}
</script>

<!-- Legend; each button hides or shows its indicator or group, which keeps its color either way. -->
<!-- The overlay legend sits inside the plot, so it stops the plot's drag, zoom, and reset gestures from starting on it. -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<ul class="candlestickChartLegend" aria-label="Legend" data-overlay={overlay || undefined} style:--candlestick-chart-legend-top="{ctx.marginTop + OVERLAY_INSET}px" style:--candlestick-chart-legend-left="{ctx.marginLeft + OVERLAY_INSET}px" style:--candlestick-chart-legend-width="{Math.max(0, ctx.plotWidth - OVERLAY_INSET * 2)}px" onpointerdown={overlay ? stopPlotGesture : undefined} ondblclick={overlay ? stopPlotGesture : undefined} onkeydown={overlay ? stopPlotGesture : undefined}>
	{#each ctx.series as item (item.label)}
		{@const isShown = !ctx.hidden.includes(item.label)}
		<li>
			<button type="button" class="candlestickChartLegendButton" aria-pressed={isShown} onclick={() => ctx.toggleIndicator(item.label)}>
				<span class="candlestickChartLegendKey" data-hidden={!isShown || undefined} style:--candlestick-chart-series-color={item.color}></span>
				{item.label}
			</button>
		</li>
	{/each}
	{#if ctx.series.length && ctx.groups.length}
		<li class="candlestickChartLegendDivider" aria-hidden="true"></li>
	{/if}
	{#each ctx.groups as group (group.name)}
		{@const isShown = !ctx.hiddenGroups.includes(group.name)}
		<li>
			<button type="button" class="candlestickChartLegendButton" aria-pressed={isShown} onclick={() => ctx.toggleGroup(group.name)}>
				<span class="candlestickChartLegendKey" data-type={group.type} data-hidden={!isShown || undefined} style:--candlestick-chart-series-color={group.color}></span>
				{group.name}
			</button>
		</li>
	{/each}
</ul>

<style>
	/* Base legend, one left-aligned row */
	.candlestickChartLegend {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--spacing-xs) var(--spacing-md);
		margin: 0;
		border-bottom: 1px solid var(--border);
		padding: 0 0 var(--spacing-sm) 0;
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

	/* Thin line between the indicators and the groups */
	.candlestickChartLegendDivider {
		align-self: stretch;
		background-color: var(--border);
		width: 1px;
	}

	/* =============== Variants =============== */

	/* Floats in the plot's top-left corner over a soft backdrop, so it takes no space and the candles stay readable under it */
	.candlestickChartLegend[data-overlay] {
		position: absolute;
		top: var(--candlestick-chart-legend-top);
		left: var(--candlestick-chart-legend-left);
		z-index: 1;
		backdrop-filter: blur(4px);
		cursor: default;
		border-radius: var(--radius-md);
		background-color: color-mix(in oklab, var(--background) 75%, transparent);
		padding: calc(var(--spacing-xs) / 2);
		max-width: var(--candlestick-chart-legend-width);
	}

	/* Dashed key for a level group, matching the level lines */
	.candlestickChartLegendKey[data-type="level"] {
		border-top: 2px dashed var(--candlestick-chart-series-color);
		border-radius: 0;
		background-color: transparent;
		height: 0;
	}

	/* Dot key for a marker group */
	.candlestickChartLegendKey[data-type="marker"] {
		width: 0.5rem; /* 8px */
		height: 0.5rem; /* 8px */
	}

	/* =============== States =============== */

	.candlestickChartLegendButton:hover {
		color: var(--muted-foreground);
	}

	/* Hidden indicator or group: faded key and muted text */
	.candlestickChartLegendButton[aria-pressed="false"] {
		color: var(--muted-foreground);
	}

	.candlestickChartLegendKey[data-hidden] {
		background-color: color-mix(in oklab, var(--candlestick-chart-series-color) 35%, transparent);
	}

	.candlestickChartLegendKey[data-type="level"][data-hidden] {
		border-top-color: color-mix(in oklab, var(--candlestick-chart-series-color) 35%, transparent);
		background-color: transparent;
	}

	/* Keyboard focus ring */
	.candlestickChartLegendButton:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
	}
</style>
