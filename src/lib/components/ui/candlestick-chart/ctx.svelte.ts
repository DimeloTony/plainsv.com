import { setContext, getContext } from "svelte";
import { getNiceTicks } from "#lib/components/ui/chart/utils.js";
import { getBollinger, getEma, getSma, getVwap } from "./indicators.js";
import { formatFullTime, getTimeTicks, getZonedTime, isInWindow, isIntraday, parseClock, toTimestamp } from "./time.js";
import type { IndicatorSeries } from "./indicators.js";
import type { Candle, Indicator, IndicatorValue, PriceLevel, Props, TimeHighlight, TradingSession } from "./index.js";

const CONTEXT_ID = "candlestick-chart-context";
// Space in pixels between the plot and its labels, and around a tag's text.
const TICK_PADDING = 8;
const TAG_PADDING = 5;
// Fewest candles a zoom shows, so candles never grow past readable.
const MIN_VISIBLE = 10;
// Candle spacing in pixels of the default view.
const DEFAULT_SPACING = 8;
// Space between the price and volume panes, and the volume pane's share of the height.
const PANE_GAP = 8;
const VOLUME_SHARE = 0.2;
// Pixels each price tick needs, and the space each time label needs beyond its text.
const PIXELS_PER_PRICE_TICK = 48;
const TIME_LABEL_GAP = 24;
// Widest a candle body gets, and its share of the candle spacing.
const MAX_BODY_WIDTH = 12;
const BODY_SHARE = 0.7;
// Indicator colors in order; they skip the rising and falling hues, and later ones fall back to a neutral.
const INDICATOR_COLORS = ["var(--chart-1)", "var(--chart-4)", "var(--chart-5)"];
const FALLBACK_COLOR = "var(--muted-foreground)";
// Rising and falling colors; users override them with `--candlestick-chart-up` and `--candlestick-chart-down`.
export const UP_COLOR = "var(--candlestick-chart-up, var(--chart-3))";
export const DOWN_COLOR = "var(--candlestick-chart-down, var(--destructive))";
const priceFormat = new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const compactFormat = new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 });

class UseCompCtx {
	/** Candles in time order */
	data: Candle[] = $state([]);
	/** Horizontal price lines */
	levels: PriceLevel[] = $state([]);
	/** Indicator settings */
	indicators: Indicator[] = $state([]);
	/** Daily clock windows shaded behind the candles */
	sessions: TradingSession[] = $state([]);
	/** Fixed time ranges shaded behind the candles */
	highlights: TimeHighlight[] = $state([]);
	/** IANA time zone; empty uses the viewer's zone */
	timeZone = $state("");
	/** Price scale */
	scale: NonNullable<Props["scale"]> = $state("linear");
	/** Whether the gridlines show */
	grid = $state(true);
	/** Whether the latest close gets a line and tag */
	lastPrice = $state(true);
	/** Whether the volume pane shows */
	showVolume = $state(true);
	/** Visible range set by zooming and panning; null shows the latest candles that fit */
	range: [number, number] | null = $state(null);
	/** Labels of the indicators hidden with the legend */
	hidden: string[] = $state([]);
	/** Body style */
	variant: NonNullable<Props["variant"]> = $state("solid");
	/** Custom price format */
	formatPrice?: Props["formatPrice"] = $state();
	/** Custom time format */
	formatTime?: Props["formatTime"] = $state();
	/** Custom volume format */
	formatVolume?: Props["formatVolume"] = $state();
	/** Custom tooltip content */
	tooltip?: Props["tooltip"] = $state();
	/** Called with the visible range */
	onRangeChange?: Props["onRangeChange"];
	/** Called with the hidden indicator labels */
	onHiddenIndicatorsChange?: Props["onHiddenIndicatorsChange"];
	/** Plot width in pixels */
	width = $state(0);
	/** Plot height in pixels */
	height = $state(0);
	/** Axis text size in pixels, read from CSS */
	fontSize = $state(12);
	/** Index of the hovered or focused candle; -1 while none is */
	activeIndex = $state(-1);
	/** Pointer position in plot pixels; null while the keyboard drives the tooltip */
	pointer: { x: number; y: number } | null = $state(null);
	/** Whether a drag or pinch is moving the chart */
	isDragging = $state(false);

	/** Timestamp of every candle */
	times = $derived(this.data.map((candle) => toTimestamp(candle.time)));
	/** Time zone for `Intl`, or undefined for the viewer's zone */
	zone = $derived(this.timeZone || undefined);
	/** Calendar fields of every candle in the time zone */
	zoned = $derived(this.times.map((time) => getZonedTime(time, this.zone)));
	/** Session windows in minutes since midnight */
	sessionWindows = $derived(this.sessions.map((session) => [parseClock(session.start), parseClock(session.end)]));
	/** Index of the session each candle falls in; -1 for regular hours */
	candleSessions = $derived(this.zoned.map((zoned) => this.sessionWindows.findIndex(([start, end]) => isInWindow(zoned.minuteOfDay, start, end))));
	/** Index of the highlight each candle falls in; -1 when none */
	candleHighlights = $derived.by(() => {
		const ranges = this.highlights.map((highlight) => [toTimestamp(highlight.start), toTimestamp(highlight.end)]);
		return this.times.map((time) => ranges.findIndex(([start, end]) => time >= start && time < end));
	});
	/** Close of every candle */
	closes = $derived(this.data.map((candle) => candle.close));
	/** Whether candles are less than a day apart */
	intraday = $derived(isIntraday(this.times));
	/** Every indicator computed over all the candles */
	series: IndicatorSeries[] = $derived(this.indicators.map((indicator, position) => this.buildSeries(indicator, position)));
	/** Indicators still shown */
	visibleSeries = $derived(this.series.filter((item) => !this.hidden.includes(item.label)));
	/** Pixels above the plot; leaves room for half of the top price label */
	marginTop = $derived(Math.ceil(this.fontSize / 2) + 4);
	/** Pixels left of the plot */
	marginLeft = 0;
	/** Pixels right of the plot for the price axis, sized for the widest price in the data so zooming never shifts it */
	marginRight = $derived(this.measureText([...this.data.flatMap((candle) => [candle.high, candle.low]), ...this.levels.map((level) => level.price), 0].map((price) => `▲ ${this.formatPriceValue(price)}`)) + TICK_PADDING * 2 + this.fontSize / 2);
	/** Height of the time axis under the plot */
	timeAxisHeight = $derived(Math.ceil(this.fontSize * 1.5) + TICK_PADDING);
	/** Width of the plot */
	plotWidth = $derived(Math.max(0, this.width - this.marginLeft - this.marginRight));
	/** Height of both panes together */
	panesHeight = $derived(Math.max(0, this.height - this.marginTop - this.timeAxisHeight));
	/** Height of the volume pane; 0 when it is hidden */
	volumeHeight = $derived(this.showVolume ? Math.round(this.panesHeight * VOLUME_SHARE) : 0);
	/** Height of the price pane */
	priceHeight = $derived(Math.max(0, this.panesHeight - this.volumeHeight - (this.showVolume ? PANE_GAP : 0)));
	/** Top of the volume pane */
	volumeTop = $derived(this.marginTop + this.priceHeight + PANE_GAP);
	/** Bottom of both panes, where the time axis starts */
	plotBottom = $derived(this.marginTop + this.panesHeight);
	/** Latest candles that fit at the default spacing */
	defaultRange: [number, number] = $derived.by(() => {
		const total = this.data.length;
		const count = Math.min(total, Math.max(MIN_VISIBLE, Math.floor(this.plotWidth / DEFAULT_SPACING)));
		return [total - count, total];
	});
	/** Visible range, as fractional candle indexes */
	view = $derived(this.range ?? this.defaultRange);
	/** Number of candles across the plot */
	visibleCount = $derived(Math.max(1, this.view[1] - this.view[0]));
	/** Pixels between candle centers */
	spacing = $derived(this.plotWidth / this.visibleCount);
	/** Width of a candle body */
	bodyWidth = $derived(Math.max(1, Math.min(MAX_BODY_WIDTH, this.spacing * BODY_SHARE)));
	/** Indexes of the candles at least partly on screen */
	visibleIndexes = $derived.by(() => {
		const first = Math.max(0, Math.floor(this.view[0]));
		const last = Math.min(this.data.length - 1, Math.ceil(this.view[1]) - 1);
		return Array.from({ length: Math.max(0, last - first + 1) }, (_, offset) => first + offset);
	});
	/** Every price on screen: candles and visible indicators */
	visiblePrices = $derived(this.visibleIndexes.flatMap((index) => [this.data[index].low, this.data[index].high, ...this.visibleSeries.flatMap((item) => [item.line[index], ...item.bands.flatMap((band) => [band.upper[index], band.lower[index]])])]).filter(Number.isFinite));
	/** Whether the price axis is logarithmic; it falls back to linear when a price on screen is zero or below */
	isLog = $derived(this.scale === "log" && this.visiblePrices.every((price) => price > 0));
	/** Lowest and highest price on screen, padded so wicks never touch the edges; levels do not stretch it */
	priceDomain = $derived.by(() => {
		const min = this.visiblePrices.length ? this.toScale(Math.min(...this.visiblePrices)) : 0;
		const max = this.visiblePrices.length ? this.toScale(Math.max(...this.visiblePrices)) : 1;
		// Pad in scale units, so a log axis pads by the same share at both ends.
		const padding = (max - min) * 0.06 || Math.abs(max) * 0.01 || 1;
		return [this.fromScale(min - padding), this.fromScale(max + padding)];
	});
	/** Price ticks inside the domain: round numbers, spaced evenly in log units on a log axis and rounded to 2 significant digits */
	priceTicks = $derived.by(() => {
		const [min, max] = this.priceDomain;
		const count = Math.max(2, Math.floor(this.priceHeight / PIXELS_PER_PRICE_TICK));
		const ticks = this.isLog ? [...new Set(getNiceTicks(Math.log(min), Math.log(max), count).map((tick) => Number(Math.exp(tick).toPrecision(2))))] : getNiceTicks(min, max, count);
		return ticks.filter((tick) => tick >= min && tick <= max);
	});
	/** Highest volume on screen */
	maxVolume = $derived(Math.max(1, ...this.visibleIndexes.map((index) => this.data[index].volume ?? 0)));
	/** Height of a tag on an axis */
	tagHeight = $derived(this.fontSize + TAG_PADDING);
	/** Height of the crosshair's horizontal line: the pointer inside the price pane, else the active candle's close */
	crosshairY = $derived.by(() => {
		const candle = this.data[this.activeIndex];
		if (this.pointer && this.pointer.y >= this.marginTop && this.pointer.y <= this.marginTop + this.priceHeight) return this.pointer.y;
		return candle ? this.priceToY(candle.close) : 0;
	});
	/** Time tag under the crosshair, kept inside the plot; null while no candle is active */
	timeTag = $derived.by(() => {
		// If no candle is active: there is no tag.
		if (!this.data[this.activeIndex]) return null;
		const text = this.formatCandleTime(this.activeIndex);
		const width = this.measureText([text]) + TAG_PADDING * 2;
		const x = Math.min(Math.max(this.x(this.activeIndex) - width / 2, this.marginLeft), this.marginLeft + this.plotWidth - width);
		return { text, x, width };
	});
	/** Every level and the last price, placed on the price axis; tags that would overlap stack apart while their lines stay at their prices */
	levelTags = $derived.by(() => {
		const [min, max] = this.priceDomain;
		const last = this.data.at(-1);
		// The latest close joins the levels in its direction's color, so live updates show where price is now.
		const lastLevel: PriceLevel[] = this.lastPrice && last ? [{ price: last.close, kind: last.close >= last.open ? "support" : "resistance" }] : [];
		const tags = [...this.levels, ...lastLevel].map((level, position) => {
			// Levels off screen pin to the nearest edge with an arrow toward them.
			const placement = level.price > max ? "above" : level.price < min ? "below" : "inside";
			const lineY = placement === "above" ? this.marginTop + this.tagHeight / 2 : placement === "below" ? this.marginTop + this.priceHeight - this.tagHeight / 2 : this.priceToY(level.price);
			const text = `${placement === "above" ? "▲ " : placement === "below" ? "▼ " : ""}${this.formatPriceValue(level.price)}`;
			return { ...level, position, placement, lineY, tagY: lineY, text, color: this.levelColor(level), isLast: position >= this.levels.length };
		});
		// Walk the tags from top to bottom and push each one below the tag above it when they would overlap.
		const sorted = tags.toSorted((a, b) => a.lineY - b.lineY);
		for (const [index, tag] of sorted.entries()) {
			const above = sorted[index - 1];
			if (above && tag.tagY - above.tagY < this.tagHeight) tag.tagY = above.tagY + this.tagHeight;
		}
		return tags;
	});
	/** Heights of the tags on the price axis: the crosshair's, the last price's, and every level's */
	priceTagYs = $derived([...(this.timeTag ? [this.crosshairY] : []), ...this.levelTags.map((tag) => tag.tagY)]);
	/** Time ticks on calendar boundaries, spaced so labels never overlap */
	timeTicks = $derived.by(() => {
		const minGap = this.measureText([this.intraday ? "00:00" : "Sep 30"]) + TIME_LABEL_GAP;
		let lastX = -Infinity;
		return getTimeTicks(this.times, this.zoned, this.visibleIndexes, this.plotWidth, minGap, this.zone).filter(({ index }) => {
			const x = this.x(index);
			// If the tick crowds the one before it: skip it.
			if (x - lastX < minGap) return false;
			lastX = x;
			return true;
		});
	});

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}
	}

	/** Computes one indicator over all the candles. */
	buildSeries(indicator: Indicator, position: number): IndicatorSeries {
		const color = indicator.color ?? INDICATOR_COLORS[position] ?? FALLBACK_COLOR;
		if (indicator.type === "bollinger") {
			const period = indicator.period ?? 20;
			const deviations = indicator.deviations ?? 2;
			const { middle, band } = getBollinger(this.closes, period, deviations);
			return { label: indicator.label ?? `BB ${period}, ${deviations}`, color, line: middle, bands: [band], breaks: [] };
		}
		if (indicator.type === "vwap") {
			// A daily reset follows the calendar date in the chart's time zone.
			const sessionKeys = indicator.reset === "none" ? this.times.map(() => 0) : this.zoned.map((zoned) => zoned.dayNumber);
			const include = indicator.regularHours ? this.candleSessions.map((session) => session < 0) : undefined;
			const { line, bands, sessionStarts } = getVwap(this.data, sessionKeys, indicator.bands ?? [], include);
			return { label: indicator.label ?? "VWAP", color, line, bands, breaks: sessionStarts };
		}
		const line = indicator.type === "sma" ? getSma(this.closes, indicator.period) : getEma(this.closes, indicator.period);
		return { label: indicator.label ?? `${indicator.type.toUpperCase()} ${indicator.period}`, color, line, bands: [], breaks: [] };
	}

	/** Estimates the pixel width of the longest text, from the axis font size. */
	measureText(texts: string[]) {
		return Math.ceil(Math.max(0, ...texts.map((text) => text.length)) * this.fontSize * 0.6);
	}

	/** Formats a price. */
	formatPriceValue(price: number) {
		if (Number.isNaN(price)) return "–";
		return this.formatPrice ? this.formatPrice(price) : priceFormat.format(price);
	}

	/** Formats a volume; compact unless `formatVolume` is set. */
	formatVolumeValue(volume: number | undefined) {
		if (volume === undefined || Number.isNaN(volume)) return "–";
		return this.formatVolume ? this.formatVolume(volume) : compactFormat.format(volume);
	}

	/** Formats a candle's time in full. */
	formatCandleTime(index: number) {
		const time = this.times[index];
		// If the candle does not exist: show nothing.
		if (time === undefined) return "";
		return this.formatTime ? this.formatTime(new Date(time), index) : formatFullTime(time, this.intraday, this.zone);
	}

	/** Pixel center of a candle. */
	x(index: number) {
		return this.marginLeft + (index - this.view[0] + 0.5) * this.spacing;
	}

	/** Converts a price to scale units: its logarithm on a log axis. */
	toScale(price: number) {
		return this.isLog ? Math.log(price) : price;
	}

	/** Converts scale units back to a price. */
	fromScale(value: number) {
		return this.isLog ? Math.exp(value) : value;
	}

	/** Pixel position of a price in the price pane. */
	priceToY(price: number) {
		const min = this.toScale(this.priceDomain[0]);
		const max = this.toScale(this.priceDomain[1]);
		return this.marginTop + (1 - (this.toScale(price) - min) / (max - min || 1)) * this.priceHeight;
	}

	/** Price at a pixel position in the price pane. */
	yToPrice(y: number) {
		const min = this.toScale(this.priceDomain[0]);
		const max = this.toScale(this.priceDomain[1]);
		return this.fromScale(min + (1 - (y - this.marginTop) / (this.priceHeight || 1)) * (max - min));
	}

	/** Label of the highlight or session a candle falls in, such as "Pre-market". */
	getSessionLabel(index: number) {
		const highlight = this.highlights[this.candleHighlights[index]];
		return highlight?.label ?? this.sessions[this.candleSessions[index]]?.label;
	}

	/** Pixel position of a volume in the volume pane. */
	volumeToY(volume: number) {
		return this.volumeTop + (1 - volume / this.maxVolume) * this.volumeHeight;
	}

	/** Color of a level: its own, else rising for support, falling for resistance, and neutral otherwise. */
	levelColor(level: PriceLevel) {
		if (level.color) return level.color;
		if (level.kind === "support") return UP_COLOR;
		return level.kind === "resistance" ? DOWN_COLOR : FALLBACK_COLOR;
	}

	/** Change from the previous close, or from the open on the first candle. */
	getChange(index: number) {
		const candle = this.data[index];
		const previous = this.data[index - 1]?.close ?? candle.open;
		const change = candle.close - previous;
		return { change, changePercent: previous ? (change / previous) * 100 : 0 };
	}

	/** Values of the visible indicators at a candle. */
	getIndicatorValues(index: number): IndicatorValue[] {
		return this.visibleSeries.map((item) => ({ label: item.label, color: item.color, value: item.line[index], formattedValue: this.formatPriceValue(item.line[index]) }));
	}

	/** Finds the candle under a pointer, or -1 outside the plot. */
	indexAt(x: number) {
		// If the pointer is beside the plot, such as over the price axis: hover nothing.
		if (x < this.marginLeft || x > this.marginLeft + this.plotWidth || !this.visibleIndexes.length) return -1;
		const index = Math.floor(this.view[0] + (x - this.marginLeft) / (this.spacing || 1));
		return Math.min(this.visibleIndexes.at(-1) ?? 0, Math.max(this.visibleIndexes[0], index));
	}

	/** Shows `count` candles from `start`, clamped to the data, and reports the range. */
	setRange(start: number, count: number) {
		const total = this.data.length;
		// If there is no data: there is nothing to show.
		if (!total) return;
		const nextCount = Math.min(total, Math.max(Math.min(MIN_VISIBLE, total), count));
		const nextStart = Math.min(total - nextCount, Math.max(0, start));
		this.range = [nextStart, nextStart + nextCount];
		this.onRangeChange?.(this.range);
	}

	/** Zooms by `factor` around a pixel, keeping the candle under it in place; below 1 zooms in. */
	zoom(factor: number, anchorX: number) {
		const share = Math.min(1, Math.max(0, (anchorX - this.marginLeft) / (this.plotWidth || 1)));
		const anchorIndex = this.view[0] + share * this.visibleCount;
		const count = this.visibleCount * factor;
		this.setRange(anchorIndex - share * count, count);
	}

	/** Pans by a number of candles; positive moves toward newer candles. */
	pan(candles: number) {
		this.setRange(this.view[0] + candles, this.visibleCount);
	}

	/** Shows the latest candles again. */
	resetRange() {
		this.range = null;
		this.onRangeChange?.(this.defaultRange);
	}

	/** Activates a candle from the keyboard, panning to keep it on screen. */
	moveActive(index: number) {
		const target = Math.min(this.data.length - 1, Math.max(0, index));
		this.pointer = null;
		this.activeIndex = target;
		// If the candle is off screen: pan just enough to show it.
		if (target < this.view[0]) this.setRange(target, this.visibleCount);
		else if (target + 1 > this.view[1]) this.setRange(target + 1 - this.visibleCount, this.visibleCount);
	}

	/** Hides or shows an indicator and reports the change. */
	toggleIndicator(label: string) {
		this.hidden = this.hidden.includes(label) ? this.hidden.filter((hiddenLabel) => hiddenLabel !== label) : [...this.hidden, label];
		this.onHiddenIndicatorsChange?.(this.hidden);
	}
}

export type CompCtxProps = Pick<InstanceType<typeof UseCompCtx>, "data" | "levels" | "indicators" | "sessions" | "highlights" | "timeZone" | "scale" | "grid" | "lastPrice" | "showVolume" | "range" | "hidden" | "variant" | "formatPrice" | "formatTime" | "formatVolume" | "tooltip" | "onRangeChange" | "onHiddenIndicatorsChange">;

export const setCompCtx = (props: CompCtxProps) => setContext(CONTEXT_ID, new UseCompCtx(props));

export const useCompCtx = () => getContext<ReturnType<typeof setCompCtx>>(CONTEXT_ID);
