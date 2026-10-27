<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	const ctx = useCompCtx();
</script>

<!-- Legend; each button hides or shows its series, or its slice or ring, which keeps its color either way. -->
<ul class="chartLegend" aria-label={ctx.isCategorical ? "Categories" : "Series"}>
	{#each ctx.legendItems as series (series.key)}
		{@const isShown = !ctx.hidden.includes(series.key)}
		<li>
			<button type="button" class="chartLegendButton" aria-pressed={isShown} onclick={() => ctx.toggleSeries(series.key)}>
				<!-- Key mirrors the mark: a line for lines, a box for bars and areas. -->
				<span class="chartLegendKey" data-shape={ctx.type === "line" ? "line" : "box"} data-hidden={!isShown || undefined} style:--chart-series-color={series.color}></span>
				{series.label}
			</button>
		</li>
	{/each}
</ul>

<style>
	/* Base legend */
	.chartLegend {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--spacing-xs) var(--spacing-md);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.chartLegendButton {
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

	/* Box key for bars and areas */
	.chartLegendKey {
		flex-shrink: 0;
		border: 2px solid var(--chart-series-color);
		border-radius: calc(var(--radius-xs) / 2);
		background-color: var(--chart-series-color);
		width: 0.625rem; /* 10px */
		height: 0.625rem; /* 10px */
	}

	/* Line key for lines */
	.chartLegendKey[data-shape="line"] {
		border: none;
		border-radius: var(--radius-pill);
		width: 0.875rem; /* 14px */
		height: 2px;
	}

	/* =============== States =============== */

	.chartLegendButton:hover {
		color: var(--muted-foreground);
	}

	/* Hidden series: hollow key and muted text */
	.chartLegendButton[aria-pressed="false"] {
		color: var(--muted-foreground);
	}

	.chartLegendKey[data-hidden] {
		background-color: transparent;
	}

	.chartLegendKey[data-shape="line"][data-hidden] {
		background-color: color-mix(in oklab, var(--chart-series-color) 35%, transparent);
	}

	/* Keyboard focus ring */
	.chartLegendButton:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
	}
</style>
