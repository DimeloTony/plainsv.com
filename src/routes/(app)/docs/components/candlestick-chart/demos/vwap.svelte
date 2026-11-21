<script lang="ts">
	import { CandlestickChart, CandlestickChartLegend, CandlestickChartTooltip } from "#lib/components/ui/candlestick-chart/index.js";
	import { intraday } from "../data.js";
</script>

<!-- VWAP with one and two deviation bands, restarting each day. -->
<CandlestickChart data={intraday} timeZone="America/New_York" indicators={[{ type: "vwap", bands: [1, 2] }]} range={[0, intraday.length]} class="demoChart">
	<CandlestickChartLegend />
	<CandlestickChartTooltip />
</CandlestickChart>
