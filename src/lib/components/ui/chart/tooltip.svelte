<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	const ctx = useCompCtx();
	// Space in pixels between the tooltip and the point it describes.
	const OFFSET = 12;
	// Percent of the whole, for pie and donut slices.
	const percentFormat = new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 });
	let tooltipWidth = $state(0);
	let tooltipHeight = $state(0);
	// Pie, donut, and radial charts name the row with its category label.
	const label = $derived(ctx.rows[ctx.activeIndex]?.label ?? "");
	const items = $derived(ctx.getTooltipItems(ctx.activeIndex));
	// Follow the pointer; with the keyboard, sit beside the active row's mark.
	const anchor = $derived(ctx.pointer ?? ctx.getAnchor(ctx.activeIndex));
	// Flip to the left of the anchor when the right side has no room, and keep the tooltip inside the plot.
	const left = $derived(Math.max(0, anchor.x + OFFSET + tooltipWidth > ctx.width ? anchor.x - OFFSET - tooltipWidth : anchor.x + OFFSET));
	const top = $derived(Math.min(Math.max(0, anchor.y - tooltipHeight / 2), Math.max(0, ctx.height - tooltipHeight)));
</script>

<!-- Readout of every visible series in the active row; screen readers get the live region instead. -->
<div class="chartTooltip" aria-hidden="true" style:--chart-tooltip-x="{left}px" style:--chart-tooltip-y="{top}px" bind:offsetWidth={tooltipWidth} bind:offsetHeight={tooltipHeight}>
	{#if ctx.tooltip}
		{@render ctx.tooltip({ index: ctx.activeIndex, label, items })}
	{:else}
		<p class="chartTooltipLabel">{label}</p>
		<ul class="chartTooltipList">
			{#each items as item (item.key)}
				<li class="chartTooltipItem">
					<span class="chartTooltipKey" style:--chart-series-color={item.color}></span>
					<span class="chartTooltipName">{item.label}</span>
					<span class="chartTooltipValue">{item.formattedValue}</span>
					{#if item.percent !== undefined}
						<span class="chartTooltipPercent">{percentFormat.format(item.percent)}%</span>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	/* Base tooltip; placed by the chart through `--chart-tooltip-x` and `--chart-tooltip-y` */
	.chartTooltip {
		display: flex;
		position: absolute;
		top: var(--chart-tooltip-y);
		left: var(--chart-tooltip-x);
		flex-direction: column;
		gap: var(--spacing-xs);
		z-index: 1;
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		background-color: var(--popover);
		padding: var(--spacing-xs) var(--spacing-sm);
		min-width: 8rem; /* 128px */
		pointer-events: none;
		color: var(--popover-foreground);
	}

	/* Category name */
	.chartTooltipLabel {
		margin: 0;
		font-weight: 500;
	}

	.chartTooltipList {
		display: flex;
		flex-direction: column;
		gap: calc(var(--spacing-xs) / 2);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.chartTooltipItem {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
	}

	/* Short line in the series color; the text stays in text colors */
	.chartTooltipKey {
		flex-shrink: 0;
		border-radius: var(--radius-pill);
		background-color: var(--chart-series-color);
		width: 0.75rem; /* 12px */
		height: 2px;
	}

	/* Series name, secondary to the value */
	.chartTooltipName {
		flex: 1;
		color: var(--muted-foreground);
	}

	/* Share of the whole, after the value */
	.chartTooltipPercent {
		color: var(--muted-foreground);
		font-variant-numeric: tabular-nums;
	}

	/* Value leads: strong and aligned */
	.chartTooltipValue {
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}
</style>
