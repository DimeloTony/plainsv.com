<script lang="ts">
	import { CandlestickChart, CandlestickChartLegend, CandlestickChartTooltip, type CandlestickChartPosition, type CandlestickChartPositionChange } from "#lib/components/ui/candlestick-chart/index.js";
	import { daily, getPositions } from "../data.js";

	// An open long a bot is holding, and a short it already closed.
	let positions: CandlestickChartPosition[] = $state(getPositions(daily));
	let lastChange: CandlestickChartPositionChange | null = $state(null);
</script>

<!-- Drag the open position's target or stop, and the change shows below once you let go; press × to cancel it. -->
<div class="demoColumn">
	<CandlestickChart data={daily} bind:positions onPositionsChange={(_, change) => (lastChange = change)} onPositionCancel={(position) => (positions = positions.filter((item) => item.id !== position.id))} range={[daily.length - 90, daily.length]} volume={false} class="demoChart">
		<CandlestickChartLegend />
		<CandlestickChartTooltip />
	</CandlestickChart>
	<p>Last change: <code>{lastChange ? `${lastChange.id} ${lastChange.field} ${lastChange.previous} → ${lastChange.price}` : "drag a target or stop"}</code></p>
</div>
