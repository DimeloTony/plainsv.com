<script lang="ts">
	import { PageMeta } from "#lib/components/shared/index.js";
	import { CandlestickChart, type CandlestickChartPosition, type CandlestickChartPositionChange } from "#lib/components/ui/candlestick-chart/index.js";
	import { Badge } from "#lib/components/ui/badge/index.js";
	import { SYMBOL, TIME_ZONE, candles, sessions, lastClose, dayOpen, trades, swings, sentiment, news, initialRange, formatUsd, getTradeMarkers, getWallLevels, getPivotLevels, getPositions } from "./data.js";
	const levels = [...getWallLevels(), ...getPivotLevels()];
	// Trades first, so their arrows sit nearest the candles, then swings, sentiment, and news stack beyond them.
	const markers = [...getTradeMarkers(trades), ...swings, ...sentiment, ...news];
	const change = lastClose - dayOpen;
	const changePercent = (change / dayOpen) * 100;
	// The bot's round trips as closed positions and its latest buy as an open one, whose target and stop drag.
	let positions: CandlestickChartPosition[] = $state(getPositions(trades));
	// The latest order update the chart reported, shown in the header.
	let orderStatus = $state("Drag the open position's target or stop, or press × to cancel it");

	/** Stands in for sending the new target or stop to the bot's broker. */
	function handlePositionsChange(next: CandlestickChartPosition[], change: CandlestickChartPositionChange) {
		orderStatus = `${change.position.label ?? change.id} ${change.field} ${formatUsd(change.previous)} → ${formatUsd(change.price)}`;
		// Log what a real app would send, so the change shows in the browser console.
		console.log("[trading-01] position change", change, $state.snapshot(next));
	}

	/** Stands in for cancelling the order at the broker: once it is gone, close the position on the latest candle so it stays as history. */
	function handlePositionCancel(position: CandlestickChartPosition) {
		const exitTime = candles[candles.length - 1].time;
		positions = positions.map((item) => (item.id === position.id ? { ...item, exitTime } : item));
		orderStatus = `${position.label ?? position.id} cancelled at ${formatUsd(lastClose)}`;
		// Log what a real app would send, so the cancel shows in the browser console.
		console.log("[trading-01] position cancel", $state.snapshot(position));
	}
</script>

<PageMeta title="Trading 01 example" description="A full-screen trading chart with options walls, floor pivots, bot buy and sell markers, editable bot positions, swing points, sentiment, and news." />

<div class="trading not-typeset">
	<!-- Symbol, last price, and the change since the open. -->
	<header class="tradingHeader">
		<h1>{SYMBOL}</h1>
		<strong class="tradingPrice">{formatUsd(lastClose)}</strong>
		<span class="tradingChange" data-direction={change >= 0 ? "up" : "down"}>{change >= 0 ? "▲" : "▼"} {formatUsd(Math.abs(change))} ({Math.abs(changePercent).toFixed(2)}%)</span>
		<Badge variant="outline" size="sm">Simulated data</Badge>
		<!-- The latest target or stop change the chart reported, where a real app would update the order. -->
		<span class="tradingOrder" aria-live="polite">{orderStatus}</span>
	</header>

	<!-- Chart filling the rest of the screen; its legend floats inside the plot and toggles the indicators and each group. -->
	<main class="tradingMain">
		<CandlestickChart
			data={candles}
			{sessions}
			timeZone={TIME_ZONE}
			{levels}
			{markers}
			bind:positions
			onPositionsChange={handlePositionsChange}
			onPositionCancel={handlePositionCancel}
			indicators={[
				{ type: "vwap", regularHours: true },
				{ type: "ema", period: 9 },
				{ type: "ema", period: 21 },
			]}
			range={initialRange}
			formatPrice={formatUsd}
			grid={false}
			// legendPosition="overlay"
			legendOverflow="scroll"
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

	/* Last order change, pushed to the end of the row */
	.tradingOrder {
		margin-left: auto;
		color: var(--muted-foreground);
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
