<script lang="ts">
	import { CandlestickChart, CandlestickChartLegend, CandlestickChartTooltip } from "#lib/components/ui/candlestick-chart/index.js";
	import { daily, sentiment } from "../data.js";
</script>

<!-- Sentiment bubbles sized by score. -->
<CandlestickChart data={daily} markers={sentiment} volume={false} size="sm" class="demoChart">
	<CandlestickChartLegend />
	<CandlestickChartTooltip />
</CandlestickChart>
