<script lang="ts">
	import { PageMeta } from "#lib/components/shared/index.js";
	import { CandlestickChart, CandlestickChartInfo, CandlestickChartLegend, CandlestickChartTooltip, getDraftPosition, type CandlestickChartCandle, type CandlestickChartPosition, type CandlestickChartPositionChange } from "#lib/components/ui/candlestick-chart/index.js";
	import { Badge } from "#lib/components/ui/badge/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { Spinner } from "#lib/components/ui/spinner/index.js";
	import { SYMBOL, TIME_ZONE, candles, sessions, dayOpen, trades, swings, sentiment, news, initialRange, formatUsd, getTradeMarkers, getWallLevels, getPivotLevels, getPositions, getGammaLevels } from "./data.js";
	const levels = [...getWallLevels(), ...getPivotLevels(), ...getGammaLevels()];
	// Trades first, so their arrows sit nearest the candles, then swings, sentiment, and news stack beyond them.
	const markers = [...getTradeMarkers(trades), ...swings, ...sentiment, ...news];
	// Live feed: a tick each second moves the latest candle, and every 10 ticks a new 5 minute candle opens.
	const TICK_MS = 1000;
	const TICKS_PER_CANDLE = 10;
	const CANDLE_MS = 5 * 60_000;
	// Largest share of the price one tick moves it.
	const TICK_VOLATILITY = 0.0008;
	let liveCandles: CandlestickChartCandle[] = $state([...candles]);
	let isPaused = $state(false);
	let tickCount = 0;
	const latest = $derived(liveCandles[liveCandles.length - 1]);
	const change = $derived(latest.close - dayOpen);
	const changePercent = $derived((change / dayOpen) * 100);
	// The bot's round trips as closed positions and its latest buy as an open one, whose target and stop drag.
	let positions: CandlestickChartPosition[] = $state(getPositions(trades));
	// The latest order update the chart reported, shown in the header.
	let orderStatus = $state("Press Long or Short to set up a trade, or drag the open position's target or stop");
	// Milliseconds the stand-in broker takes to fill a confirmed order, and the timers waiting on fills.
	const FILL_DELAY_MS = 1500;
	const fillTimers = new Set<ReturnType<typeof setTimeout>>();
	// Numbers the trades set up from the header, so each gets its own id and name.
	let tradeCount = 0;
	// Walls and pivots start hidden so the gamma levels read clearly; the legend shows them again.
	let hiddenGroups = $state(["Walls", "Pivots"]);
	// Whether the chart has drawn its candles; the loader covers the plot until then.
	let isChartReady = $state(false);

	// Stop waiting on fills when the page goes away.
	$effect(() => () => fillTimers.forEach((timer) => clearTimeout(timer)));

	// Stream ticks in the browser only, so the page renders the same on the server; paused ticks are skipped, not queued.
	$effect(() => {
		const timer = setInterval(() => !isPaused && tick(), TICK_MS);
		return () => clearInterval(timer);
	});

	/** Moves the latest price a little, and opens a new candle every few ticks, like a live feed. */
	function tick() {
		const last = liveCandles[liveCandles.length - 1];
		const close = last.close * (1 + (Math.random() - 0.5) * 2 * TICK_VOLATILITY);
		tickCount += 1;
		// If the candle's period is over: open the next one at the last close.
		if (tickCount % TICKS_PER_CANDLE === 0) {
			const time = new Date(last.time).getTime() + CANDLE_MS;
			liveCandles = [...liveCandles, { time, open: last.close, high: Math.max(last.close, close), low: Math.min(last.close, close), close, volume: 0 }];
			return;
		}
		const volume = (last.volume ?? 0) + Math.round(Math.random() * 2_000);
		liveCandles = [...liveCandles.slice(0, -1), { ...last, high: Math.max(last.high, close), low: Math.min(last.low, close), close, volume }];
	}

	/** Adds a draft trade at the latest close, to adjust on the chart and confirm with its check mark. */
	function startTrade(side: CandlestickChartPosition["side"]) {
		tradeCount += 1;
		const draft = getDraftPosition(liveCandles, { id: `manual-${tradeCount}`, side, label: `Trade #${tradeCount}` });
		// If there are no candles: there is no price to start from.
		if (!draft) return;
		positions = [...positions, draft];
		orderStatus = `${draft.label} drafted: drag its lines, then press ✓`;
	}

	/** Stands in for sending the order: the trade waits as pending, then the broker fills it at the latest candle. */
	function handlePositionConfirm(position: CandlestickChartPosition) {
		setTrade(position.id, { stage: "pending" });
		orderStatus = `${position.label ?? position.id} sent, waiting for fill…`;
		console.log("[trading-01] position confirm", $state.snapshot(position));
		const timer = setTimeout(() => {
			fillTimers.delete(timer);
			setTrade(position.id, { stage: "open", time: liveCandles[liveCandles.length - 1].time });
			orderStatus = `${position.label ?? position.id} filled at ${formatUsd(position.entry)}`;
		}, FILL_DELAY_MS);
		fillTimers.add(timer);
	}

	/** Updates one trade in `positions`. */
	function setTrade(id: string, changes: Partial<CandlestickChartPosition>) {
		positions = positions.map((item) => (item.id === id ? { ...item, ...changes } : item));
	}

	/** Stands in for sending the new target or stop to the bot's broker. */
	function handlePositionsChange(next: CandlestickChartPosition[], change: CandlestickChartPositionChange) {
		orderStatus = `${change.position.label ?? change.id} ${change.field} ${formatUsd(change.previous)} → ${formatUsd(change.price)}`;
		// Log what a real app would send, so the change shows in the browser console.
		console.log("[trading-01] position change", change, $state.snapshot(next));
	}

	/** Stands in for cancelling the order at the broker: a draft or pending trade never filled, so it is dropped, and an open one closes on the latest candle so it stays as history. */
	function handlePositionCancel(position: CandlestickChartPosition) {
		// If the trade never filled: drop it.
		if (position.stage === "draft" || position.stage === "pending") {
			positions = positions.filter((item) => item.id !== position.id);
			orderStatus = `${position.label ?? position.id} ${position.stage === "draft" ? "discarded" : "cancelled before filling"}`;
			return;
		}
		setTrade(position.id, { stage: "closed", exitTime: liveCandles[liveCandles.length - 1].time });
		orderStatus = `${position.label ?? position.id} cancelled at ${formatUsd(latest.close)}`;
		// Log what a real app would send, so the cancel shows in the browser console.
		console.log("[trading-01] position cancel", $state.snapshot(position));
	}
</script>

<PageMeta title="Trading 01 example" description="A full-screen trading chart with options walls, floor pivots, bot buy and sell markers, editable bot positions, swing points, sentiment, and news." />

<div class="trading not-typeset">
	<!-- Symbol, last price, and the change since the open. -->
	<header class="tradingHeader">
		<h1>{SYMBOL}</h1>
		<strong class="tradingPrice">{formatUsd(latest.close)}</strong>
		<span class="tradingChange" data-direction={change >= 0 ? "up" : "down"}>{change >= 0 ? "▲" : "▼"} {formatUsd(Math.abs(change))} ({Math.abs(changePercent).toFixed(2)}%)</span>
		<Badge variant="outline" size="sm">Simulated data</Badge>
		<!-- Pause or resume the live feed, such as to set up a trade on still candles. -->
		<Button size="xs" variant="outline" aria-pressed={isPaused} onclick={() => (isPaused = !isPaused)}>{isPaused ? "Resume" : "Pause"}</Button>
		<!-- Set up a trade: it drafts on the chart, waits once confirmed, then fills. -->
		<Button size="xs" variant="outline" onclick={() => startTrade("long")}>Long</Button>
		<Button size="xs" variant="outline" onclick={() => startTrade("short")}>Short</Button>
		<!-- The latest target or stop change the chart reported, where a real app would update the order. -->
		<span class="tradingOrder" aria-live="polite">{orderStatus}</span>
	</header>

	<!-- Chart filling the rest of the screen; its legend floats inside the plot and toggles the indicators and each group. -->
	<main class="tradingMain">
		<CandlestickChart
			volume={false}
			data={liveCandles}
			{sessions}
			timeZone={TIME_ZONE}
			{levels}
			bind:hiddenGroups
			{markers}
			bind:positions
			onPositionsChange={handlePositionsChange}
			onPositionCancel={handlePositionCancel}
			onPositionConfirm={handlePositionConfirm}
			indicators={[
				{ type: "vwap", regularHours: true },
				{ type: "ema", period: 9 },
				{ type: "ema", period: 21 },
			]}
			range={initialRange}
			gestures="chart"
			bind:ready={isChartReady}
			formatPrice={formatUsd}
			grid={false}
			size="lg"
			label="{SYMBOL}, 5 minute candles"
			class="tradingChart"
		>
			<!-- The candle's values in the corner, the legend floating bottom-left, and a tooltip for the rest. -->
			<CandlestickChartInfo />
			<CandlestickChartLegend position="overlayBottom" overflow="scroll" />
			<CandlestickChartTooltip ohlc={false} />
			<!-- Gamma levels as a chain of bubbles drawn by one repeating background, and a running one names itself at the axis, like KING 662; walls and pivots stay plain lines. -->
			{#snippet level({ level, color, bandHeight })}
				{#if level.group === "Gamma"}
					<span class="gammaChain" data-role={level.label} style:--gamma-color={color}></span>
					{#if level.end === undefined}
						<span class="gammaName" style:--gamma-color={color}>{level.label}</span>
					{/if}
				{:else}
					<span class="plainLevel" style:--gamma-color={color} style:--gamma-band="{bandHeight}px"></span>
				{/if}
			{/snippet}
		</CandlestickChart>
		<!-- Loader over the chart until it has measured itself and drawn the candles. -->
		{#if !isChartReady}
			<Spinner class="tradingLoader" size="xl" />
		{/if}
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
		position: relative;
		flex: 1;
		padding-top: var(--spacing);
		min-height: 0;
	}

	/* Loader centered over the chart */
	.tradingMain :global(.tradingLoader) {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.tradingMain :global(.candlestickChartLegend) {
		padding-left: var(--spacing-md);
	}

	/* The chart and its plot grow to fill the space under the header, never shorter than 20rem */
	.tradingMain :global(.tradingChart) {
		flex: 1;
		min-height: 0;
	}

	/* Chain of soft ovals in the level color, one background on one element so panning stays cheap */
	.gammaChain {
		flex: 1;
		background-image: radial-gradient(ellipse closest-side, color-mix(in oklab, var(--gamma-color) 35%, transparent) 55%, var(--gamma-color) 70%, transparent 85%);
		background-size: 0.625rem 100%; /* 10px */
		background-repeat: repeat-x;
		height: 0.4375rem; /* 7px */
	}

	/* KING reads heaviest */
	.gammaChain[data-role="KING"] {
		background-size: 0.75rem 100%; /* 12px */
		height: 0.5625rem; /* 9px */
	}

	/* Role name at the right end of a running named level */
	.gammaName {
		position: absolute;
		right: var(--spacing-xs);
		border: 1px solid color-mix(in oklab, var(--gamma-color) 60%, transparent);
		border-radius: var(--radius-xs);
		background-color: var(--popover);
		padding: 0 var(--spacing-xs);
		color: var(--gamma-color);
		font-weight: 600;
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
		font-family: var(--font-mono, ui-monospace, monospace);
		letter-spacing: 0.08em;
	}

	/* Walls and pivots as a dashed line, or a soft band when sized */
	.plainLevel {
		flex: 1;
		border-top: 1px dashed var(--gamma-color);
		background-color: color-mix(in oklab, var(--gamma-color) 22%, transparent);
		height: var(--gamma-band);
	}

	.tradingMain :global(.tradingChart .candlestickChartPlot) {
		flex: 1;
		height: auto;
		min-height: 20rem; /* 320px */
	}
</style>
