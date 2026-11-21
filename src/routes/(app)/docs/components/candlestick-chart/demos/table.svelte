<script lang="ts">
	import { CandlestickChart, CandlestickChartLegend, CandlestickChartTooltip } from "#lib/components/ui/candlestick-chart/index.js";
	import { daily } from "../data.js";
</script>

<!-- Chart with the table of visible candles. -->
<CandlestickChart data={daily} range={[daily.length - 20, daily.length]} table size="sm" class="demoChart">
	<CandlestickChartLegend />
	<CandlestickChartTooltip />
</CandlestickChart>
