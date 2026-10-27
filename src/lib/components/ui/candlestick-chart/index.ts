export { default as CandlestickChart } from "./_.svelte";
export { getSma, getEma, getBollinger, getVwap } from "./indicators.js";

/** One period of trading: its open, high, low, close, and volume */
export interface Candle {
	/** Start of the period, as a `Date`, a timestamp in milliseconds, or a date string */
	time: Date | number | string;
	/** First price */
	open: number;
	/** Highest price */
	high: number;
	/** Lowest price */
	low: number;
	/** Last price */
	close: number;
	/** Traded volume; the volume pane and VWAP need it */
	volume?: number;
}

/** Horizontal price line, such as a support or resistance level */
export interface PriceLevel {
	/** Price of the line */
	price: number;
	/** Name drawn above the line, such as "Support" */
	label?: string;
	/** `support` uses the rising color, `resistance` the falling color, and `default` a neutral one */
	kind?: "support" | "resistance" | "default";
	/** Any CSS color; overrides the `kind` color */
	color?: string;
}

/** Daily clock window shaded behind the candles, such as pre-market or after hours */
export interface TradingSession {
	/** Start time as `HH:mm` in `timeZone`, such as `04:00` */
	start: string;
	/** End time as `HH:mm` in `timeZone`, not included, such as `09:30`; an end before the start runs past midnight */
	end: string;
	/** Name on the shading and in the tooltip, such as "Pre-market" */
	label: string;
	/** Any CSS color for the shading; defaults to `--muted-foreground` */
	color?: string;
}

/** Fixed time range shaded behind the candles, such as an earnings release */
export interface TimeHighlight {
	/** Start of the range, as a `Date`, a timestamp in milliseconds, or a date string */
	start: Date | number | string;
	/** End of the range, not included */
	end: Date | number | string;
	/** Name on the shading and in the tooltip */
	label?: string;
	/** Any CSS color for the shading; defaults to `--chart-4` */
	color?: string;
}

/** Simple or exponential moving average of the closes */
export interface MovingAverageIndicator {
	/** `sma` weighs every close in the window equally; `ema` weighs recent closes more */
	type: "sma" | "ema";
	/** Number of candles in the window, such as 20 */
	period: number;
	/** Name in the legend and tooltip; defaults to "SMA 20" or "EMA 20"; also the key in `hiddenIndicators` */
	label?: string;
	/** Any CSS color; defaults to the next indicator color */
	color?: string;
}

/** Bollinger bands around a simple moving average */
export interface BollingerIndicator {
	/** Bollinger bands */
	type: "bollinger";
	/** Number of candles in the window; defaults to 20 */
	period?: number;
	/** Standard deviations from the average to each band; defaults to 2 */
	deviations?: number;
	/** Name in the legend and tooltip; defaults to "BB 20, 2"; also the key in `hiddenIndicators` */
	label?: string;
	/** Any CSS color; defaults to the next indicator color */
	color?: string;
}

/** Volume-weighted average price */
export interface VwapIndicator {
	/** Volume-weighted average price */
	type: "vwap";
	/** `day` restarts the average at each local day; `none` runs it across all the data; defaults to `day` */
	reset?: "day" | "none";
	/** Standard deviation bands to draw, such as `[1, 2]`; none by default */
	bands?: number[];
	/** Skips candles inside `sessions`, such as pre-market and after hours, so the average covers regular hours only */
	regularHours?: boolean;
	/** Name in the legend and tooltip; defaults to "VWAP"; also the key in `hiddenIndicators` */
	label?: string;
	/** Any CSS color; defaults to the next indicator color */
	color?: string;
}

/** Overlay computed from the candles */
export type Indicator = MovingAverageIndicator | BollingerIndicator | VwapIndicator;

/** One indicator value a custom `tooltip` snippet receives */
export interface IndicatorValue {
	/** Indicator label */
	label: string;
	/** Indicator color */
	color: string;
	/** Raw value; `NaN` before the indicator has enough candles */
	value: number;
	/** Value after `formatPrice` */
	formattedValue: string;
}

/** Values a custom `tooltip` snippet receives */
export interface TooltipSnippetProps {
	/** Index of the hovered candle in `data` */
	index: number;
	/** Hovered candle */
	candle: Candle;
	/** Time after `formatTime` */
	label: string;
	/** Label of the session or highlight the candle falls in, such as "Pre-market" */
	session?: string;
	/** Change from the previous close, or from the open on the first candle */
	change: number;
	/** Change in percent */
	changePercent: number;
	/** Value of every visible indicator at this candle */
	indicators: IndicatorValue[];
}

/** Candlestick chart with sessions, a volume pane, indicators, price levels, live updates, zoom, and pan */
export interface Props extends CompProps<"figure"> {
	/** Candles in time order, oldest first */
	data: Candle[];
	/** Horizontal price lines, such as support and resistance */
	levels?: PriceLevel[];
	/** Overlays computed from the candles: moving averages, Bollinger bands, and VWAP */
	indicators?: Indicator[];
	/** Daily clock windows shaded behind the candles, such as pre-market and after hours */
	sessions?: TradingSession[];
	/** Fixed time ranges shaded behind the candles, such as earnings */
	highlights?: TimeHighlight[];
	/** IANA time zone for sessions, day resets, the time axis, and the tooltip, such as `America/New_York`; the viewer's zone when omitted */
	timeZone?: string;
	/** Shows the volume pane; on when any candle has volume */
	volume?: boolean;
	/** Visible candles as `[start, end)` indexes, fractional while panning; the latest candles that fit when omitted; supports `bind:range` */
	range?: [number, number];
	/** Called with the visible range when the chart zooms or pans */
	onRangeChange?: (range: [number, number]) => void;
	/** Labels of the indicators hidden with the legend; supports `bind:hiddenIndicators` */
	hiddenIndicators?: string[];
	/** Called with the hidden indicator labels when the legend hides or shows one */
	onHiddenIndicatorsChange?: (hiddenIndicators: string[]) => void;
	/** Price style: `solid` and `hollow` candles, where `hollow` leaves rising bodies empty, `ohlc` bars, or a `line` or `area` of the closes; defaults to `solid` */
	variant?: "solid" | "hollow" | "ohlc" | "line" | "area";
	/** Price scale; `log` spaces equal percent moves equally, for long ranges; defaults to `linear` */
	scale?: "linear" | "log";
	/** Draws the gridlines; defaults to `true` */
	grid?: boolean;
	/** Marks the latest close with a dotted line and an axis tag, which follows live updates; defaults to `true` */
	lastPrice?: boolean;
	/** Axis and legend text, and the plot height unless `--candlestick-chart-height` is set; defaults to `md` */
	size?: UiSize;
	/** Formats prices on the axis, tags, tooltip, and table */
	formatPrice?: (price: number) => string;
	/** Formats a candle's time in the tooltip, table, and announcements; axis ticks pick their own format by zoom level */
	formatTime?: (time: Date, index: number) => string;
	/** Formats volumes in the tooltip and table; compact numbers, such as 1.2K, when omitted */
	formatVolume?: (volume: number) => string;
	/** Custom tooltip content for the hovered candle */
	tooltip?: Snippet<[TooltipSnippetProps]>;
	/** Shows the indicator legend; on when there are indicators */
	legend?: boolean;
	/** Shows the table of visible candles under the chart; screen readers always get it */
	table?: boolean;
	/** Accessible name of the plot, such as "AAPL, 5 minute candles"; defaults to "Candlestick chart" */
	label?: string;
	/** Classes merged onto the chart */
	class?: CompProps<"figure">["class"];
}

export type CandlestickChartProps = Props;
export type CandlestickChartCandle = Candle;
export type CandlestickChartPriceLevel = PriceLevel;
export type CandlestickChartIndicator = Indicator;
export type CandlestickChartTradingSession = TradingSession;
export type CandlestickChartTimeHighlight = TimeHighlight;
export type CandlestickChartIndicatorValue = IndicatorValue;
export type CandlestickChartTooltipSnippetProps = TooltipSnippetProps;
