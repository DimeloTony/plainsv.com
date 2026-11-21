<script lang="ts">
	import { CandlestickChart, CandlestickChartLegend, CandlestickChartTooltip } from "#lib/components/ui/candlestick-chart/index.js";
	import { daily, getLevels, signals, sentiment } from "../data.js";
</script>

<!-- Levels and markers toggled by group from an overlay legend. -->
<CandlestickChart
	data={daily}
	indicators={[
		{ type: "ema", period: 9 },
		{ type: "ema", period: 21 },
	]}
	levels={getLevels(daily).map((level) => ({ ...level, group: "Levels" }))}
	markers={[...signals.map((signal) => ({ ...signal, group: "Bot trades" })), ...sentiment.map((bubble) => ({ ...bubble, group: "Sentiment" }))]}
	size="sm"
	class="demoChart"
>
	<CandlestickChartLegend position="overlay" />
	<CandlestickChartTooltip />
</CandlestickChart>
