<script lang="ts">
	import { CandlestickChart, CandlestickChartLegend, CandlestickChartTooltip } from "#lib/components/ui/candlestick-chart/index.js";
	import { daily } from "../data.js";
</script>

<!-- Custom rising, falling, and line colors. -->
<CandlestickChart data={daily} size="sm" style="--candlestick-chart-up: var(--chart-1); --candlestick-chart-down: var(--chart-2)" class="demoHalf">
	<CandlestickChartLegend />
	<CandlestickChartTooltip />
</CandlestickChart>
<CandlestickChart data={daily} variant="area" size="sm" style="--candlestick-chart-line: var(--chart-5)" class="demoHalf">
	<CandlestickChartLegend />
	<CandlestickChartTooltip />
</CandlestickChart>
