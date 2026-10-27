<svelte:options namespace="svg" />

<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	import { getSectorPath } from "./utils.js";
	const ctx = useCompCtx();
	// Rings start at the top and run clockwise.
	const TOP = -Math.PI / 2;
</script>

<!-- One ring per visible row, the first row outermost; each sits on a track that shows the full scale. -->
<g class="chartRings">
	{#each ctx.rings as ring (ring.row)}
		{@const value = ctx.rowValues[ring.row]}
		<circle class="chartTrack" cx={ctx.centerX} cy={ctx.centerY} r={(ring.innerRadius + ring.outerRadius) / 2} style:stroke-width="{ring.outerRadius - ring.innerRadius}px" />
		{#if value > 0}
			<path class="chartRing" d={getSectorPath(ctx.centerX, ctx.centerY, ring.innerRadius, ring.outerRadius, TOP, ctx.radialAngle(value), ctx.barRadius)} style:fill={ctx.rows[ring.row].color} data-active={ring.row === ctx.activeIndex || undefined} />
		{/if}
	{/each}
</g>

<style>
	/* Track in the muted surface color */
	.chartTrack {
		fill: none;
		stroke: var(--muted);
	}

	.chartRing {
		transition: filter 150ms cubic-bezier(0.4, 0, 0.2, 1);
	}

	/* =============== States =============== */

	/* Hovered ring lifts slightly */
	.chartRing[data-active] {
		filter: brightness(1.08);
	}
</style>
