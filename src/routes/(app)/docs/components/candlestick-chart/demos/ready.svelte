<script lang="ts">
	import { CandlestickChart, CandlestickChartLegend, CandlestickChartTooltip, type CandlestickChartCandle } from "#lib/components/ui/candlestick-chart/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { Spinner } from "#lib/components/ui/spinner/index.js";
	import { daily } from "../data.js";

	// Candles that arrive after a delay, like a slow request, so the loader shows until the chart is ready.
	const SLOW_LOAD_MS = 1500;
	let slowData: CandlestickChartCandle[] = $state([]);
	let isChartReady = $state(false);
	let slowTimer: ReturnType<typeof setTimeout> | undefined;

	// Load the slow candles in the browser only, so the loader shows on the first visit too.
	$effect(() => {
		loadSlowData();
		return () => clearTimeout(slowTimer);
	});

	/** Clears the candles and brings them back after a delay, like a slow request. */
	function loadSlowData() {
		clearTimeout(slowTimer);
		slowData = [];
		slowTimer = setTimeout(() => (slowData = daily), SLOW_LOAD_MS);
	}
</script>

<!-- The loader covers the chart until its candles arrive and it has drawn them. -->
<div class="demoColumn">
	<div class="demoFrame">
		<CandlestickChart data={slowData} bind:ready={isChartReady} size="sm" class="demoChart">
			<CandlestickChartLegend />
			<CandlestickChartTooltip />
		</CandlestickChart>
		{#if !isChartReady}
			<Spinner class="demoLoader" size="lg" />
		{/if}
	</div>
	<div>
		<Button size="sm" variant="outline" onclick={loadSlowData}>Reload</Button>
	</div>
</div>

<style>
	/* Anchors the loader over the chart */
	.demoFrame {
		position: relative;
	}

	.demoFrame :global(.demoLoader) {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
