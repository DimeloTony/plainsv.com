<script lang="ts">
	import { CandlestickChart, CandlestickChartLegend, CandlestickChartTooltip } from "#lib/components/ui/candlestick-chart/index.js";
	import { daily, signals } from "../data.js";
</script>

<!-- Buy and sell signals from an EMA crossover. -->
<CandlestickChart
	data={daily}
	indicators={[
		{ type: "ema", period: 9 },
		{ type: "ema", period: 21 },
	]}
	markers={signals}
	size="sm"
	class="demoChart"
>
	<CandlestickChartLegend />
	<CandlestickChartTooltip />
</CandlestickChart>
