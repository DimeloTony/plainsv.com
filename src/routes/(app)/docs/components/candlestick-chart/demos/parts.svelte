<script lang="ts">
	import { CandlestickChart, CandlestickChartInfo, CandlestickChartLegend, CandlestickChartTooltip } from "#lib/components/ui/candlestick-chart/index.js";
	import { daily } from "../data.js";
</script>

<!-- Each part with its own look: a pill legend, a carded info, and a small outlined tooltip. -->
<CandlestickChart
	data={daily}
	indicators={[
		{ type: "ema", period: 9 },
		{ type: "ema", period: 21 },
	]}
	size="sm"
	class="demoChart"
>
	<CandlestickChartInfo variant="card" rounded="lg" />
	<CandlestickChartLegend position="overlayBottom" rounded="pill" size="xs" />
	<CandlestickChartTooltip variant="card" size="xs" rounded="xl" />
</CandlestickChart>
