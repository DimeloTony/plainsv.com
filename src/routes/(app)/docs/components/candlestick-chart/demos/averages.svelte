<script lang="ts">
	import { CandlestickChart, CandlestickChartLegend, CandlestickChartTooltip } from "#lib/components/ui/candlestick-chart/index.js";
	import { daily } from "../data.js";
</script>

<!-- Daily candles with a fast and a slow average. -->
<CandlestickChart
	data={daily}
	indicators={[
		{ type: "ema", period: 20 },
		{ type: "sma", period: 50 },
	]}
	class="demoChart"
>
	<CandlestickChartLegend />
	<CandlestickChartTooltip />
</CandlestickChart>
