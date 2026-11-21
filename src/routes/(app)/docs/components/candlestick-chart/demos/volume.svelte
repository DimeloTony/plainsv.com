<script lang="ts">
	import { CandlestickChart, CandlestickChartLegend, CandlestickChartTooltip } from "#lib/components/ui/candlestick-chart/index.js";
	import { daily } from "../data.js";
</script>

<!-- Candles without the volume pane. -->
<CandlestickChart data={daily} volume={false} size="sm" class="demoChart">
	<CandlestickChartLegend />
	<CandlestickChartTooltip />
</CandlestickChart>
