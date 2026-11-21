<script lang="ts">
	import { CandlestickChart, CandlestickChartLegend, CandlestickChartTooltip } from "#lib/components/ui/candlestick-chart/index.js";
	import { sessions, intraday, sessionRange } from "../data.js";
</script>

<!-- VWAP over all hours next to VWAP over regular hours. -->
<CandlestickChart data={intraday} {sessions} timeZone="America/New_York" indicators={[{ type: "vwap", label: "VWAP all hours" }]} range={sessionRange} volume={false} size="sm" class="demoHalf">
	<CandlestickChartLegend />
	<CandlestickChartTooltip />
</CandlestickChart>
<CandlestickChart data={intraday} {sessions} timeZone="America/New_York" indicators={[{ type: "vwap", regularHours: true, label: "VWAP regular hours" }]} range={sessionRange} volume={false} size="sm" class="demoHalf">
	<CandlestickChartLegend />
	<CandlestickChartTooltip />
</CandlestickChart>
