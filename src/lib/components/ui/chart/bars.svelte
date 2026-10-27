<svelte:options namespace="svg" />

<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	import { getBarPath } from "./utils.js";
	import type { BarEnd } from "./utils.js";
	const ctx = useCompCtx();
	// Space between touching bars and between stacked segments, so neighbors read apart without a border.
	const BAR_GAP = 2;
	// Widest a bar gets, so bars stay thin marks with air around them.
	const MAX_BAR_SIZE = 24;
	// Share of each category slot the bar group may fill.
	const GROUP_SHARE = 0.8;
	const barCount = $derived(ctx.isStacked ? 1 : Math.max(1, ctx.visibleSeries.length));
	const barSize = $derived(Math.max(1, Math.min(MAX_BAR_SIZE, (ctx.bandSize * GROUP_SHARE - (barCount - 1) * BAR_GAP) / barCount)));
	const groupSize = $derived(barCount * barSize + (barCount - 1) * BAR_GAP);
	const bars = $derived(ctx.data.flatMap((_, row) => getRowBars(row)));

	/** Builds the bars of one row; stacked segments step in by the gap, and only the outer end of each stack is rounded. */
	function getRowBars(row: number) {
		const ranges = ctx.ranges[row] ?? [];
		const groupStart = ctx.categoryToPixel(row) - groupSize / 2;
		// The last segment that grows in each direction gets the rounded end.
		const outerPositive = ranges.findLastIndex(([start, end]) => end > start);
		const outerNegative = ranges.findLastIndex(([start, end]) => end < start);
		return ctx.visibleSeries.flatMap((series, position) => {
			const [start, end] = ranges[position];
			// If the value is missing or zero: draw nothing.
			if (!Number.isFinite(end) || start === end) return [];
			const isPositive = end > start;
			const direction = ctx.isHorizontal === isPositive ? 1 : -1;
			// If the segment sits on another one: step it in by the gap.
			const from = ctx.valueToPixel(start) + (ctx.isStacked && start !== 0 ? direction * BAR_GAP : 0);
			const to = ctx.valueToPixel(end);
			const length = (to - from) * direction;
			// If the gap swallowed a tiny segment: skip it; the tooltip and table still have its value.
			if (length <= 0) return [];
			const crossStart = groupStart + (ctx.isStacked ? 0 : position * (barSize + BAR_GAP));
			const isOuter = !ctx.isStacked || position === (isPositive ? outerPositive : outerNegative);
			const roundedEnd: BarEnd = !isOuter ? "none" : ctx.isHorizontal ? (isPositive ? "right" : "left") : isPositive ? "top" : "bottom";
			const d = ctx.isHorizontal ? getBarPath(Math.min(from, to), crossStart, length, barSize, ctx.barRadius, roundedEnd) : getBarPath(crossStart, Math.min(from, to), barSize, length, ctx.barRadius, roundedEnd);
			return [{ id: `${row}-${series.key}`, d, color: series.color, row }];
		});
	}
</script>

<!-- Hover band behind the active row. -->
{#if ctx.activeIndex >= 0}
	{@const bandStart = ctx.categoryToPixel(ctx.activeIndex) - ctx.bandSize / 2}
	{#if ctx.isHorizontal}
		<rect class="chartCursor" x={ctx.marginLeft} y={bandStart} width={ctx.innerWidth} height={ctx.bandSize} />
	{:else}
		<rect class="chartCursor" x={bandStart} y={ctx.marginTop} width={ctx.bandSize} height={ctx.innerHeight} />
	{/if}
{/if}

<!-- One path per bar or stacked segment. -->
<g class="chartBars">
	{#each bars as bar (bar.id)}
		<path class="chartBar" d={bar.d} style:fill={bar.color} data-active={bar.row === ctx.activeIndex || undefined} />
	{/each}
</g>

<style>
	/* Soft band behind the hovered row */
	.chartCursor {
		fill: color-mix(in oklab, var(--muted) 70%, transparent);
	}

	.chartBar {
		transition: filter 150ms cubic-bezier(0.4, 0, 0.2, 1);
	}

	/* =============== States =============== */

	/* Hovered row lifts slightly */
	.chartBar[data-active] {
		filter: brightness(1.08);
	}
</style>
