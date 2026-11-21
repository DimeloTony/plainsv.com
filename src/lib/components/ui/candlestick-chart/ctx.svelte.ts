import { setContext, getContext } from "svelte";
import { getNiceTicks } from "#lib/components/ui/chart/utils.js";
import { getBollinger, getEma, getSma, getVwap } from "./indicators.js";
import { snapPrice } from "./positions.js";
import { formatFullTime, getMedianGap, getTimeTicks, getZonedTime, isInWindow, isIntraday, parseClock, toTimestamp } from "./time.js";
import type { IndicatorSeries } from "./indicators.js";
import type { Candle, CandleMarker, Indicator, IndicatorValue, InfoProps, LegendProps, PositionChange, PriceLevel, Props, TimeHighlight, TooltipProps, TradePosition, TradingSession } from "./index.js";

const CONTEXT_ID = "candlestick-chart-context";
// Space in pixels between the plot and its labels, and around a tag's text.
const TICK_PADDING = 8;
const TAG_PADDING = 5;
// Fewest candles a zoom shows, so candles never grow past readable.
const MIN_VISIBLE = 10;
// Least and most the price axis stretches; above 1 the candles grow taller.
const MIN_PRICE_STRETCH = 0.1;
const MAX_PRICE_STRETCH = 20;
// Farthest the prices move up or down, as a share of the price pane, so some candles always stay in reach.
const MAX_PRICE_OFFSET = 0.9;
// Share of the view that can be empty space past the latest candle, so panning can look ahead of the last candle.
const MAX_FUTURE_SHARE = 0.8;
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
// Marker shape size as a share of the axis text, the space between a marker and its candle or the marker stacked next to it, and the color of markers without a kind.
const MARKER_SHARE = 0.9;
export const MARKER_GAP = 4;
const MARKER_COLOR = "var(--chart-1)";
// Pixels a level band grows for each step of `size` past 1, so `size: 2` is 6px tall and `size: 4` is 18px.
const BAND_STEP = 6;
const priceFormat = new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const compactFormat = new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 });

class UseCompCtx {
	/** Candles in time order */
	data: Candle[] = $state([]);
	/** Horizontal price lines */
	levels: PriceLevel[] = $state([]);
	/** Custom level content */
	level?: Props["level"] = $state();
	/** Indicator settings */
	indicators: Indicator[] = $state([]);
	/** Marks pinned to candles */
	markers: CandleMarker[] = $state([]);
	/** Custom marker content */
	marker?: Props["marker"] = $state();
	/** Trades with profit and risk zones */
	positions: TradePosition[] = $state([]);
	/** Called once a target or stop change is let go */
	onPositionsChange?: Props["onPositionsChange"];
	/** Called when a position's cancel is confirmed */
	onPositionCancel?: Props["onPositionCancel"];
	/** Called when a draft position's check mark is pressed */
	onPositionConfirm?: Props["onPositionConfirm"];
	/** Whether a cancel waits for the user to confirm */
	confirmCancel = $state(true);
	/** `id` of the position whose cancel button shows a check mark, waiting for a second press to confirm */
	armedCancelId: string | null = $state(null);
	/** Smallest price move for a target or stop */
	priceStep = $state(0.01);
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
	/** Names of the level and marker groups hidden with the legend */
	hiddenGroups: string[] = $state([]);
	/** Body style */
	variant: NonNullable<Props["variant"]> = $state("solid");
	/** Custom price format */
	formatPrice?: Props["formatPrice"] = $state();
	/** Custom time format */
	formatTime?: Props["formatTime"] = $state();
	/** Custom volume format */
	formatVolume?: Props["formatVolume"] = $state();
	/** Settings of the `CandlestickChartTooltip` part; null while it is left out */
	tooltipPart: TooltipProps | null = $state.raw(null);
	/** Settings of the `CandlestickChartInfo` part; null while it is left out */
	infoPart: InfoProps | null = $state.raw(null);
	/** Settings of the `CandlestickChartLegend` part; null while it is left out */
	legendPart: LegendProps | null = $state.raw(null);
	/** Called with the visible range */
	onRangeChange?: Props["onRangeChange"];
	/** Called with the hidden indicator labels */
	onHiddenIndicatorsChange?: Props["onHiddenIndicatorsChange"];
	/** Called with the hidden group names */
	onHiddenGroupsChange?: Props["onHiddenGroupsChange"];
	/** Plot width in pixels */
	width = $state(0);
	/** Plot height in pixels */
	height = $state(0);
	/** Axis text size in pixels, read from CSS */
	fontSize = $state(12);
	/** Height in pixels of the candle info, so an overlay legend sits under it; 0 while it is off */
	infoHeight = $state(0);
	/** Index of the hovered or focused candle; -1 while none is */
	activeIndex = $state(-1);
	/** Pointer position in plot pixels; null while the keyboard drives the tooltip */
	pointer: { x: number; y: number } | null = $state(null);
	/** Whether a drag or pinch is moving the chart */
	isDragging = $state(false);
	/** Target or stop price while it is dragged, shown before it is let go and reported */
	positionDraft: { id: string; field: PositionChange["field"]; price: number } | null = $state(null);
	/** How much a drag on the price axis stretches prices around the middle of the fitted range; 1 fits the candles on screen */
	priceStretch = $state(1);
	/** How far a vertical drag moved the prices, as a share of the price pane; positive moves the candles down; 0 centers them */
	priceOffset = $state(0);

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
	/** Typical time between candles, used to extend the time axis past the latest candle */
	interval = $derived(getMedianGap(this.times));
	/** Every indicator computed over all the candles */
	series: IndicatorSeries[] = $derived(this.indicators.map((indicator, position) => this.buildSeries(indicator, position)));
	/** Indicators still shown */
	visibleSeries = $derived(this.series.filter((item) => !this.hidden.includes(item.label)));
	/** Every level and marker group in the order it first appears, keyed in the legend by its first item's color; level groups get a line key and marker groups a dot */
	groups = $derived.by(() => {
		const result = new Map<string, { name: string; color: string; type: "level" | "marker" }>();
		for (const level of this.levels) if (level.group && !result.has(level.group)) result.set(level.group, { name: level.group, color: this.levelColor(level), type: "level" });
		for (const marker of this.markers) if (marker.group && !result.has(marker.group)) result.set(marker.group, { name: marker.group, color: this.markerColor(marker), type: "marker" });
		return [...result.values()];
	});
	/** Every position on a candle, with the dragged price applied, its zone edges as candle indexes, and its entry, target, and stop lines */
	placedPositions = $derived.by(() =>
		this.positions.flatMap((position) => {
			const stage = this.getPositionStage(position);
			// Draft and pending trades have not filled, so they wait at the latest candle whatever their time.
			const isWaiting = stage === "draft" || stage === "pending";
			const start = isWaiting ? this.data.length - 1 : this.findPositionCandle(position.time);
			// If there are no candles to place it on: skip it.
			if (start < 0) return [];
			const end = stage === "closed" ? this.findPositionCandle(position.exitTime ?? this.times[this.times.length - 1]) : null;
			const draft = this.positionDraft?.id === position.id ? this.positionDraft : null;
			// A dragged draft entry pushes the target and stop along, so they stay on their side of it.
			const entry = draft?.field === "entry" ? draft.price : position.entry;
			const moved = { side: position.side, entry };
			const target = draft?.field === "target" ? draft.price : position.target === undefined ? undefined : draft?.field === "entry" ? this.clampPositionPrice(moved, "target", position.target) : position.target;
			const stop = draft?.field === "stop" ? draft.price : position.stop === undefined ? undefined : draft?.field === "entry" ? this.clampPositionPrice(moved, "stop", position.stop) : position.stop;
			// Profit zones use the rising color and risk zones the falling color, whichever way the trade points.
			const lines: { field: PositionChange["field"]; price: number; color: string }[] = [{ field: "entry", price: entry, color: FALLBACK_COLOR }];
			if (target !== undefined) lines.push({ field: "target", price: target, color: UP_COLOR });
			if (stop !== undefined) lines.push({ field: "stop", price: stop, color: DOWN_COLOR });
			const isEditable = (position.editable ?? true) && (stage === "draft" || stage === "open");
			return [{ position, stage, isWaiting, start, end, entry, target, stop, lines, isEditable, name: position.label ?? (position.side === "long" ? "Long" : "Short") }];
		}),
	);
	/** Levels outside the hidden groups */
	shownLevels = $derived(this.levels.filter((level) => !level.group || !this.hiddenGroups.includes(level.group)));
	/** Candle span of each shown level, found once per data or level change rather than on every pan and zoom frame */
	levelSpans = $derived(this.shownLevels.map((level) => this.getLevelSpan(level)));
	/** Markers outside the hidden groups */
	shownMarkers = $derived(this.markers.filter((marker) => !marker.group || !this.hiddenGroups.includes(marker.group)));
	/** Pixels above the plot; leaves room for half of the top price label */
	marginTop = $derived(Math.ceil(this.fontSize / 2) + 4);
	/** Pixels left of the plot */
	marginLeft = 0;
	/** Pixels right of the plot for the price axis, sized for the widest price in the data and every level, so zooming and hiding groups never shift it */
	marginRight = $derived(this.measureText([...this.data.flatMap((candle) => [candle.high, candle.low]), ...this.levels.map((level) => level.price), ...this.positions.flatMap((position) => [position.entry, position.target ?? 0, position.stop ?? 0]), 0].map((price) => `▲ ${this.formatPriceValue(price)}`)) + TICK_PADDING * 2 + this.fontSize / 2);
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
	/** Every marker on its candle, with its look and its distance from the candle when markers stack */
	placedMarkers = $derived.by(() => {
		const stacks = new Map<string, number>();
		return this.shownMarkers.flatMap((marker, position) => {
			const index = this.findCandle(marker.time);
			// If the marker falls outside the candles: skip it.
			if (index < 0) return [];
			const kind = marker.kind ?? "default";
			const side = marker.position ?? (marker.price !== undefined ? "price" : kind === "buy" ? "below" : "above");
			const shape = marker.shape ?? (kind === "buy" ? "arrowUp" : kind === "sell" ? "arrowDown" : "circle");
			const size = Math.round(this.fontSize * MARKER_SHARE * (marker.size ?? 1));
			const height = size + (marker.text ? this.tagHeight + MARKER_GAP : 0);
			// Markers on the same side of a candle stack outward in the order given; price markers sit at their price.
			const key = `${index}:${side}`;
			const offset = side === "price" ? 0 : (stacks.get(key) ?? 0);
			if (side !== "price") stacks.set(key, offset + height + MARKER_GAP);
			return [{ marker, position, index, side, shape, size, height, offset, color: this.markerColor(marker), name: this.markerName(marker) }];
		});
	});
	/** Placed markers by candle index */
	markersByIndex = $derived.by(() => {
		const groups = new Map<number, typeof this.placedMarkers>();
		for (const item of this.placedMarkers) groups.set(item.index, [...(groups.get(item.index) ?? []), item]);
		return groups;
	});
	/** Pixels the stacked markers on screen need above the highs and below the lows */
	markerRoom = $derived.by(() => {
		const room = { above: 0, below: 0 };
		const first = this.visibleIndexes[0] ?? 0;
		const last = this.visibleIndexes.at(-1) ?? -1;
		for (const item of this.placedMarkers) {
			// If the marker sits at a price or on a candle off screen: it needs no room.
			if (item.side === "price" || item.index < first || item.index > last) continue;
			room[item.side] = Math.max(room[item.side], item.offset + item.height + MARKER_GAP);
		}
		return room;
	});
	/** Lowest and highest price on screen, padded so wicks never touch the edges and markers fit, then stretched by `priceStretch` and moved by `priceOffset`; levels do not stretch it */
	priceDomain = $derived.by(() => {
		const min = this.visiblePrices.length ? this.toScale(Math.min(...this.visiblePrices)) : 0;
		const max = this.visiblePrices.length ? this.toScale(Math.max(...this.visiblePrices)) : 1;
		// Pad in scale units, so a log axis pads by the same share at both ends.
		const padding = (max - min) * 0.06 || Math.abs(max) * 0.01 || 1;
		// Add the marker room in pixels, keeping at least 40% of the pane for the candles.
		const inner = Math.max(this.priceHeight * 0.4, this.priceHeight - this.markerRoom.above - this.markerRoom.below);
		const unitsPerPixel = (max - min + padding * 2) / (inner || 1);
		const low = min - padding - this.markerRoom.below * unitsPerPixel;
		const high = max + padding + this.markerRoom.above * unitsPerPixel;
		// Stretch around the middle and move by the offset in scale units, so the fitted range keeps following pans and live data.
		const half = (high - low) / 2 / this.priceStretch;
		const middle = (low + high) / 2 + this.priceOffset * half * 2;
		return [this.fromScale(middle - half), this.fromScale(middle + half)];
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
	/** Every level, position line, and the last price, placed on the price axis; tags that would overlap stack apart while their lines stay at their prices */
	levelTags = $derived.by(() => {
		const [min, max] = this.priceDomain;
		const last = this.data.at(-1);
		// The latest close joins the levels in its direction's color, so live updates show where price is now.
		const lastLevel: PriceLevel[] = this.lastPrice && last ? [{ price: last.close, kind: last.close >= last.open ? "support" : "resistance" }] : [];
		// Open position lines only get tags here; the positions part draws their lines across their zones, and closed positions keep just their zones and lines.
		const positionLevels: PriceLevel[] = this.placedPositions.flatMap((item) => (item.end === null ? item.lines.map((line) => ({ price: line.price, color: line.color })) : []));
		// Ended levels are history, so only levels still running get a tag, unless they turn it off.
		const runningLevels = this.shownLevels.filter((level, position) => level.tag !== false && this.levelSpans[position].end === null);
		const all = [...runningLevels, ...positionLevels, ...lastLevel];
		const tags = all.map((level, position) => {
			// Levels off screen pin to the nearest edge with an arrow toward them.
			const placement = level.price > max ? "above" : level.price < min ? "below" : "inside";
			const lineY = placement === "above" ? this.marginTop + this.tagHeight / 2 : placement === "below" ? this.marginTop + this.priceHeight - this.tagHeight / 2 : this.priceToY(level.price);
			const text = `${placement === "above" ? "▲ " : placement === "below" ? "▼ " : ""}${this.formatPriceValue(level.price)}`;
			return { ...level, position, placement, lineY, tagY: lineY, text, color: this.levelColor(level), isPosition: position >= runningLevels.length && position < runningLevels.length + positionLevels.length, isLast: lastLevel.length > 0 && position === all.length - 1 };
		});
		// Walk the tags from top to bottom and push each one below the tag above it when they would overlap.
		const sorted = tags.toSorted((a, b) => a.lineY - b.lineY);
		for (const [index, tag] of sorted.entries()) {
			const above = sorted[index - 1];
			if (above && tag.tagY - above.tagY < this.tagHeight) tag.tagY = above.tagY + this.tagHeight;
		}
		return tags;
	});
	/** User levels on screen with their line from the left edge of the `start` candle, or the plot, to the right edge of the `end` candle, or the plot */
	levelLines = $derived.by(() => {
		const [min, max] = this.priceDomain;
		const plotRight = this.marginLeft + this.plotWidth;
		return this.shownLevels.flatMap((level, position) => {
			// If the price is off screen: only its tag shows, pinned to the edge.
			if (level.price > max || level.price < min) return [];
			const span = this.levelSpans[position];
			const left = span.start === null ? this.marginLeft : this.x(span.start) - this.spacing / 2;
			const right = span.end === null ? plotRight : this.x(span.end) + this.spacing / 2;
			// If the span is panned off screen: skip it.
			if (right <= this.marginLeft || left >= plotRight) return [];
			return [{ level, position, color: this.levelColor(level), lineY: this.priceToY(level.price), left, right, bandHeight: this.levelBandHeight(level.size) }];
		});
	});
	/** Right edge in pixels of the latest candle, where open positions end, so they stop at the current candle instead of running into the empty time ahead */
	latestCandleRight = $derived(this.x(this.data.length - 1) + this.spacing / 2);
	/** Heights of the tags on the price axis: the crosshair's, the last price's, and every level's */
	priceTagYs = $derived([...(this.timeTag ? [this.crosshairY] : []), ...this.levelTags.map((tag) => tag.tagY)]);
	/** Time ticks on calendar boundaries, spaced so labels never overlap */
	timeTicks = $derived.by(() => {
		const minGap = this.measureText([this.intraday ? "00:00" : "Sep 30"]) + TIME_LABEL_GAP;
		let lastX = -Infinity;
		// Past the latest candle, the axis continues at the typical candle interval.
		const last = this.times.length - 1;
		const end = Math.max(last + 1, Math.ceil(this.view[1]));
		const futureTimes = this.interval > 0 && last >= 0 ? Array.from({ length: end - last - 1 }, (_, offset) => this.times[last] + (offset + 1) * this.interval) : [];
		const times = [...this.times, ...futureTimes];
		const zoned = [...this.zoned, ...futureTimes.map((time) => getZonedTime(time, this.zone))];
		const first = Math.max(0, Math.floor(this.view[0]));
		const indexes = Array.from({ length: Math.max(0, Math.min(times.length, end) - first) }, (_, offset) => first + offset);
		return getTimeTicks(times, zoned, indexes, this.plotWidth, minGap, this.zone).filter(({ index }) => {
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

	/** Index of the candle whose period contains a time: the last one that starts at or before it, or -1 when none does. */
	findCandle(time: Date | number | string) {
		const target = toTimestamp(time);
		const last = this.times.length - 1;
		let low = 0;
		let high = last;
		let found = -1;
		// Binary search, since candles are in time order.
		while (low <= high) {
			const middle = (low + high) >> 1;
			if (this.times[middle] <= target) {
				found = middle;
				low = middle + 1;
			} else high = middle - 1;
		}
		// If the time is past the last candle's period, such as a signal for a candle that has not opened: there is no candle.
		if (found === last && last > 0 && target >= this.times[last] * 2 - this.times[last - 1]) return -1;
		return found;
	}

	/** Index of the candle a position starts or ends on; times before the data use the first candle and times past it the latest, so a position never vanishes; -1 without candles. */
	findPositionCandle(time: Date | number | string) {
		const index = this.findCandle(time);
		// If a candle holds the time, or there are no candles: use that answer.
		if (index >= 0 || !this.data.length) return index;
		return toTimestamp(time) < this.times[0] ? 0 : this.data.length - 1;
	}

	/** Stage of a position: its own, else `closed` with an exit time and `open` without one. */
	getPositionStage(position: TradePosition) {
		return position.stage ?? (position.exitTime === undefined ? "open" : "closed");
	}

	/** Snaps a price to `priceStep`; an entry stays above zero, and a target or stop stays at least one step on its side of the entry, so a target never turns into a loss. */
	clampPositionPrice(position: Pick<TradePosition, "side" | "entry">, field: PositionChange["field"], price: number) {
		const step = this.priceStep > 0 ? this.priceStep : 0.01;
		const round = (value: number) => snapPrice(value, step);
		// If the entry moves, as on a draft: it only snaps and stays above zero.
		if (field === "entry") return Math.max(step, round(price));
		// A long's target and a short's stop sit above the entry; the other two sit below it, and above zero.
		const isAbove = (field === "target") === (position.side === "long");
		return isAbove ? Math.max(round(position.entry + step), round(price)) : Math.max(step, Math.min(round(position.entry - step), round(price)));
	}

	/** Shows a target or stop at a new price while it is dragged, without reporting it yet. */
	previewPosition(id: string, field: PositionChange["field"], price: number) {
		const position = this.positions.find((item) => item.id === id);
		// If the position is gone, such as removed by the bot mid-drag: drop the drag.
		if (!position) return void (this.positionDraft = null);
		this.positionDraft = { id, field, price: this.clampPositionPrice(position, field, price) };
	}

	/** Saves the previewed price into `positions` and reports it, unless it did not change. */
	commitPosition() {
		const draft = this.positionDraft;
		this.positionDraft = null;
		const current = this.positions.find((item) => item.id === draft?.id);
		// If nothing was dragged or the position is gone: there is nothing to save.
		if (!draft || !current) return;
		const previous = current[draft.field];
		// If the line ended where it started: report nothing.
		if (previous === undefined || previous === draft.price) return;
		// A moved draft entry also saves the target and stop it pushed along.
		const moved = { side: current.side, entry: draft.price };
		const position = draft.field === "entry" ? { ...current, entry: draft.price, target: current.target === undefined ? undefined : this.clampPositionPrice(moved, "target", current.target), stop: current.stop === undefined ? undefined : this.clampPositionPrice(moved, "stop", current.stop) } : { ...current, [draft.field]: draft.price };
		this.positions = this.positions.map((item) => (item.id === draft.id ? position : item));
		this.onPositionsChange?.(this.positions, { id: draft.id, field: draft.field, price: draft.price, previous, position });
	}

	/** Drops a drag and puts the line back. */
	discardPositionDraft() {
		this.positionDraft = null;
	}

	/** Presses a cancel button: the first press arms it into a check mark, and a press on the check mark confirms; with `confirmCancel` off, one press cancels. */
	requestCancelPosition(id: string) {
		// If confirming is off, or this button is already armed: cancel now.
		if (!this.confirmCancel || this.armedCancelId === id) {
			this.armedCancelId = null;
			this.cancelPosition(id);
		} else this.armedCancelId = id;
	}

	/** Turns an armed check mark back into the cancel button. */
	disarmCancel() {
		this.armedCancelId = null;
	}

	/** Confirms a draft position by reporting it, leaving `positions` to the caller, who sets it pending once the order is sent. */
	confirmPosition(id: string) {
		const position = this.positions.find((item) => item.id === id);
		// If the position is gone or no longer a draft: there is nothing to confirm.
		if (!position || this.getPositionStage(position) !== "draft") return;
		if (this.positionDraft?.id === id) this.positionDraft = null;
		this.onPositionConfirm?.(position);
	}

	/** Asks to cancel a position: drops any drag on it and reports it, leaving `positions` to the caller, who removes or closes it once the order is gone. */
	cancelPosition(id: string) {
		const position = this.positions.find((item) => item.id === id);
		// If the position is gone already: there is nothing to cancel.
		if (!position) return;
		if (this.positionDraft?.id === id) this.positionDraft = null;
		this.onPositionCancel?.(position);
	}

	/** Moves a target or stop by whole price steps and reports it, for the keyboard. */
	nudgePosition(id: string, field: PositionChange["field"], steps: number) {
		const price = this.positions.find((item) => item.id === id)?.[field];
		// If the position has no such line: there is nothing to move.
		if (price === undefined) return;
		this.previewPosition(id, field, price + steps * this.priceStep);
		this.commitPosition();
	}

	/** Color of a marker: its own, else rising for buys, falling for sells, and `--chart-1` otherwise. */
	markerColor(marker: CandleMarker) {
		if (marker.color) return marker.color;
		if (marker.kind === "buy") return UP_COLOR;
		return marker.kind === "sell" ? DOWN_COLOR : MARKER_COLOR;
	}

	/** Name of a marker for the tooltip, table, and announcements. */
	markerName(marker: CandleMarker) {
		return marker.label ?? marker.text ?? (marker.kind === "buy" ? "Buy" : marker.kind === "sell" ? "Sell" : "Marker");
	}

	/** Markers placed on a candle. */
	getMarkers(index: number) {
		return this.markersByIndex.get(index) ?? [];
	}

	/** Pixel position of a volume in the volume pane. */
	volumeToY(volume: number) {
		return this.volumeTop + (1 - volume / this.maxVolume) * this.volumeHeight;
	}

	/** Candle indexes a level spans, `null` for an open start or end; an end past the latest candle stays open, so the level keeps running. */
	getLevelSpan(level: PriceLevel) {
		const start = level.start === undefined ? null : this.findPositionCandle(level.start);
		const isFuture = level.end !== undefined && this.findCandle(level.end) < 0 && this.times.length > 0 && toTimestamp(level.end) >= this.times[0];
		const end = level.end === undefined || isFuture ? null : this.findPositionCandle(level.end);
		return { start, end };
	}

	/** Height of a level's band: none for a plain line, then 6px per step of `size`, the same at any zoom. */
	levelBandHeight(size: number | undefined) {
		return (Math.max(1, size ?? 1) - 1) * BAND_STEP;
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

	/** Finds the candle under a pointer, or -1 outside the plot or past the latest candle. */
	indexAt(x: number) {
		// If the pointer is beside the plot, such as over the price axis: hover nothing.
		if (x < this.marginLeft || x > this.marginLeft + this.plotWidth || !this.visibleIndexes.length) return -1;
		const index = Math.floor(this.view[0] + (x - this.marginLeft) / (this.spacing || 1));
		// If the pointer is in the empty space past the latest candle: hover nothing.
		if (index >= this.data.length) return -1;
		return Math.min(this.visibleIndexes.at(-1) ?? 0, Math.max(this.visibleIndexes[0], index));
	}

	/** Shows `count` candles from `start`, clamped to the data plus some empty space past the latest candle, and reports the range. */
	setRange(start: number, count: number) {
		const total = this.data.length;
		// If there is no data: there is nothing to show.
		if (!total) return;
		const nextCount = Math.min(total, Math.max(Math.min(MIN_VISIBLE, total), count));
		// The view can run past the latest candle into empty space, but always keeps some candles in it.
		const nextStart = Math.min(total - nextCount * (1 - MAX_FUTURE_SHARE), Math.max(0, start));
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

	/** Stretches the price axis, clamped so candles never vanish or grow past reason. */
	setPriceStretch(stretch: number) {
		this.priceStretch = Math.min(MAX_PRICE_STRETCH, Math.max(MIN_PRICE_STRETCH, stretch));
	}

	/** Moves the prices up or down, as a share of the price pane, clamped so the candles never leave reach. */
	setPriceOffset(offset: number) {
		this.priceOffset = Math.min(MAX_PRICE_OFFSET, Math.max(-MAX_PRICE_OFFSET, offset));
	}

	/** Fits and centers the prices on the candles on screen again. */
	resetPriceScale() {
		this.priceStretch = 1;
		this.priceOffset = 0;
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

	/** Hides or shows a level and marker group and reports the change. */
	toggleGroup(name: string) {
		this.hiddenGroups = this.hiddenGroups.includes(name) ? this.hiddenGroups.filter((hiddenName) => hiddenName !== name) : [...this.hiddenGroups, name];
		this.onHiddenGroupsChange?.(this.hiddenGroups);
	}
}

export type CompCtxProps = Pick<InstanceType<typeof UseCompCtx>, "data" | "levels" | "level" | "indicators" | "markers" | "marker" | "positions" | "onPositionsChange" | "onPositionCancel" | "onPositionConfirm" | "confirmCancel" | "priceStep" | "sessions" | "highlights" | "timeZone" | "scale" | "grid" | "lastPrice" | "showVolume" | "range" | "hidden" | "hiddenGroups" | "variant" | "formatPrice" | "formatTime" | "formatVolume" | "onRangeChange" | "onHiddenIndicatorsChange" | "onHiddenGroupsChange">;

export const setCompCtx = (props: CompCtxProps) => setContext(CONTEXT_ID, new UseCompCtx(props));

export const useCompCtx = () => getContext<ReturnType<typeof setCompCtx>>(CONTEXT_ID);
