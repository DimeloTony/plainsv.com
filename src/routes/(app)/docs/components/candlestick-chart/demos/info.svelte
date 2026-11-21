<script lang="ts">
	import { CandlestickChart, CandlestickChartInfo, CandlestickChartLegend, CandlestickChartTooltip } from "#lib/components/ui/candlestick-chart/index.js";
	import { daily } from "../data.js";
</script>

<!-- The hovered candle's values in the corner, with the legend floating under them. -->
<CandlestickChart data={daily} indicators={[{ type: "ema", period: 9 }]} size="sm" class="demoChart">
	<CandlestickChartInfo />
	<CandlestickChartLegend position="overlay" />
	<CandlestickChartTooltip ohlc={false} />
</CandlestickChart>
