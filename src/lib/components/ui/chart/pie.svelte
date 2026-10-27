<svelte:options namespace="svg" />

<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	import { getSectorPath } from "./utils.js";
	const ctx = useCompCtx();
</script>

<!-- One slice per visible row, clockwise from the top; a donut leaves a hole in the middle. -->
<g class="chartSlices">
	{#each ctx.slices as slice (slice.row)}
		<path class="chartSlice" d={getSectorPath(ctx.centerX, ctx.centerY, ctx.holeRadius, ctx.radius, slice.startAngle, slice.endAngle)} style:fill={ctx.rows[slice.row].color} data-active={slice.row === ctx.activeIndex || undefined} />
	{/each}
</g>

<style>
	/* Slice with a 2px gap in the surface color, so neighbors read apart without a border */
	.chartSlice {
		transition: filter 150ms cubic-bezier(0.4, 0, 0.2, 1);
		stroke: var(--chart-surface, var(--background));
		stroke-linejoin: round;
		stroke-width: 2px;
	}

	/* =============== States =============== */

	/* Hovered slice lifts slightly */
	.chartSlice[data-active] {
		filter: brightness(1.08);
	}
</style>
