<script lang="ts">
	import { CandlestickChart, CandlestickChartLegend, CandlestickChartTooltip } from "#lib/components/ui/candlestick-chart/index.js";
	import { daily, longRun } from "../data.js";
</script>

<!-- No gridlines, and a log scale over a long run. -->
<CandlestickChart data={daily} grid={false} size="sm" class="demoHalf">
	<CandlestickChartLegend />
	<CandlestickChartTooltip />
</CandlestickChart>
<CandlestickChart data={longRun} scale="log" variant="line" range={[0, longRun.length]} size="sm" class="demoHalf">
	<CandlestickChartLegend />
	<CandlestickChartTooltip />
</CandlestickChart>
