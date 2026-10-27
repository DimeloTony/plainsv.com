/** Upper and lower edges of a band around an indicator line */
export interface IndicatorBand {
	/** Standard deviations from the line */
	deviations: number;
	/** Upper edge per candle; `NaN` where it is not defined yet */
	upper: number[];
	/** Lower edge per candle; `NaN` where it is not defined yet */
	lower: number[];
}

/** An indicator computed over every candle, ready to draw */
export interface IndicatorSeries {
	/** Name in the legend and tooltip, and the key in `hiddenIndicators` */
	label: string;
	/** CSS color of the line and bands */
	color: string;
	/** Main line per candle; `NaN` where it is not defined yet */
	line: number[];
	/** Bands around the line, such as Bollinger or VWAP deviation bands */
	bands: IndicatorBand[];
	/** Candle indexes where the line restarts, such as each new VWAP day, so it draws no jump there */
	breaks: number[];
}

/** Price fields the volume-weighted average reads */
interface VwapCandle {
	/** Highest price */
	high: number;
	/** Lowest price */
	low: number;
	/** Last price */
	close: number;
	/** Traded volume; candles without it add no weight */
	volume?: number;
}

/** Simple moving average; the first `period - 1` values are `NaN`, since the window is not full yet. */
export function getSma(values: number[], period: number) {
	const result = values.map(() => NaN);
	let sum = 0;
	for (const [index, value] of values.entries()) {
		sum += value;
		// If the window is full: drop the value that left it.
		if (index >= period) sum -= values[index - period];
		if (index >= period - 1) result[index] = sum / period;
	}
	return result;
}

/** Exponential moving average, seeded with the simple average of the first window. */
export function getEma(values: number[], period: number) {
	const smoothing = 2 / (period + 1);
	const seed = getSma(values, period);
	const result = values.map(() => NaN);
	for (let index = period - 1; index < values.length; index++) {
		const previous = result[index - 1];
		result[index] = Number.isNaN(previous) ? seed[index] : values[index] * smoothing + previous * (1 - smoothing);
	}
	return result;
}

/** Bollinger bands: a simple moving average with bands `deviations` population standard deviations away. */
export function getBollinger(values: number[], period: number, deviations: number) {
	const middle = getSma(values, period);
	const band: IndicatorBand = { deviations, upper: values.map(() => NaN), lower: values.map(() => NaN) };
	for (let index = period - 1; index < values.length; index++) {
		const window = values.slice(index - period + 1, index + 1);
		const spread = Math.sqrt(window.reduce((sum, value) => sum + (value - middle[index]) ** 2, 0) / period);
		band.upper[index] = middle[index] + deviations * spread;
		band.lower[index] = middle[index] - deviations * spread;
	}
	return { middle, band };
}

/** Volume-weighted average of the typical price `(high + low + close) / 3`, with volume-weighted deviation bands; it restarts whenever `sessionKeys` changes, such as at each day, and skips candles where `include` is false. */
export function getVwap(candles: VwapCandle[], sessionKeys: (number | string)[], bandDeviations: number[], include?: boolean[]) {
	const line = candles.map(() => NaN);
	const bands: IndicatorBand[] = bandDeviations.map((deviations) => ({ deviations, upper: candles.map(() => NaN), lower: candles.map(() => NaN) }));
	const sessionStarts: number[] = [];
	let session: number | string | undefined;
	let priceVolume = 0;
	let squaredPriceVolume = 0;
	let totalVolume = 0;
	for (const [index, candle] of candles.entries()) {
		// If the candle is left out, such as pre-market for a regular hours VWAP: it adds nothing and draws no line.
		if (include && !include[index]) continue;
		// If a new session started: restart the running sums.
		if (sessionKeys[index] !== session) {
			if (session !== undefined) sessionStarts.push(index);
			session = sessionKeys[index];
			priceVolume = 0;
			squaredPriceVolume = 0;
			totalVolume = 0;
		}
		const typicalPrice = (candle.high + candle.low + candle.close) / 3;
		const volume = Math.max(0, candle.volume ?? 0);
		priceVolume += typicalPrice * volume;
		squaredPriceVolume += typicalPrice * typicalPrice * volume;
		totalVolume += volume;
		// If no volume has traded this session: there is no average yet.
		if (!totalVolume) continue;
		line[index] = priceVolume / totalVolume;
		const spread = Math.sqrt(Math.max(0, squaredPriceVolume / totalVolume - line[index] ** 2));
		for (const band of bands) {
			band.upper[index] = line[index] + band.deviations * spread;
			band.lower[index] = line[index] - band.deviations * spread;
		}
	}
	return { line, bands, sessionStarts };
}
