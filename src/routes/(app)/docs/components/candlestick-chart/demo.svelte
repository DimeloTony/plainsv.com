<script lang="ts">
	import { CandlestickChart, type CandlestickChartCandle, type CandlestickChartPriceLevel, type CandlestickChartProps, type CandlestickChartTradingSession } from "#lib/components/ui/candlestick-chart/index.js";
	import { ToggleGroup, ToggleGroupItem } from "#lib/components/ui/toggle-group/index.js";
	import { Button } from "#lib/components/ui/button/index.js";

	const { section = "preview" }: Props = $props();
	// 5 minute candles from 04:00 to 20:00 New York time, covering pre-market, regular hours, and after hours.
	const CANDLES_PER_DAY = 192;
	const MINUTE_MS = 60_000;
	// New York is 4 hours behind UTC in October, so 04:00 there is 08:00 UTC.
	const NEW_YORK_OFFSET_HOURS = 4;
	// Price ticks per live candle; a tick arrives every half second.
	const TICKS_PER_CANDLE = 8;
	const TICK_MS = 500;
	const VARIANTS = ["solid", "hollow", "ohlc", "line", "area"] as const;
	const sessions: CandlestickChartTradingSession[] = [
		{ start: "04:00", end: "09:30", label: "Pre-market" },
		{ start: "16:00", end: "20:00", label: "After hours" },
	];
	const intraday = createIntradayCandles(3, 7);
	const daily = createDailyCandles(260, 11, 0.48);
	const longRun = createDailyCandles(900, 5, 0.46);
	const levels = getLevels(intraday);
	// The last day and the evening before it, so pre-market, regular hours, and after hours all show.
	const sessionRange: [number, number] = [intraday.length - CANDLES_PER_DAY - 24, intraday.length];
	const earnings = [60, 125, 190].map((index) => ({ start: daily[index].time, end: daily[index + 1].time, label: "Earnings" }));
	const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
	let range: [number, number] | undefined = $state();
	let variant: Variant = $state("solid");
	let live: CandlestickChartCandle[] = $state([]);
	let isPaused = $state(false);
	let tickCount = 0;
	const liveLast = $derived(live.at(-1));
	const liveChange = $derived(liveLast && live[0] ? ((liveLast.close - live[0].open) / live[0].open) * 100 : 0);

	// Stream live candles in the browser only, so the page renders the same on the server.
	$effect(() => {
		// If this is not the live section: there is nothing to stream.
		if (section !== "live") return;
		live = createLiveHistory(120);
		const timer = setInterval(() => !isPaused && tickLive(), TICK_MS);
		return () => clearInterval(timer);
	});

	/** Seeded random numbers from 0 to 1 (mulberry32), so the server and the browser draw the same candles. */
	function createRandom(seed: number) {
		let state = seed;
		return () => {
			state = (state + 0x6d2b79f5) | 0;
			let value = Math.imul(state ^ (state >>> 15), 1 | state);
			value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
			return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
		};
	}

	/** Builds one candle from the previous close with a random move; `bias` below 0.5 drifts the price up. */
	function createCandle(time: number, open: number, random: () => number, volatility: number, baseVolume: number, bias = 0.48): CandlestickChartCandle {
		const close = open * (1 + (random() - bias) * volatility);
		const high = Math.max(open, close) * (1 + random() * volatility * 0.4);
		const low = Math.min(open, close) * (1 - random() * volatility * 0.4);
		return { time, open, high, low, close, volume: Math.round(baseVolume * (0.4 + random())) };
	}

	/** Builds 5 minute candles in New York time from Monday, October 19, 2026, with quieter pre-market and after hours. */
	function createIntradayCandles(days: number, seed: number) {
		const random = createRandom(seed);
		const candles: CandlestickChartCandle[] = [];
		let price = 182;
		for (let day = 0; day < days; day++) {
			for (let slot = 0; slot < CANDLES_PER_DAY; slot++) {
				const time = Date.UTC(2026, 9, 19 + day, 4 + NEW_YORK_OFFSET_HOURS) + slot * 5 * MINUTE_MS;
				// Regular hours run from slot 66 (09:30) to slot 144 (16:00), with heavier volume at the open and the close.
				const isRegular = slot >= 66 && slot < 144;
				const baseVolume = !isRegular ? 6_000 : slot < 72 || slot > 136 ? 90_000 : 40_000;
				const candle = createCandle(time, price, random, isRegular ? 0.004 : 0.0015, baseVolume);
				candles.push(candle);
				price = candle.close;
			}
		}
		return candles;
	}

	/** Builds daily candles on weekdays, from a fixed start so every render matches. */
	function createDailyCandles(count: number, seed: number, bias: number) {
		const random = createRandom(seed);
		const candles: CandlestickChartCandle[] = [];
		const date = new Date(Date.UTC(2026, 9, 30) - count * 1.4 * 86_400_000);
		let price = 140;
		while (candles.length < count) {
			// If the day is a weekend: skip it, as markets are closed.
			if (date.getUTCDay() !== 0 && date.getUTCDay() !== 6) {
				const candle = createCandle(date.getTime(), price, random, 0.025, 50_000_000, bias);
				candles.push(candle);
				price = candle.close;
			}
			date.setUTCDate(date.getUTCDate() + 1);
		}
		return candles;
	}

	/** Builds one minute candles ending now, for the live feed. */
	function createLiveHistory(count: number) {
		const now = Math.floor(Date.now() / MINUTE_MS) * MINUTE_MS;
		const candles: CandlestickChartCandle[] = [];
		let price = 64_000;
		for (let index = count - 1; index >= 0; index--) {
			const candle = createCandle(now - index * MINUTE_MS, price, Math.random, 0.0015, 40);
			candles.push(candle);
			price = candle.close;
		}
		return candles;
	}

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

	/** Places a support level near the lows and a resistance level near the highs of the data. */
	function getLevels(candles: CandlestickChartCandle[]): CandlestickChartPriceLevel[] {
		const low = Math.min(...candles.map((candle) => candle.low));
		const high = Math.max(...candles.map((candle) => candle.high));
		const spread = high - low;
		return [
			{ price: Math.round((low + spread * 0.15) * 2) / 2, label: "Support", kind: "support" },
			{ price: Math.round((high - spread * 0.12) * 2) / 2, label: "Resistance", kind: "resistance" },
		];
	}

	/** Whether a toggle value is a chart variant. */
	function isVariant(value: string): value is Variant {
		return VARIANTS.some((item) => item === value);
	}

	/** Chart price style */
	type Variant = NonNullable<CandlestickChartProps["variant"]>;

	/** Live preview for one section of the candlestick chart docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "sessions" | "highlights" | "live" | "levels" | "vwap" | "averages" | "bollinger" | "volume" | "zoom" | "variant" | "colors" | "grid" | "format" | "tooltip" | "sizes" | "table";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Extended hours in New York time, with a regular hours VWAP, an average, and levels. -->
		<CandlestickChart
			data={intraday}
			{sessions}
			timeZone="America/New_York"
			{levels}
			indicators={[
				{ type: "vwap", regularHours: true },
				{ type: "ema", period: 20 },
			]}
			label="Sample stock, 5 minute candles"
			class="demoChart"
		/>
	{:else if section === "sessions"}
		<!-- VWAP over all hours next to VWAP over regular hours. -->
		<CandlestickChart data={intraday} {sessions} timeZone="America/New_York" indicators={[{ type: "vwap", label: "VWAP all hours" }]} range={sessionRange} volume={false} size="sm" class="demoHalf" />
		<CandlestickChart data={intraday} {sessions} timeZone="America/New_York" indicators={[{ type: "vwap", regularHours: true, label: "VWAP regular hours" }]} range={sessionRange} volume={false} size="sm" class="demoHalf" />
	{:else if section === "highlights"}
		<!-- Earnings days on daily candles. -->
		<CandlestickChart data={daily} highlights={earnings} range={[40, 210]} size="sm" class="demoChart" />
	{:else if section === "live"}
		<!-- One minute candles that update twice a second. -->
		<div class="demoColumn">
			<div class="demoLiveHeader">
				<strong class="demoLivePrice">{liveLast ? currency.format(liveLast.close) : "–"}</strong>
				<span class="demoLiveChange">{liveChange >= 0 ? "▲" : "▼"} {Math.abs(liveChange).toFixed(2)}%</span>
				<Button size="sm" variant="outline" onclick={() => (isPaused = !isPaused)}>{isPaused ? "Resume" : "Pause"}</Button>
			</div>
			<CandlestickChart data={live} indicators={[{ type: "ema", period: 9 }, { type: "vwap" }]} formatPrice={(price) => currency.format(price)} label="Live sample feed, 1 minute candles" class="demoChart" />
		</div>
	{:else if section === "levels"}
		<!-- Support and resistance, plus a level above the visible prices. -->
		<CandlestickChart data={intraday} levels={[...levels, { price: 400, label: "Target" }]} lastPrice={false} volume={false} size="sm" class="demoChart" />
	{:else if section === "vwap"}
		<!-- VWAP with one and two deviation bands, restarting each day. -->
		<CandlestickChart data={intraday} timeZone="America/New_York" indicators={[{ type: "vwap", bands: [1, 2] }]} range={[0, intraday.length]} class="demoChart" />
	{:else if section === "averages"}
		<!-- Daily candles with a fast and a slow average. -->
		<CandlestickChart
			data={daily}
			indicators={[
				{ type: "ema", period: 20 },
				{ type: "sma", period: 50 },
			]}
			class="demoChart"
		/>
	{:else if section === "bollinger"}
		<!-- Bollinger bands on daily candles. -->
		<CandlestickChart data={daily} indicators={[{ type: "bollinger" }]} class="demoChart" />
	{:else if section === "volume"}
		<!-- Candles without the volume pane. -->
		<CandlestickChart data={daily} volume={false} size="sm" class="demoChart" />
	{:else if section === "zoom"}
		<!-- Visible range bound to state. -->
		<div class="demoColumn">
			<CandlestickChart data={daily} bind:range class="demoChart" />
			<p>Range: <code>{range ? `${Math.round(range[0])} to ${Math.round(range[1])}` : "latest candles"}</code></p>
		</div>
	{:else if section === "variant"}
		<!-- Every price style on the same data. -->
		<div class="demoColumn">
			<ToggleGroup type="single" value={variant} onValueChange={(next) => isVariant(next) && (variant = next)} size="sm" variant="outline" aria-label="Price style">
				{#each VARIANTS as item (item)}
					<ToggleGroupItem value={item}>{item}</ToggleGroupItem>
				{/each}
			</ToggleGroup>
			<CandlestickChart data={daily} {variant} size="sm" class="demoChart" />
		</div>
	{:else if section === "colors"}
		<!-- Custom rising, falling, and line colors. -->
		<CandlestickChart data={daily} size="sm" style="--candlestick-chart-up: var(--chart-1); --candlestick-chart-down: var(--chart-2)" class="demoHalf" />
		<CandlestickChart data={daily} variant="area" size="sm" style="--candlestick-chart-line: var(--chart-5)" class="demoHalf" />
	{:else if section === "grid"}
		<!-- No gridlines, and a log scale over a long run. -->
		<CandlestickChart data={daily} grid={false} size="sm" class="demoHalf" />
		<CandlestickChart data={longRun} scale="log" variant="line" range={[0, longRun.length]} size="sm" class="demoHalf" />
	{:else if section === "format"}
		<!-- Prices in dollars. -->
		<CandlestickChart data={intraday} formatPrice={(price) => currency.format(price)} size="sm" class="demoChart" />
	{:else if section === "tooltip"}
		<!-- Custom tooltip with the range of the candle. -->
		<CandlestickChart data={daily} size="sm" class="demoChart">
			{#snippet tooltip({ label, candle, changePercent })}
				<strong>{label}</strong>
				<span>Range: {(candle.high - candle.low).toFixed(2)}</span>
				<span>{changePercent >= 0 ? "▲" : "▼"} {Math.abs(changePercent).toFixed(2)}%</span>
			{/snippet}
		</CandlestickChart>
	{:else if section === "sizes"}
		<!-- Smallest and largest sizes. -->
		<CandlestickChart data={daily} size="xs" class="demoHalf" />
		<CandlestickChart data={daily} size="lg" class="demoHalf" />
	{:else if section === "table"}
		<!-- Chart with the table of visible candles. -->
		<CandlestickChart data={daily} range={[daily.length - 20, daily.length]} table size="sm" class="demoChart" />
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: var(--spacing-xl);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 1rem 0;
	}

	.demoColumn {
		display: flex;
		flex: 1 1 100%;
		flex-direction: column;
		gap: var(--spacing-sm);
		min-width: 0;
		font-size: var(--text-sm);
	}

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

	.demo :global(.demoChart) {
		flex: 1 1 100%;
	}

	.demo :global(.demoHalf) {
		flex: 1 1 18rem; /* 288px */
	}
</style>
