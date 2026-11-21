<script lang="ts">
	import { CandlestickChart, CandlestickChartLegend, CandlestickChartTooltip } from "#lib/components/ui/candlestick-chart/index.js";
	import { daily } from "../data.js";
</script>

<!-- A narrow chart with more indicators than fit, so the legend scrolls instead of wrapping. -->
<CandlestickChart data={daily} indicators={[{ type: "ema", period: 9 }, { type: "ema", period: 21 }, { type: "sma", period: 50 }, { type: "sma", period: 200 }, { type: "bollinger" }]} volume={false} size="sm" class="demoNarrow">
	<CandlestickChartLegend overflow="scroll" />
	<CandlestickChartTooltip />
</CandlestickChart>
