<script lang="ts">
	import { CandlestickChart, CandlestickChartLegend, CandlestickChartTooltip } from "#lib/components/ui/candlestick-chart/index.js";
	import { daily } from "../data.js";
</script>

<!-- Smallest and largest sizes. -->
<CandlestickChart data={daily} size="xs" class="demoHalf">
	<CandlestickChartLegend />
	<CandlestickChartTooltip />
</CandlestickChart>
<CandlestickChart data={daily} size="lg" class="demoHalf">
	<CandlestickChartLegend />
	<CandlestickChartTooltip />
</CandlestickChart>
