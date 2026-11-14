import type { CandlestickChartCandle, CandlestickChartMarker, CandlestickChartPosition, CandlestickChartPriceLevel, CandlestickChartTradingSession } from "#lib/components/ui/candlestick-chart/index.js";

// 5 minute candles from 04:00 to 20:00 New York time; regular hours run from slot 66 (09:30) to slot 144 (16:00).
const CANDLES_PER_DAY = 192;
const REGULAR_START = 66;
const REGULAR_END = 144;
// Yesterday in full and today up to the current time, 11:00, which is slot 84.
const DAYS = 2;
const NOW_SLOT = 84;
const MINUTE_MS = 60_000;
// New York is 5 hours behind UTC in November, so 04:00 there is 09:00 UTC.
const NEW_YORK_OFFSET_HOURS = 5;
// Share of regular-hours candles that spike into a long wick.
const SPIKE_CHANCE = 0.05;
// Shares the bot trades each time.
const SHARES = 100;
// Candles a rejection must set a new low or high against, and how long its wick must be next to its body and its range.
const REJECTION_LOOKBACK = 12;
const WICK_TO_BODY = 2;
const WICK_SHARE = 0.55;
// Reward the bot aims for per unit of risk, and the least risk it takes as a share of the entry, so a tiny wick never sets a stop at the entry.
const REWARD_TO_RISK = 2;
const MIN_RISK_SHARE = 0.002;
// Candles on each side a swing high or low must beat.
const SWING_WINDOW = 10;
// Strike spacing and count of the sample option chain.
const STRIKE_STEP = 1;
const STRIKE_COUNT = 21;

export const SYMBOL = "PLSV";
export const TIME_ZONE = "America/New_York";
export const sessions: CandlestickChartTradingSession[] = [
	{ start: "04:00", end: "09:30", label: "Pre-market" },
	{ start: "16:00", end: "20:00", label: "After hours" },
];
export const candles = createIntradayCandles(DAYS, 21);
export const lastClose = candles[candles.length - 1].close;
export const dayOpen = candles[(DAYS - 1) * CANDLES_PER_DAY + REGULAR_START].open;
export const optionChain = createOptionChain(lastClose, 5);
export const walls = getWalls(optionChain, lastClose);
export const pivots = getFloorPivots(candles, DAYS - 2);
export const trades = getTrades(candles);
export const swings = getSwings(candles);
export const sentiment = getSentiment(candles, 8);
export const news = getNews(candles);
// Both days, from yesterday's pre-market through today's 16:00 close, leaving the rest of today as empty space to trade into.
export const initialRange: [number, number] = [0, (DAYS - 1) * CANDLES_PER_DAY + REGULAR_END];

/** Seeded random numbers from 0 to 1 (mulberry32), so the server and the browser draw the same data. */
function createRandom(seed: number) {
	let state = seed;
	return () => {
		state = (state + 0x6d2b79f5) | 0;
		let value = Math.imul(state ^ (state >>> 15), 1 | state);
		value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
		return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
	};
}

/** Whether a candle index falls in regular hours. */
function isRegular(index: number) {
	const slot = index % CANDLES_PER_DAY;
	return slot >= REGULAR_START && slot < REGULAR_END;
}

/** Formats a price in dollars. */
export function formatUsd(price: number) {
	return price.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

/** Builds 5 minute candles in New York time from Thursday, November 12, 2026, ending at 11:00 on the last day, with quieter pre-market and after hours. */
function createIntradayCandles(days: number, seed: number) {
	const random = createRandom(seed);
	const result: CandlestickChartCandle[] = [];
	let price = 182;
	for (let day = 0; day < days; day++) {
		// The last day is today, so its candles stop at the current time.
		const count = day === days - 1 ? NOW_SLOT : CANDLES_PER_DAY;
		for (let slot = 0; slot < count; slot++) {
			const time = Date.UTC(2026, 10, 12 + day, 4 + NEW_YORK_OFFSET_HOURS) + slot * 5 * MINUTE_MS;
			const regular = slot >= REGULAR_START && slot < REGULAR_END;
			// Heavier volume at the open and the close, and light volume outside regular hours.
			const baseVolume = !regular ? 6_000 : slot < REGULAR_START + 6 || slot > REGULAR_END - 8 ? 90_000 : 40_000;
			const volatility = regular ? 0.004 : 0.0015;
			// A few regular-hours candles spike and snap back with a small body, leaving the long wicks the bot reads as rejections.
			const spike = regular && random() < SPIKE_CHANCE ? (random() < 0.5 ? "low" : "high") : null;
			const spikeSize = spike ? volatility * (1 + random()) : 0;
			const open = price;
			const close = open * (1 + (random() - 0.49) * volatility * (spike ? 0.3 : 1));
			const high = Math.max(open, close) * (1 + random() * volatility * 0.4 + (spike === "high" ? spikeSize : 0));
			const low = Math.min(open, close) * (1 - random() * volatility * 0.4 - (spike === "low" ? spikeSize : 0));
			result.push({ time, open, high, low, close, volume: Math.round(baseVolume * (0.4 + random())) });
			price = close;
		}
	}
	return result;
}

/** Builds open interest per strike around the spot price, with call interest peaking above it and put interest below it. */
function createOptionChain(spot: number, seed: number): StrikeInterest[] {
	const random = createRandom(seed);
	const first = Math.round((spot - ((STRIKE_COUNT - 1) / 2) * STRIKE_STEP) / STRIKE_STEP) * STRIKE_STEP;
	return Array.from({ length: STRIKE_COUNT }, (_, offset) => {
		const strike = first + offset * STRIKE_STEP;
		const calls = Math.round(1_500 + 14_000 * Math.exp(-(((strike - spot - 1.8) / 1.5) ** 2)) + random() * 2_000);
		const puts = Math.round(1_500 + 12_000 * Math.exp(-(((strike - spot + 1.6) / 1.5) ** 2)) + random() * 2_000);
		return { strike, calls, puts };
	});
}

/** Finds the call wall above the spot, the put wall below it, and max pain, where option holders lose the most at expiry. */
function getWalls(chain: StrikeInterest[], spot: number) {
	const above = chain.filter((item) => item.strike >= spot);
	const below = chain.filter((item) => item.strike <= spot);
	const callWall = above.reduce((best, item) => (item.calls > best.calls ? item : best), above[0]).strike;
	const putWall = below.reduce((best, item) => (item.puts > best.puts ? item : best), below[0]).strike;
	// Max pain is the strike where in-the-money calls and puts pay out the least in total.
	const payout = (price: number) => chain.reduce((sum, item) => sum + item.calls * Math.max(0, price - item.strike) + item.puts * Math.max(0, item.strike - price), 0);
	const maxPain = chain.reduce((best, item) => (payout(item.strike) < payout(best.strike) ? item : best), chain[0]).strike;
	return { callWall, putWall, maxPain };
}

/** Classic floor pivots from one day's regular-hours high, low, and close. */
function getFloorPivots(data: CandlestickChartCandle[], day: number) {
	const regular = data.slice(day * CANDLES_PER_DAY + REGULAR_START, day * CANDLES_PER_DAY + REGULAR_END);
	const high = Math.max(...regular.map((candle) => candle.high));
	const low = Math.min(...regular.map((candle) => candle.low));
	const close = regular[regular.length - 1].close;
	const pivot = (high + low + close) / 3;
	return { r2: pivot + (high - low), r1: pivot * 2 - low, pivot, s1: pivot * 2 - high, s2: pivot - (high - low) };
}

/** Finds a rejection: a candle that sets a new low or high for the lookback, then closes well away from it, leaving a long wick. */
function getRejection(data: CandlestickChartCandle[], index: number) {
	const candle = data[index];
	const previous = data.slice(index - REJECTION_LOOKBACK, index);
	const range = candle.high - candle.low;
	const body = Math.abs(candle.close - candle.open);
	const lowerWick = Math.min(candle.open, candle.close) - candle.low;
	const upperWick = candle.high - Math.max(candle.open, candle.close);
	// If there are not enough candles before it, or it did not move: there is nothing to reject.
	if (index < REJECTION_LOOKBACK || range <= 0) return null;
	// If it undercut every recent low and buyers pushed it back up: the bottom was rejected.
	if (previous.every((other) => other.low > candle.low) && lowerWick >= body * WICK_TO_BODY && lowerWick >= range * WICK_SHARE) return "bottom";
	// If it topped every recent high and sellers pushed it back down: the top was rejected.
	if (previous.every((other) => other.high < candle.high) && upperWick >= body * WICK_TO_BODY && upperWick >= range * WICK_SHARE) return "top";
	return null;
}

/** Runs a simple bot in regular hours: buy the close of a bottom rejection, and sell the close of a top rejection or of the day. */
function getTrades(data: CandlestickChartCandle[]) {
	const result: Trade[] = [];
	let entry: Trade | null = null;
	for (const [index, candle] of data.entries()) {
		// If the market is not in regular hours: the bot waits.
		if (!isRegular(index)) continue;
		const rejection = getRejection(data, index);
		const isLastBar = index % CANDLES_PER_DAY === REGULAR_END - 1;
		// If flat and the bottom was rejected, with time left in the day: buy.
		if (!entry && rejection === "bottom" && !isLastBar) {
			entry = { index, time: candle.time, side: "buy", price: candle.close, reason: "Bottom rejection" };
			result.push(entry);
		}
		// If long and the top was rejected, or the day ends: sell.
		else if (entry && (rejection === "top" || isLastBar)) {
			result.push({ index, time: candle.time, side: "sell", price: candle.close, reason: isLastBar ? "Close of day" : "Top rejection", pnl: (candle.close - entry.price) * SHARES });
			entry = null;
		}
	}
	return result;
}

/** Finds regular-hours swing highs and lows: candles whose high or low beats every candle within `SWING_WINDOW` on both sides. */
function getSwings(data: CandlestickChartCandle[]): CandlestickChartMarker[] {
	return data.flatMap((candle, index): CandlestickChartMarker[] => {
		const window = data.slice(Math.max(0, index - SWING_WINDOW), index + SWING_WINDOW + 1);
		// If the candle is outside regular hours, or the window runs past either end of the data: there is no swing to mark.
		if (!isRegular(index) || index < SWING_WINDOW || index + SWING_WINDOW >= data.length) return [];
		if (window.every((other) => other === candle || other.high < candle.high)) return [{ time: candle.time, group: "Swings", position: "above", shape: "square", color: "var(--chart-4)", size: 0.6, text: "PH", label: `Swing high ${formatUsd(candle.high)}` }];
		if (window.every((other) => other === candle || other.low > candle.low)) return [{ time: candle.time, group: "Swings", position: "below", shape: "square", color: "var(--chart-4)", size: 0.6, text: "PL", label: `Swing low ${formatUsd(candle.low)}` }];
		return [];
	});
}

/** Places a sentiment bubble over every 16th regular-hours candle, sized by the score's strength and colored by its sign. */
function getSentiment(data: CandlestickChartCandle[], seed: number): CandlestickChartMarker[] {
	const random = createRandom(seed);
	return data.flatMap((candle, index): CandlestickChartMarker[] => {
		// If the candle is outside regular hours or between readings: leave it bare.
		if (!isRegular(index) || index % 16) return [];
		const score = random() * 2 - 1;
		return [{ time: candle.time, group: "Sentiment", position: "above", color: score >= 0 ? "var(--chart-3)" : "var(--destructive)", size: 1 + Math.abs(score) * 1.4, label: `Sentiment ${score >= 0 ? "+" : ""}${score.toFixed(2)}` }];
	});
}

/** Marks a few headlines under the candles they broke on. */
function getNews(data: CandlestickChartCandle[]): CandlestickChartMarker[] {
	const headlines = [
		{ day: 0, slot: 48, label: "Earnings beat estimates" },
		{ day: 0, slot: 100, label: "Analyst upgrade to Buy" },
		{ day: 1, slot: 54, label: "CPI report released" },
	];
	return headlines.map(({ day, slot, label }): CandlestickChartMarker => ({ time: data[day * CANDLES_PER_DAY + slot].time, group: "News", position: "below", color: "var(--chart-5)", text: "NEWS", label }));
}

/** Turns the bot's trades into an arrow over or under each candle and a fill mark at the exact price. */
export function getTradeMarkers(list: Trade[]): CandlestickChartMarker[] {
	return list.flatMap((trade): CandlestickChartMarker[] => {
		const isBuy = trade.side === "buy";
		const pnl = trade.pnl === undefined ? "" : `, ${trade.pnl >= 0 ? "+" : "-"}${formatUsd(Math.abs(trade.pnl))}`;
		return [
			{ time: trade.time, group: "Bot trades", kind: trade.side, text: isBuy ? "BUY" : "SELL", label: `${isBuy ? "Bought" : "Sold"} ${SHARES} at ${formatUsd(trade.price)}, ${trade.reason.toLowerCase()}${pnl}` },
			{ time: trade.time, group: "Bot trades", kind: trade.side, position: "price", price: trade.price, shape: "square", size: 0.5, label: "Fill" },
		];
	});
}

/** Turns each round trip into a closed position and the bot's latest buy into an open one, with a stop under the entry candle's low and a target at twice the risk. */
export function getPositions(list: Trade[]): CandlestickChartPosition[] {
	const result: CandlestickChartPosition[] = [];
	for (const [position, trade] of list.entries()) {
		// If this is a sell: its buy already made the position.
		if (trade.side !== "buy") continue;
		const exit = list[position + 1];
		const risk = Math.max(trade.price - candles[trade.index].low, trade.price * MIN_RISK_SHARE);
		const round = (price: number) => Math.round(price * 100) / 100;
		result.push({ id: `trade-${trade.index}`, side: "long", time: trade.time, entry: trade.price, stop: round(trade.price - risk), target: round(trade.price + risk * REWARD_TO_RISK), exitTime: exit?.time, label: `Bot #${result.length + 1}` });
	}
	// If the bot ended flat: open one more long on the latest candle, so there is always a position to edit.
	if (!result.length || result.at(-1)?.exitTime !== undefined) {
		const last = candles.length - 1;
		const risk = Math.max(lastClose - candles[last].low, lastClose * MIN_RISK_SHARE * 2);
		result.push({ id: "trade-live", side: "long", time: candles[last - 6].time, entry: lastClose, stop: Math.round((lastClose - risk) * 100) / 100, target: Math.round((lastClose + risk * REWARD_TO_RISK) * 100) / 100, label: `Bot #${result.length + 1}` });
	}
	return result;
}

/** Draws the walls and max pain from open interest, the walls sized by their open interest. */
export function getWallLevels(): CandlestickChartPriceLevel[] {
	const maxInterest = Math.max(...optionChain.flatMap((item) => [item.calls, item.puts]));
	const callInterest = optionChain.find((item) => item.strike === walls.callWall)?.calls ?? 0;
	const putInterest = optionChain.find((item) => item.strike === walls.putWall)?.puts ?? 0;
	// Each wall's band grows with its open interest, up to 4, so the heavier wall reads thicker.
	return [
		{ price: walls.callWall, label: "Call wall", group: "Walls", kind: "resistance", size: 1 + (callInterest / maxInterest) * 3 },
		{ price: walls.putWall, label: "Put wall", group: "Walls", kind: "support", size: 1 + (putInterest / maxInterest) * 3 },
		{ price: walls.maxPain, label: "Max pain", group: "Walls", color: "var(--chart-5)" },
	];
}

/** Draws yesterday's floor pivots, the main pivot first so the legend keys the group in its color. */
export function getPivotLevels(): CandlestickChartPriceLevel[] {
	return [
		{ price: pivots.pivot, label: "Pivot", group: "Pivots", color: "var(--chart-4)" },
		{ price: pivots.r2, label: "R2", group: "Pivots", color: "var(--muted-foreground)" },
		{ price: pivots.r1, label: "R1", group: "Pivots", color: "var(--muted-foreground)" },
		{ price: pivots.s1, label: "S1", group: "Pivots", color: "var(--muted-foreground)" },
		{ price: pivots.s2, label: "S2", group: "Pivots", color: "var(--muted-foreground)" },
	];
}

/** Open interest at one strike */
export interface StrikeInterest {
	/** Strike price */
	strike: number;
	/** Open call contracts */
	calls: number;
	/** Open put contracts */
	puts: number;
}

/** One order the bot filled */
export interface Trade {
	/** Index of the candle it filled on */
	index: number;
	/** Candle time */
	time: CandlestickChartCandle["time"];
	/** Buy to open or sell to close */
	side: "buy" | "sell";
	/** Fill price */
	price: number;
	/** Why the bot traded */
	reason: string;
	/** Profit or loss of the round trip, on sells only */
	pnl?: number;
}
