<script lang="ts">
	import { CandlestickChart, CandlestickChartLegend, CandlestickChartTooltip } from "#lib/components/ui/candlestick-chart/index.js";
	import { daily } from "../data.js";

	let range: [number, number] | undefined = $state();
</script>

<!-- Visible range bound to state. -->
<div class="demoColumn">
	<CandlestickChart data={daily} bind:range class="demoChart">
		<CandlestickChartLegend />
		<CandlestickChartTooltip />
	</CandlestickChart>
	<p>Range: <code>{range ? `${Math.round(range[0])} to ${Math.round(range[1])}` : "latest candles"}</code></p>
</div>
