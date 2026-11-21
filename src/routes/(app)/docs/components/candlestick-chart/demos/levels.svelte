<script lang="ts">
	import { CandlestickChart, CandlestickChartLegend, CandlestickChartTooltip } from "#lib/components/ui/candlestick-chart/index.js";
	import { intraday, levels } from "../data.js";
</script>

<!-- A thick support band, a thin resistance line, and a level above the visible prices. -->
<CandlestickChart
	data={intraday}
	levels={[
		{ ...levels[0], size: 4 },
		{ ...levels[1], style: "solid" },
		{ price: 400, label: "Target" },
	]}
	lastPrice={false}
	volume={false}
	size="sm"
	class="demoChart"
>
	<CandlestickChartLegend />
	<CandlestickChartTooltip />
</CandlestickChart>
