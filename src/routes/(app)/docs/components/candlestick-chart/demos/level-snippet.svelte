<script lang="ts">
	import { CandlestickChart, CandlestickChartLegend, CandlestickChartTooltip } from "#lib/components/ui/candlestick-chart/index.js";
	import { intraday, walls } from "../data.js";
</script>

<!-- Option walls drawn with a custom snippet: a shaded band with its name in a pill at the right edge. -->
<CandlestickChart data={intraday} levels={walls} lastPrice={false} volume={false} size="sm" class="demoChart">
	<CandlestickChartLegend />
	<CandlestickChartTooltip />
	{#snippet level({ level, color, bandHeight })}
		<span class="demoLevel" style:--demo-level-color={color} style:--demo-level-band="{bandHeight}px"></span>
		<span class="demoLevelLabel" style:--demo-level-color={color}>{level.label}</span>
	{/snippet}
</CandlestickChart>

<style>
	/* Band for a custom level, in the level color with a solid edge on each side */
	.demoLevel {
		flex: 1;
		border-top: 1px solid var(--demo-level-color);
		border-bottom: 1px solid var(--demo-level-color);
		background-color: color-mix(in oklab, var(--demo-level-color) 18%, transparent);
		height: var(--demo-level-band);
	}

	/* Name of a custom level in a pill outlined in the level color */
	.demoLevelLabel {
		border: 1px solid var(--demo-level-color);
		border-radius: var(--radius-pill);
		background-color: var(--popover);
		padding: 0 var(--spacing-sm);
		color: var(--popover-foreground);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
		white-space: nowrap;
	}
</style>
