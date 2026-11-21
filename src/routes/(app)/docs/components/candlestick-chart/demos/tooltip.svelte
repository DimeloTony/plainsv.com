<script lang="ts">
	import { CandlestickChart, CandlestickChartTooltip } from "#lib/components/ui/candlestick-chart/index.js";
	import { daily } from "../data.js";
</script>

<!-- Custom tooltip with the range of the candle. -->
<CandlestickChart data={daily} size="sm" class="demoChart">
	<CandlestickChartTooltip>
		{#snippet children({ label, candle, changePercent })}
			<strong>{label}</strong>
			<span>Range: {(candle.high - candle.low).toFixed(2)}</span>
			<span>{changePercent >= 0 ? "▲" : "▼"} {Math.abs(changePercent).toFixed(2)}%</span>
		{/snippet}
	</CandlestickChartTooltip>
</CandlestickChart>
