<svelte:options namespace="svg" />

<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	import { getPolarPoint } from "./utils.js";
	import type { Point } from "./utils.js";
	const ctx = useCompCtx();
	// Space in pixels between the outer ring and the spoke labels.
	const LABEL_PADDING = 8;
	const spokes = $derived(ctx.data.map((_, position) => ({ position, angle: ctx.spokeAngle(position) })));
	const gridRings = $derived(ctx.ticks.filter((tick) => tick > 0).map((tick) => toPoints(spokes.map(({ position }) => ctx.radarPoint(position, tick)))));
	// Missing values sit at the center, so every shape stays closed.
	const shapes = $derived(ctx.visibleSeries.map((series) => ({ ...series, points: ctx.data.map((row, position) => ctx.radarPoint(position, ctx.getValue(row, series.key) || 0)) })));

	/** Writes points as a polygon's `points` attribute. */
	function toPoints(points: Point[]) {
		return points.map((point) => point.join(",")).join(" ");
	}

	/** Places a spoke label outside the chart, anchored away from the center. */
	function getLabelPlacement(angle: number) {
		const [x, y] = getPolarPoint(ctx.centerX, ctx.centerY, ctx.radius + LABEL_PADDING, angle);
		const cos = Math.cos(angle);
		const sin = Math.sin(angle);
		// Labels on the sides hang away from the chart; labels near the top and bottom center on their spoke.
		const anchor = cos > 0.3 ? "start" : cos < -0.3 ? "end" : "middle";
		const baseline = sin > 0.3 ? "hanging" : sin < -0.3 ? "text-after-edge" : "middle";
		return { x, y, anchor, baseline };
	}
</script>

<!-- Grid: one polygon per value tick and one spoke per row. -->
<g class="chartRadarGrid">
	{#each gridRings as points, position (position)}
		<polygon {points} />
	{/each}
	{#each spokes as spoke (spoke.position)}
		{@const [x, y] = getPolarPoint(ctx.centerX, ctx.centerY, ctx.radius, spoke.angle)}
		<line x1={ctx.centerX} y1={ctx.centerY} x2={x} y2={y} data-active={spoke.position === ctx.activeIndex || undefined} />
	{/each}
</g>

<!-- Spoke labels. -->
<g class="chartRadarLabels">
	{#each spokes as spoke (spoke.position)}
		{@const placement = getLabelPlacement(spoke.angle)}
		<text class="chartTick" x={placement.x} y={placement.y} text-anchor={placement.anchor} dominant-baseline={placement.baseline}>{ctx.labels[spoke.position]}</text>
	{/each}
</g>

<!-- One shape per series: a soft wash with a 2px outline. -->
<g class="chartRadarShapes">
	{#each shapes as shape (shape.key)}
		<polygon class="chartRadarShape" points={toPoints(shape.points)} style:--chart-series-color={shape.color} />
	{/each}
</g>

<!-- Dots on every point, or only on the hovered spoke. -->
<g class="chartDots">
	{#each shapes as shape (shape.key)}
		{#each shape.points as [x, y], position (position)}
			{#if ctx.dots || position === ctx.activeIndex}
				<circle class="chartDot" cx={x} cy={y} r="4" style:fill={shape.color} data-active={position === ctx.activeIndex || undefined} />
			{/if}
		{/each}
	{/each}
</g>

<style>
	/* Recessive hairline grid */
	.chartRadarGrid polygon,
	.chartRadarGrid line {
		fill: none;
		stroke: var(--border);
		stroke-width: 1px;
	}

	/* Axis text uses the muted text color, never a series color */
	.chartTick {
		fill: var(--muted-foreground);
		font-size: inherit;
	}

	/* Soft wash with a 2px outline in the series color */
	.chartRadarShape {
		fill: color-mix(in oklab, var(--chart-series-color) 12%, transparent);
		stroke: var(--chart-series-color);
		stroke-linejoin: round;
		stroke-width: 2px;
	}

	/* 8px dot with a ring in the surface color, so it stays clear where shapes cross */
	.chartDot {
		stroke: var(--chart-surface, var(--background));
		stroke-width: 2px;
	}

	/* =============== States =============== */

	/* Hovered spoke darkens to find the row */
	.chartRadarGrid line[data-active] {
		stroke: color-mix(in oklab, var(--muted-foreground) 50%, transparent);
	}

	/* Hovered dot grows a little */
	.chartDot[data-active] {
		r: 5px;
	}
</style>
