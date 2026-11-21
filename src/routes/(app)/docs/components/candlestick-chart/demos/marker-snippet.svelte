<script lang="ts">
	import { CandlestickChart, CandlestickChartLegend, CandlestickChartTooltip } from "#lib/components/ui/candlestick-chart/index.js";
	import { NewspaperIcon } from "@lucide/svelte";
	import { daily, news } from "../data.js";
</script>

<!-- News markers drawn with a custom snippet. -->
<CandlestickChart data={daily} markers={news} volume={false} size="sm" class="demoChart">
	<CandlestickChartLegend />
	<CandlestickChartTooltip />
	{#snippet marker({ color })}
		<span class="demoMarker" style:--demo-marker-color={color}><NewspaperIcon size={12} /></span>
	{/snippet}
</CandlestickChart>

<style>
	/* Round badge for a custom marker, in the marker color */
	.demoMarker {
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1px solid var(--demo-marker-color);
		border-radius: var(--radius-pill);
		background-color: var(--popover);
		width: 1.25rem; /* 20px */
		height: 1.25rem; /* 20px */
		color: var(--demo-marker-color);
	}
</style>
