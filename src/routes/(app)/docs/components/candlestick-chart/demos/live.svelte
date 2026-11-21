<script lang="ts">
	import { CandlestickChart, CandlestickChartLegend, CandlestickChartTooltip, type CandlestickChartCandle } from "#lib/components/ui/candlestick-chart/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { MINUTE_MS, currency, createLiveHistory } from "../data.js";

	// Price ticks per live candle; a tick arrives every half second.
	const TICKS_PER_CANDLE = 8;
	const TICK_MS = 500;
	let live: CandlestickChartCandle[] = $state([]);
	let isPaused = $state(false);
	let tickCount = 0;
	const liveLast = $derived(live.at(-1));
	const liveChange = $derived(liveLast && live[0] ? ((liveLast.close - live[0].open) / live[0].open) * 100 : 0);

	// Stream live candles in the browser only, so the page renders the same on the server.
	$effect(() => {
		live = createLiveHistory(120);
		const timer = setInterval(() => !isPaused && tickLive(), TICK_MS);
		return () => clearInterval(timer);
	});

	/** Moves the live price, and starts a new candle every few ticks. */
	function tickLive() {
		const last = live.at(-1);
		// If the history has not loaded yet: wait for it.
		if (!last) return;
		tickCount += 1;
		const price = last.close * (1 + (Math.random() - 0.495) * 0.0012);
		const volume = Math.round(Math.random() * 6);
		// If the candle's time is up: open a new one at the last close.
		if (tickCount % TICKS_PER_CANDLE === 0) {
			const time = (typeof last.time === "number" ? last.time : Date.parse(String(last.time))) + MINUTE_MS;
			live = [...live, { time, open: last.close, high: Math.max(last.close, price), low: Math.min(last.close, price), close: price, volume }];
			return;
		}
		live = [...live.slice(0, -1), { ...last, close: price, high: Math.max(last.high, price), low: Math.min(last.low, price), volume: (last.volume ?? 0) + volume }];
	}
</script>

<!-- One minute candles that update twice a second. -->
<div class="demoColumn">
	<div class="demoLiveHeader">
		<strong class="demoLivePrice">{liveLast ? currency.format(liveLast.close) : "–"}</strong>
		<span class="demoLiveChange">{liveChange >= 0 ? "▲" : "▼"} {Math.abs(liveChange).toFixed(2)}%</span>
		<Button size="sm" variant="outline" onclick={() => (isPaused = !isPaused)}>{isPaused ? "Resume" : "Pause"}</Button>
	</div>
	<CandlestickChart data={live} indicators={[{ type: "ema", period: 9 }, { type: "vwap" }]} formatPrice={(price) => currency.format(price)} label="Live sample feed, 1 minute candles" class="demoChart">
		<CandlestickChartLegend />
		<CandlestickChartTooltip />
	</CandlestickChart>
</div>

<style>
	/* Live price, change, and the pause button in one row */
	.demoLiveHeader {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
	}

	.demoLivePrice {
		font-size: var(--text-md);
		line-height: var(--line-height-md);
	}

	.demoLiveChange {
		flex: 1;
		color: var(--muted-foreground);
	}
</style>
