<script lang="ts">
	import { CandlestickChart, CandlestickChartLegend, CandlestickChartTooltip } from "#lib/components/ui/candlestick-chart/index.js";
	import { sessions, intraday, levels } from "../data.js";
</script>

<!-- Extended hours in New York time, with a regular hours VWAP, an average, and levels. -->
<CandlestickChart
	data={intraday}
	{sessions}
	timeZone="America/New_York"
	{levels}
	indicators={[
		{ type: "vwap", regularHours: true },
		{ type: "ema", period: 20 },
	]}
	label="Sample stock, 5 minute candles"
	class="demoChart"
>
	<CandlestickChartLegend />
	<CandlestickChartTooltip />
</CandlestickChart>
