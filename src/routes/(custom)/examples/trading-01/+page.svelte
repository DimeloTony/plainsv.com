<script lang="ts">
	import { PageMeta } from "#lib/components/shared/index.js";
	import { CandlestickChart } from "#lib/components/ui/candlestick-chart/index.js";
	import { Badge } from "#lib/components/ui/badge/index.js";
	import { SYMBOL, TIME_ZONE, candles, sessions, lastClose, dayOpen, trades, swings, sentiment, news, initialRange, formatUsd, getTradeMarkers, getWallLevels, getPivotLevels } from "./data.js";
	const levels = [...getWallLevels(), ...getPivotLevels()];
	// Trades first, so their arrows sit nearest the candles, then swings, sentiment, and news stack beyond them.
	const markers = [...getTradeMarkers(trades), ...swings, ...sentiment, ...news];
	const change = lastClose - dayOpen;
	const changePercent = (change / dayOpen) * 100;
</script>

<PageMeta title="Trading 01 example" description="A full-screen trading chart with options walls, floor pivots, bot buy and sell markers, swing points, sentiment, and news." />

<div class="trading not-typeset">
	<!-- Symbol, last price, and the change since the open. -->
	<header class="tradingHeader">
		<h1>{SYMBOL}</h1>
		<strong class="tradingPrice">{formatUsd(lastClose)}</strong>
		<span class="tradingChange" data-direction={change >= 0 ? "up" : "down"}>{change >= 0 ? "▲" : "▼"} {formatUsd(Math.abs(change))} ({Math.abs(changePercent).toFixed(2)}%)</span>
		<Badge variant="outline" size="sm">Simulated data</Badge>
	</header>

	<!-- Chart filling the rest of the screen; its legend floats inside the plot and toggles the indicators and each group. -->
	<main class="tradingMain">
		<CandlestickChart
			data={candles}
			{sessions}
			timeZone={TIME_ZONE}
			{levels}
			{markers}
			indicators={[
				{ type: "vwap", regularHours: true },
				{ type: "ema", period: 9 },
				{ type: "ema", period: 21 },
			]}
			range={initialRange}
			formatPrice={formatUsd}
			grid={false}
			// legendPosition="overlay"
			size="lg"
			label="{SYMBOL}, 5 minute candles"
			class="tradingChart"
		/>
	</main>
</div>

<style>
	/* Full screen: the header on top and the chart taking the rest */
	.trading {
		display: flex;
		flex-direction: column;
		height: 100dvh;
	}

	/* Symbol, price, and change on one baseline */
	.tradingHeader {
		display: flex;
		flex-shrink: 0;
		flex-wrap: wrap;
		align-items: baseline;
		gap: var(--spacing-sm) var(--spacing-md);
		border-bottom: 1px solid var(--border);
		padding: var(--spacing-sm) var(--spacing-lg);
	}

	.tradingHeader h1 {
		margin: 0;
		font-weight: 600;
		font-size: var(--text-lg);
		line-height: var(--line-height-lg);
	}

	.tradingPrice {
		font-weight: 600;
		font-size: var(--text-lg);
		line-height: var(--line-height-lg);
		font-variant-numeric: tabular-nums;
	}

	.tradingChange {
		font-size: var(--text-sm);
		font-variant-numeric: tabular-nums;
	}

	.tradingChange[data-direction="up"] {
		color: var(--chart-3);
	}

	.tradingChange[data-direction="down"] {
		color: var(--destructive);
	}

	.tradingMain {
		display: flex;
		flex: 1;
		padding-top: var(--spacing);
		min-height: 0;
	}

	.tradingMain :global(.candlestickChartLegend) {
		padding-left: var(--spacing-md);
	}

	/* The chart and its plot grow to fill the space under the header, never shorter than 20rem */
	.tradingMain :global(.tradingChart) {
		flex: 1;
		min-height: 0;
	}

	.tradingMain :global(.tradingChart .candlestickChartPlot) {
		flex: 1;
		height: auto;
		min-height: 20rem; /* 320px */
	}
</style>
