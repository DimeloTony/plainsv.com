<script lang="ts">
	import { CandlestickChart, CandlestickChartLegend, CandlestickChartTooltip } from "#lib/components/ui/candlestick-chart/index.js";
	import { intraday, currency } from "../data.js";
</script>

<!-- Prices in dollars. -->
<CandlestickChart data={intraday} formatPrice={(price) => currency.format(price)} size="sm" class="demoChart">
	<CandlestickChartLegend />
	<CandlestickChartTooltip />
</CandlestickChart>
