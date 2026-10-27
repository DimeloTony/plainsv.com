<svelte:options namespace="svg" />

<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	import { getAreaPath, getLinePath } from "./utils.js";
	import type { Point } from "./utils.js";
	const ctx = useCompCtx();
	// Prefix for the gradient ids, so two charts on a page never share one.
	const uid = $props.id();
	const lines = $derived(ctx.visibleSeries.map((series, position) => ({ ...series, runs: getRuns(position) })));
	const activeX = $derived(ctx.activeIndex >= 0 ? ctx.categoryToPixel(ctx.activeIndex) : 0);

	/** Splits a series into unbroken runs of points, so a missing value leaves a gap instead of a false line. */
	function getRuns(position: number) {
		const runs: { top: Point[]; bottom: Point[] }[] = [];
		let current: { top: Point[]; bottom: Point[] } | null = null;
		for (const [row, ranges] of ctx.ranges.entries()) {
			const [start, end] = ranges[position];
			// If the value is missing: end the current run.
			if (!Number.isFinite(end)) {
				current = null;
				continue;
			}
			if (!current) {
				current = { top: [], bottom: [] };
				runs.push(current);
			}
			const x = ctx.categoryToPixel(row);
			current.top.push([x, ctx.valueToPixel(end)]);
			// Stacked areas fill down to the series below; others fill down to zero.
			current.bottom.push([x, ctx.isStacked ? ctx.valueToPixel(start) : ctx.baseline]);
		}
		return runs;
	}
</script>

<!-- Area washes first, so every line draws on top of them. -->
{#if ctx.type === "area"}
	<!-- One vertical fade per series, used in place of the flat wash when `gradient` is set. -->
	{#if ctx.gradient}
		<defs>
			{#each lines as line, linePosition (line.key)}
				<linearGradient id="{uid}-area-{linePosition}" x1="0" y1="0" x2="0" y2="1">
					<stop offset="5%" stop-opacity="0.8" style:stop-color={line.color} />
					<stop offset="95%" stop-opacity="0.1" style:stop-color={line.color} />
				</linearGradient>
			{/each}
		</defs>
	{/if}
	<g class="chartAreas">
		{#each lines as line, linePosition (line.key)}
			{#each line.runs as run, position (position)}
				<path class="chartArea" d={getAreaPath(run.top, run.bottom, ctx.curve)} style:--chart-series-color={line.color} style:fill={ctx.gradient ? `url(#${uid}-area-${linePosition})` : undefined} />
			{/each}
		{/each}
	</g>
{/if}

<!-- Crosshair at the hovered row. -->
{#if ctx.activeIndex >= 0}
	<line class="chartCrosshair" x1={activeX} x2={activeX} y1={ctx.marginTop} y2={ctx.marginTop + ctx.innerHeight} />
{/if}

<!-- One line per series, then its dots. -->
<g class="chartLines">
	{#each lines as line (line.key)}
		{#each line.runs as run, position (position)}
			<path class="chartLine" d={getLinePath(run.top, ctx.curve)} style:stroke={line.color} />
		{/each}
	{/each}
</g>
<g class="chartDots">
	{#each lines as line (line.key)}
		{#each line.runs as run, runPosition (runPosition)}
			{#each run.top as [x, y] (x)}
				{#if ctx.dots || run.top.length === 1 || x === activeX}
					<circle class="chartDot" cx={x} cy={y} r="4" style:fill={line.color} data-active={(ctx.activeIndex >= 0 && x === activeX) || undefined} />
				{/if}
			{/each}
		{/each}
	{/each}
</g>

<style>
	/* Soft wash of the series color under each line */
	.chartArea {
		fill: color-mix(in oklab, var(--chart-series-color) 12%, transparent);
	}

	/* Recessive vertical hairline that finds the hovered row */
	.chartCrosshair {
		shape-rendering: crispEdges;
		stroke: color-mix(in oklab, var(--muted-foreground) 50%, transparent);
		stroke-width: 1px;
	}

	/* 2px line with round joins */
	.chartLine {
		fill: none;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 2px;
	}

	/* 8px dot with a ring in the surface color, so it stays clear where lines cross */
	.chartDot {
		stroke: var(--chart-surface, var(--background));
		stroke-width: 2px;
	}

	/* =============== States =============== */

	/* Hovered dot grows a little */
	.chartDot[data-active] {
		r: 5px;
	}
</style>
