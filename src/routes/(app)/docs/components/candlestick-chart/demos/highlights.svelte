<script lang="ts">
	import { CandlestickChart, CandlestickChartLegend, CandlestickChartTooltip } from "#lib/components/ui/candlestick-chart/index.js";
	import { daily, earnings } from "../data.js";
</script>

<!-- Earnings days on daily candles. -->
<CandlestickChart data={daily} highlights={earnings} range={[40, 210]} size="sm" class="demoChart">
	<CandlestickChartLegend />
	<CandlestickChartTooltip />
</CandlestickChart>
