export { default as CandlestickChart } from "./_.svelte";
export { default as CandlestickChartTooltip } from "./tooltip.svelte";
export { default as CandlestickChartInfo } from "./info.svelte";
export { default as CandlestickChartLegend } from "./legend.svelte";
export { getSma, getEma, getBollinger, getVwap } from "./indicators.js";
export { getDraftPosition, type DraftPositionOptions as CandlestickChartDraftPositionOptions } from "./positions.js";

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
	/** Thickness: `1` is a thin line, and bigger values shade a band centered on the price that grows 6px per step, the same at any zoom; defaults to `1` */
	size?: number;
	/** Time the line starts, at the candle whose period contains it; the plot's left edge when omitted */
	start?: Date | number | string;
	/** Time the line ends, at the candle whose period contains it; an ended level drops its axis tag, and one omitted or past the latest candle runs to the right edge */
	end?: Date | number | string;
	/** Line pattern: `dashed`, `dotted`, or `solid`; defaults to `dashed` */
	style?: "dashed" | "dotted" | "solid";
	/** Shows the price tag on the axis while the level runs; set `false` for minor levels that would crowd the axis; defaults to `true` */
	tag?: boolean;
	/** Legend group, such as "Pivots"; the legend gets a button that hides or shows every level and marker in it */
	group?: string;
}

/** Mark pinned to one candle, such as a bot's buy or sell signal or a sentiment bubble */
export interface CandleMarker {
	/** Time of the event; the marker sits on the candle whose period contains it */
	time: Date | number | string;
	/** `above` stacks over the high, `below` under the low, and `price` sits at `price`; defaults to `below` for `buy`, `price` when `price` is set, and `above` otherwise */
	position?: "above" | "below" | "price";
	/** Price the marker sits at with `position: "price"`, such as a fill price; the close when omitted */
	price?: number;
	/** Shape of the mark; defaults to `arrowUp` for `buy`, `arrowDown` for `sell`, and `circle` otherwise */
	shape?: "arrowUp" | "arrowDown" | "circle" | "square";
	/** Short text in a tag beside the shape, such as "BUY" */
	text?: string;
	/** `buy` uses the rising color, `sell` the falling color, and `default` `--chart-1` */
	kind?: "buy" | "sell" | "default";
	/** Any CSS color; overrides the `kind` color */
	color?: string;
	/** Scale of the shape, such as `1.5` for a bigger sentiment bubble; defaults to `1` */
	size?: number;
	/** Description in the tooltip, table, and announcements, such as "Bought 10 at 182.40"; defaults to `text`, then "Buy" or "Sell" */
	label?: string;
	/** Legend group, such as "Bot trades"; the legend gets a button that hides or shows every level and marker in it */
	group?: string;
}

/** Values a custom `marker` snippet receives */
export interface MarkerSnippetProps {
	/** Marker being drawn */
	marker: CandleMarker;
	/** Index of its candle in `data` */
	index: number;
	/** Candle the marker sits on */
	candle: Candle;
	/** Marker color after `kind` and `color` */
	color: string;
}

/** Values a custom `level` snippet receives */
export interface LevelSnippetProps {
	/** Level being drawn */
	level: PriceLevel;
	/** Level color after `kind` and `color` */
	color: string;
	/** Height in pixels of the band a `size` above `1` shades, centered on the price; `0` for a plain line */
	bandHeight: number;
	/** Width in pixels of the line, from its `start` to its `end` */
	width: number;
}

/** Daily clock window shaded behind the candles, such as pre-market or after hours */
export interface TradingSession {
	/** Start time as `HH:mm` in `timeZone`, such as `04:00` */
	start: string;
	/** End time as `HH:mm` in `timeZone`, not included, such as `09:30`; an end before the start runs past midnight */
	end: string;
	/** Name on the shading and in the tooltip, such as "Pre-market" */
	label: string;
	/** Any CSS color for the shading; defaults to `--chart-1` for the first session and `--muted-foreground` for the second, then repeats */
	color?: string;
	/** Draws `label` on the shading; the tooltip and table show it either way; defaults to `true` */
	showLabel?: boolean;
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
	/** Draws `label` on the shading; the tooltip and table show it either way; defaults to `true` */
	showLabel?: boolean;
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

/** A trade on the chart, such as one a bot opened, with a profit zone out to its target and a risk zone out to its stop */
export interface TradePosition {
	/** Unique id, reported back when the target or stop changes */
	id: string;
	/** `long` profits when the price rises, and `short` when it falls */
	side: "long" | "short";
	/** Time of the entry; the zones start at the candle whose period contains it */
	time: Date | number | string;
	/** Filled entry price; it stays fixed */
	entry: number;
	/** Take-profit price; above `entry` for a long and below it for a short */
	target?: number;
	/** Stop-loss price; below `entry` for a long and above it for a short */
	stop?: number;
	/** Where the trade stands: `draft` while it is set up and not confirmed, with the entry, target, and stop draggable and a check mark that runs `onPositionConfirm`; `pending` once confirmed and waiting to fill, locked and marked "Waiting"; `open` once filled; and `closed` once done; draft and pending positions start at the latest candle whatever their `time`; defaults to `closed` with `exitTime` and `open` otherwise */
	stage?: "draft" | "pending" | "open" | "closed";
	/** Time the position closed; the zones end at that candle, lose their labels and axis tags, and can no longer be edited; open positions run to the latest candle, with their labels just right of it, or inside the zone's end when the plot has no room there */
	exitTime?: Date | number | string;
	/** Name on the entry line, such as "Bot #2"; defaults to "Long" or "Short" */
	label?: string;
	/** Lets the target and stop, and a draft's entry, be dragged and moved with the arrow keys, and shows the cancel button when `onPositionCancel` is set; defaults to `true` while the position is a draft or open */
	editable?: boolean;
}

/** A target or stop change that `onPositionsChange` reports */
export interface PositionChange {
	/** `id` of the changed position */
	id: string;
	/** Line that moved; `entry` moves only on draft positions */
	field: "entry" | "target" | "stop";
	/** New price */
	price: number;
	/** Price before the change */
	previous: number;
	/** Changed position with the new price */
	position: TradePosition;
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
	/** Markers on this candle */
	markers: CandleMarker[];
}

/** Candlestick chart with sessions, a volume pane, indicators, price levels, markers, live updates, zoom, and pan */
export interface Props extends CompPropsWithChild<"figure"> {
	/** Candles in time order, oldest first */
	data: Candle[];
	/** Horizontal price lines, such as support and resistance */
	levels?: PriceLevel[];
	/** Custom content for every level on screen, in place of its line, band, and label; the price tag on the axis stays */
	level?: Snippet<[LevelSnippetProps]>;
	/** Overlays computed from the candles: moving averages, Bollinger bands, and VWAP */
	indicators?: Indicator[];
	/** Marks pinned to candles, such as a bot's buy and sell signals or sentiment bubbles */
	markers?: CandleMarker[];
	/** Custom content for every marker, in place of its shape and text */
	marker?: Snippet<[MarkerSnippetProps]>;
	/** Trades with profit and risk zones, such as a bot's open positions; drag a target or stop to move it; supports `bind:positions` */
	positions?: TradePosition[];
	/** Called once a dragged or nudged target or stop is let go, with every position and the change, so a bot can update its orders */
	onPositionsChange?: (positions: TradePosition[], change: PositionChange) => void;
	/** Called with a position when its cancel button is pressed; the button shows on draft, pending, and open editable positions only when this is set, discards a draft at once, and the chart keeps the position until `positions` drops it or closes it */
	onPositionCancel?: (position: TradePosition) => void;
	/** Called with a draft position when its check mark is pressed; send the order and set its `stage` to `pending`, then `open` once it fills; the check mark shows only when this is set */
	onPositionConfirm?: (position: TradePosition) => void;
	/** Turns the cancel button into a check mark on the first press, and runs `onPositionCancel` only when the check mark is pressed; defaults to `true` */
	confirmCancel?: boolean;
	/** Smallest price move for a dragged or nudged target or stop, which snaps to it; defaults to `0.01` */
	priceStep?: number;
	/** Daily clock windows shaded behind the candles, such as pre-market and after hours */
	sessions?: TradingSession[];
	/** Fixed time ranges shaded behind the candles, such as earnings */
	highlights?: TimeHighlight[];
	/** IANA time zone for sessions, day resets, the time axis, and the tooltip, such as `America/New_York`; the viewer's zone when omitted */
	timeZone?: string;
	/** Shows the volume pane; on when any candle has volume */
	volume?: boolean;
	/** Visible candles as `[start, end)` indexes, fractional while panning, where an `end` past the data is empty space after the latest candle; the latest candles that fit when omitted; supports `bind:range` */
	range?: [number, number];
	/** Called with the visible range when the chart zooms or pans */
	onRangeChange?: (range: [number, number]) => void;
	/** Touch gestures: `page` leaves vertical swipes to the page, so a finger pans only sideways, and `chart` takes them, so a finger drags in any direction, for full-screen charts where the page has nothing to scroll; the mouse wheel zooms either way; defaults to `page` */
	gestures?: "page" | "chart";
	/** Whether the chart has measured its plot and painted its candles, info, and legend; it turns true two frames after drawing, so a loader hides only once everything is in place; read it with `bind:ready` */
	ready?: boolean;
	/** Called when `ready` changes, such as when the first candles are drawn */
	onReadyChange?: (ready: boolean) => void;
	/** Labels of the indicators hidden with the legend; supports `bind:hiddenIndicators` */
	hiddenIndicators?: string[];
	/** Called with the hidden indicator labels when the legend hides or shows one */
	onHiddenIndicatorsChange?: (hiddenIndicators: string[]) => void;
	/** Names of the level and marker groups hidden with the legend; supports `bind:hiddenGroups` */
	hiddenGroups?: string[];
	/** Called with the hidden group names when the legend hides or shows a group */
	onHiddenGroupsChange?: (hiddenGroups: string[]) => void;
	/** Price style: `solid` and `hollow` candles, where `hollow` leaves rising bodies empty, `ohlc` bars, or a `line` or `area` of the closes; defaults to `solid` */
	variant?: "solid" | "hollow" | "ohlc" | "line" | "area";
	/** Price scale; `log` spaces equal percent moves equally, for long ranges; defaults to `linear` */
	scale?: "linear" | "log";
	/** Draws the gridlines; defaults to `true` */
	grid?: boolean;
	/** Marks the latest close with a dotted line and an axis tag, which follows live updates; defaults to `true` */
	lastPrice?: boolean;
	/** Axis text, the plot height unless `--candlestick-chart-height` is set, and the size and radius of the parts that do not set their own; defaults to `md` */
	size?: UiSize;
	/** Formats prices on the axis, tags, tooltip, and table */
	formatPrice?: (price: number) => string;
	/** Formats a candle's time in the tooltip, table, and announcements; axis ticks pick their own format by zoom level */
	formatTime?: (time: Date, index: number) => string;
	/** Formats volumes in the tooltip and table; compact numbers, such as 1.2K, when omitted */
	formatVolume?: (volume: number) => string;
	/** Parts to show, such as `CandlestickChartLegend`, `CandlestickChartTooltip`, and `CandlestickChartInfo`; a part left out is hidden */
	children: Snippet;
	/** Shows the table of visible candles under the chart; screen readers always get it */
	table?: boolean;
	/** Accessible name of the plot, such as "AAPL, 5 minute candles"; defaults to "Candlestick chart" */
	label?: string;
	/** Classes merged onto the chart */
	class?: CompProps<"figure">["class"];
}

/** Floating readout of the hovered candle; leave it out of the chart's children to hide the tooltip and keep the crosshair */
export interface TooltipProps extends Omit<CompProps<"div">, "children"> {
	/** Shows the open, high, low, close, change, and volume; set `false` next to `CandlestickChartInfo`, which shows them, so the tooltip keeps the time, session, indicators, and markers; defaults to `true` */
	ohlc?: boolean;
	/** `default` is a popover card, `secondary` a filled box, `outline` a bordered box on the page background, `ghost` bare text with no box, and `card` a see-through box over a blurred plot; defaults to `default` */
	variant?: "default" | "secondary" | "outline" | "ghost" | "card";
	/** Padding, text, and radius; overrides the chart's `size` */
	size?: UiSize;
	/** Corner radius; follows `size` when omitted; `pill` rounds to half the height of one line, since the tooltip wraps onto several */
	rounded?: UiRounded;
	/** Custom content for the hovered candle, in place of the default rows */
	children?: Snippet<[TooltipSnippetProps]>;
	/** Classes merged onto the tooltip */
	class?: CompProps<"div">["class"];
}

/** Open, high, low, close, change, and volume of the hovered candle, or the latest one, on one row in the plot's top-left corner; an `overlay` legend moves under it */
export interface InfoProps extends CompProps<"div"> {
	/** `default` and `ghost` are bare text over the plot, `secondary` a filled box, `outline` a bordered box, and `card` a blurred backdrop so busy candles stay readable under it; defaults to `default` */
	variant?: "default" | "secondary" | "outline" | "ghost" | "card";
	/** Text size, and padding with `card`; overrides the chart's `size` */
	size?: UiSize;
	/** Corner radius of the `card` backdrop; follows `size` when omitted; `pill` rounds to half the height of one line, since the info wraps on narrow charts */
	rounded?: UiRounded;
	/** Classes merged onto the info */
	class?: CompProps<"div">["class"];
}

/** Buttons that hide or show each indicator and each level and marker group */
export interface LegendProps extends CompProps<"ul"> {
	/** `top` puts the legend above the plot and `bottom` below it, while `overlay` floats it in the plot's top-left corner and `overlayBottom` in the price pane's bottom-left corner, taking no space; defaults to `top` */
	position?: "top" | "bottom" | "overlay" | "overlayBottom";
	/** `wrap` breaks onto new lines when it runs out of room, and `scroll` keeps one row that scrolls sideways with faded edges, for small screens; defaults to `wrap` */
	overflow?: "wrap" | "scroll";
	/** `default` is a plain row with a divider, `secondary` a filled box, `outline` a bordered box, `ghost` bare buttons that fill on hover, and `card` a blurred backdrop; defaults to `card` for the overlay positions and `default` otherwise */
	variant?: "default" | "secondary" | "outline" | "ghost" | "card";
	/** Text and button padding; overrides the chart's `size` */
	size?: UiSize;
	/** Corner radius of the `card` backdrop; its buttons use one step smaller, and both are pills with `pill`; follows `size` when omitted */
	rounded?: UiRounded;
	/** Classes merged onto the legend */
	class?: CompProps<"ul">["class"];
}

export type CandlestickChartProps = Props;
export type CandlestickChartTooltipProps = TooltipProps;
export type CandlestickChartInfoProps = InfoProps;
export type CandlestickChartLegendProps = LegendProps;
export type CandlestickChartCandle = Candle;
export type CandlestickChartPriceLevel = PriceLevel;
export type CandlestickChartIndicator = Indicator;
export type CandlestickChartMarker = CandleMarker;
export type CandlestickChartMarkerSnippetProps = MarkerSnippetProps;
export type CandlestickChartLevelSnippetProps = LevelSnippetProps;
export type CandlestickChartTradingSession = TradingSession;
export type CandlestickChartTimeHighlight = TimeHighlight;
export type CandlestickChartPosition = TradePosition;
export type CandlestickChartPositionChange = PositionChange;
export type CandlestickChartIndicatorValue = IndicatorValue;
export type CandlestickChartTooltipSnippetProps = TooltipSnippetProps;
