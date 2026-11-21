import { getEma, type CandlestickChartCandle, type CandlestickChartMarker, type CandlestickChartPosition, type CandlestickChartPriceLevel, type CandlestickChartTradingSession } from "#lib/components/ui/candlestick-chart/index.js";

// 5 minute candles from 04:00 to 20:00 New York time, covering pre-market, regular hours, and after hours.
const CANDLES_PER_DAY = 192;
export const MINUTE_MS = 60_000;
// New York is 4 hours behind UTC in October, so 04:00 there is 08:00 UTC.
const NEW_YORK_OFFSET_HOURS = 4;

export const sessions: CandlestickChartTradingSession[] = [
	{ start: "04:00", end: "09:30", label: "Pre-market" },
	{ start: "16:00", end: "20:00", label: "After hours" },
];
export const intraday = createIntradayCandles(3, 7);
export const daily = createDailyCandles(260, 11, 0.48);
export const longRun = createDailyCandles(900, 5, 0.46);
export const levels = getLevels(intraday);
export const walls: CandlestickChartPriceLevel[] = [
	{ ...levels[0], label: "Put wall", size: 3 },
	{ ...levels[1], label: "Call wall", size: 3 },
];
// The last day and the evening before it, so pre-market, regular hours, and after hours all show.
export const sessionRange: [number, number] = [intraday.length - CANDLES_PER_DAY - 24, intraday.length];
export const earnings = [60, 125, 190].map((index) => ({ start: daily[index].time, end: daily[index + 1].time, label: "Earnings" }));
export const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
export const signals = getCrossSignals(daily, 9, 21);
export const sentiment = getSentiment(daily, 3);
export const news: CandlestickChartMarker[] = [200, 214, 231, 247].map((index, position) => ({ time: daily[index].time, size: 1.8, label: ["Product launch", "Analyst upgrade", "Fed decision", "Supplier deal"][position] }));

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
export function createCandle(time: number, open: number, random: () => number, volatility: number, baseVolume: number, bias = 0.48): CandlestickChartCandle {
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
export function createLiveHistory(count: number) {
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

/** Places a support level near the lows and a resistance level near the highs of the data. */
export function getLevels(candles: CandlestickChartCandle[]): CandlestickChartPriceLevel[] {
	const low = Math.min(...candles.map((candle) => candle.low));
	const high = Math.max(...candles.map((candle) => candle.high));
	const spread = high - low;
	return [
		{ price: Math.round((low + spread * 0.15) * 2) / 2, label: "Support", kind: "support" },
		{ price: Math.round((high - spread * 0.12) * 2) / 2, label: "Resistance", kind: "resistance" },
	];
}

/** Buy when the fast EMA crosses above the slow one, and sell when it crosses below, like a simple trading bot. */
function getCrossSignals(candles: CandlestickChartCandle[], fast: number, slow: number): CandlestickChartMarker[] {
	const closes = candles.map((candle) => candle.close);
	const fastLine = getEma(closes, fast);
	const slowLine = getEma(closes, slow);
	return candles.flatMap((candle, index): CandlestickChartMarker[] => {
		const before = fastLine[index - 1] - slowLine[index - 1];
		const now = fastLine[index] - slowLine[index];
		// If an average has not started yet or the lines did not cross: there is no signal.
		if (!Number.isFinite(before) || !Number.isFinite(now) || Math.sign(before) === Math.sign(now)) return [];
		const isBuy = now > 0;
		return [{ time: candle.time, kind: isBuy ? "buy" : "sell", text: isBuy ? "BUY" : "SELL", label: `${isBuy ? "Bought" : "Sold"} at ${currency.format(candle.close)}` }];
	});
}

/** Places a sentiment bubble on every fifth candle, sized by how strong the score is and colored by its sign. */
function getSentiment(candles: CandlestickChartCandle[], seed: number): CandlestickChartMarker[] {
	const random = createRandom(seed);
	return candles.flatMap((candle, index): CandlestickChartMarker[] => {
		const score = random() * 2 - 1;
		// If this is not a fifth candle: leave it bare.
		if (index % 5) return [];
		return [{ time: candle.time, color: score >= 0 ? "var(--chart-3)" : "var(--destructive)", size: 1 + Math.abs(score) * 1.5, label: `Sentiment ${score >= 0 ? "+" : ""}${score.toFixed(2)}` }];
	});
}

/** Builds an open long near the end of the data and a closed short before it, with targets and stops a few percent away. */
export function getPositions(candles: CandlestickChartCandle[]): CandlestickChartPosition[] {
	const long = candles[candles.length - 30];
	const short = candles[candles.length - 70];
	const round = (price: number) => Math.round(price * 100) / 100;
	return [
		{ id: "bot-1", side: "long", time: long.time, entry: long.close, target: round(long.close * 1.06), stop: round(long.close * 0.97), label: "Bot #1" },
		{ id: "bot-2", side: "short", time: short.time, entry: short.close, target: round(short.close * 0.95), stop: round(short.close * 1.03), exitTime: candles[candles.length - 50].time, label: "Bot #2" },
	];
}
