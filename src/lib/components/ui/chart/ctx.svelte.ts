import { setContext, getContext } from "svelte";
import { getNiceTicks, getPolarPoint, toNumber } from "./utils.js";
import type { Props, ChartSeries, ChartSeriesItem, TooltipItem } from "./index.js";

const CONTEXT_ID = "chart-context";
// Space in pixels between the plot and its tick labels.
const TICK_PADDING = 8;
// Fewest and most value ticks, and the pixels each tick needs along its axis.
const MIN_TICKS = 2;
const MAX_TICKS = 6;
const PIXELS_PER_TICK = { vertical: 48, horizontal: 80 };
// Default number formats; ticks use compact numbers, such as 1.2K.
const compactFormat = new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 });
const fullFormat = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });
// Default colors for the first five series or rows; later ones fall back to a neutral, since cycling hues would repeat a color.
export const SERIES_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
const FALLBACK_COLOR = "var(--muted-foreground)";
// Thickest a radial ring gets, and the space between rings, so rings stay thin marks.
const MAX_RING_SIZE = 24;
const RING_GAP = 4;
// Share of the radius a donut's hole and a radial chart's hole take.
const DONUT_HOLE = 0.6;
const RADIAL_HOLE = 0.25;
// Rings on a radar chart's grid.
const RADAR_TICKS = 4;
// Angle of the top of a round chart, where slices, rings, and spokes start.
const TOP = -Math.PI / 2;
const FULL_TURN = Math.PI * 2;

class UseCompCtx {
	/** Rows to plot */
	data: object[] = $state([]);
	/** Field that names each row */
	index = $state("");
	/** Every series in config order, with its label and color */
	series: ChartSeriesItem[] = $state([]);
	/** Chart form */
	type: NonNullable<Props["type"]> = $state("bar");
	/** Whether bars or areas stack */
	stacked = $state(false);
	/** Direction of the bars */
	orientation: NonNullable<Props["orientation"]> = $state("vertical");
	/** Line shape */
	curve: NonNullable<Props["curve"]> = $state("linear");
	/** Whether every line point gets a dot */
	dots = $state(false);
	/** Whether areas fade from the series color instead of a flat wash */
	gradient = $state(false);
	/** Labels and colors of the rows in pie, donut, and radial charts, keyed by `index` value */
	categories: Record<string, ChartSeries> = $state({});
	/** Keys of the series, or rows in pie, donut, and radial charts, hidden with the legend */
	hidden: string[] = $state([]);
	/** Custom value format */
	formatValue?: Props["formatValue"] = $state();
	/** Custom category label format */
	formatIndex?: Props["formatIndex"] = $state();
	/** Custom tooltip content */
	tooltip?: Props["tooltip"] = $state();
	/** Called with the hidden series keys */
	onHiddenSeriesChange?: Props["onHiddenSeriesChange"];
	/** Plot width in pixels */
	width = $state(0);
	/** Plot height in pixels */
	height = $state(0);
	/** Axis text size in pixels, read from CSS */
	fontSize = $state(12);
	/** Bar end radius in pixels, read from CSS */
	barRadius = $state(4);
	/** Index of the hovered or focused row; -1 while none is */
	activeIndex = $state(-1);
	/** Pointer position in plot pixels; null while the keyboard drives the tooltip */
	pointer: { x: number; y: number } | null = $state(null);

	/** Series still shown */
	visibleSeries = $derived(this.series.filter((series) => !this.hidden.includes(series.key)));
	/** Category label of every row */
	labels = $derived(this.data.map((row, index) => (this.formatIndex ? this.formatIndex(Reflect.get(row, this.index), index) : String(Reflect.get(row, this.index) ?? ""))));
	/** Whether each row is a slice or ring, as in pie, donut, and radial charts */
	isCategorical = $derived(this.type === "pie" || this.type === "donut" || this.type === "radial");
	/** Whether the chart is round, with no axes */
	isPolar = $derived(this.isCategorical || this.type === "radar");
	/** Every row with its key, label, and color; slices and rings use these, and colors follow row order */
	rows: ChartSeriesItem[] = $derived(
		this.data.map((row, position) => {
			const key = String(Reflect.get(row, this.index) ?? position);
			const item = this.categories[key];
			return { key, label: item?.label ?? this.labels[position], color: item?.color ?? SERIES_COLORS[position] ?? FALLBACK_COLOR };
		}),
	);
	/** Indexes of the rows shown; the legend hides rows only in pie, donut, and radial charts */
	visibleRows = $derived(this.data.map((_, position) => position).filter((position) => !this.isCategorical || !this.hidden.includes(this.rows[position].key)));
	/** Series that sizes the slices and rings: the first in the config */
	valueSeries = $derived(this.series[0]);
	/** Value of every row in the value series */
	rowValues = $derived(this.data.map((row) => (this.valueSeries ? toNumber(Reflect.get(row, this.valueSeries.key)) : NaN)));
	/** Legend entries: rows in pie, donut, and radial charts, and series otherwise */
	legendItems = $derived(this.isCategorical ? this.rows : this.series);
	/** Whether the bars run sideways */
	isHorizontal = $derived(this.type === "bar" && this.orientation === "horizontal");
	/** Whether bars or areas stack; lines never do */
	isStacked = $derived(this.stacked && this.type !== "line");
	/** Start and end value of every visible series in every row; a stacked series starts where the one before it ended */
	ranges = $derived(
		this.data.map((row) => {
			let positiveTotal = 0;
			let negativeTotal = 0;
			return this.visibleSeries.map((series): [number, number] => {
				const value = toNumber(Reflect.get(row, series.key));
				// If nothing stacks: every series starts at zero.
				if (!this.isStacked) return [0, value];
				// If the value is missing: give it no size, so the stack continues past it.
				if (Number.isNaN(value)) return [positiveTotal, positiveTotal];
				const start = value >= 0 ? positiveTotal : negativeTotal;
				if (value >= 0) positiveTotal += value;
				else negativeTotal += value;
				return [start, start + value];
			});
		}),
	);
	/** Pixels from the top of the plot to the drawing area; leaves room for half of the top tick label */
	marginTop = $derived(this.isHorizontal ? 4 : Math.ceil(this.fontSize / 2) + 2);
	/** Pixels below the drawing area for the bottom labels */
	marginBottom = $derived(Math.ceil(this.fontSize * 1.5) + TICK_PADDING);
	/** Value ticks on round numbers; bars and areas always include zero */
	ticks = $derived.by(() => {
		const ends = this.ranges.flatMap((row) => row.map(([, end]) => end)).filter(Number.isFinite);
		const floor = this.type === "line" ? Infinity : 0;
		const ceiling = this.type === "line" ? -Infinity : 0;
		const min = ends.length ? Math.min(floor, ...ends) : 0;
		const max = ends.length ? Math.max(ceiling, ...ends) : 1;
		// If the chart is a radar: use a fixed number of grid rings.
		if (this.type === "radar") return getNiceTicks(min, max, RADAR_TICKS);
		// The tick count follows the axis length; horizontal bars read it before the right margin, which depends on the ticks.
		const axisLength = this.isHorizontal ? this.width - this.marginLeftForLabels : this.height - this.marginTop - this.marginBottom;
		const count = Math.min(MAX_TICKS, Math.max(MIN_TICKS, Math.floor(axisLength / PIXELS_PER_TICK[this.isHorizontal ? "horizontal" : "vertical"])));
		return getNiceTicks(min, max, count);
	});
	/** Text of every value tick */
	tickLabels = $derived(this.ticks.map((tick) => this.formatTick(tick)));
	/** Width of the category labels beside horizontal bars, capped at 40% of the plot */
	marginLeftForLabels = $derived(Math.min(this.width * 0.4, this.measureText(this.labels) + TICK_PADDING));
	/** Pixels left of the drawing area for the side labels */
	marginLeft = $derived(this.isHorizontal ? this.marginLeftForLabels : this.measureText(this.tickLabels) + TICK_PADDING);
	/** Pixels right of the drawing area; horizontal bars leave room for half of the last tick label */
	marginRight = $derived(this.isHorizontal ? Math.ceil(this.measureText(this.tickLabels.slice(-1)) / 2) + 2 : 4);
	/** Width of the drawing area */
	innerWidth = $derived(Math.max(0, this.width - this.marginLeft - this.marginRight));
	/** Height of the drawing area */
	innerHeight = $derived(Math.max(0, this.height - this.marginTop - this.marginBottom));
	/** Lowest and highest value on the axis */
	domain = $derived([this.ticks[0] ?? 0, this.ticks.at(-1) ?? 1]);
	/** Pixel position of zero, or the nearest axis end when zero is off the axis */
	baseline = $derived(this.valueToPixel(Math.min(Math.max(0, this.domain[0]), this.domain[1])));
	/** Length of each category's slot along the category axis */
	bandSize = $derived((this.isHorizontal ? this.innerHeight : this.innerWidth) / Math.max(1, this.data.length));
	/** Center of a round chart */
	centerX = $derived(this.width / 2);
	centerY = $derived(this.height / 2);
	/** Outer radius of a round chart; a radar leaves room for its spoke labels */
	radius = $derived(Math.max(0, this.type === "radar" ? Math.min(this.width / 2 - this.measureText(this.labels) - TICK_PADDING * 2, this.height / 2 - this.fontSize * 1.5 - TICK_PADDING) : Math.min(this.width, this.height) / 2 - 2));
	/** Radius of the hole in a donut or radial chart */
	holeRadius = $derived(this.type === "donut" ? this.radius * DONUT_HOLE : this.type === "radial" ? this.radius * RADIAL_HOLE : 0);
	/** Sum of the visible positive row values, the whole of a pie */
	total = $derived(this.visibleRows.reduce((sum, row) => sum + Math.max(0, this.rowValues[row] || 0), 0));
	/** Angles of every visible pie or donut slice, clockwise from the top */
	slices = $derived.by(() => {
		let angle = TOP;
		return this.visibleRows.flatMap((row) => {
			const value = this.rowValues[row];
			// If the value is missing, zero, or negative: it gets no slice; the table keeps it.
			if (!(value > 0) || !this.total) return [];
			const startAngle = angle;
			angle += (value / this.total) * FULL_TURN;
			return [{ row, startAngle, endAngle: angle }];
		});
	});
	/** Top of the radial scale on a round number, so the largest ring is not always a full circle */
	radialMax = $derived(getNiceTicks(0, Math.max(0, ...this.visibleRows.map((row) => this.rowValues[row]).filter(Number.isFinite)), RADAR_TICKS).at(-1) ?? 1);
	/** Radii of every visible radial ring, with the first row outermost */
	rings = $derived.by(() => {
		const size = Math.max(2, Math.min(MAX_RING_SIZE, (this.radius - this.holeRadius) / Math.max(1, this.visibleRows.length) - RING_GAP));
		return this.visibleRows.map((row, position) => {
			const outerRadius = this.radius - position * (size + RING_GAP);
			return { row, innerRadius: outerRadius - size, outerRadius };
		});
	});
	/** Every how many categories a label is drawn, so labels never overlap */
	labelStep = $derived.by(() => {
		const labelSize = this.isHorizontal ? this.fontSize * 1.25 : this.measureText(this.labels) + TICK_PADDING * 2;
		const slotSize = this.type === "bar" ? this.bandSize : this.innerWidth / Math.max(1, this.data.length - 1);
		return Math.max(1, Math.ceil(labelSize / Math.max(1, slotSize)));
	});

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}
	}

	/** Estimates the pixel width of the longest text, from the axis font size. */
	measureText(texts: string[]) {
		return Math.ceil(Math.max(0, ...texts.map((text) => text.length)) * this.fontSize * 0.6);
	}

	/** Formats a tick value. */
	formatTick(value: number) {
		return this.formatValue ? this.formatValue(value) : compactFormat.format(value);
	}

	/** Formats a value for the tooltip and table; missing values show as a dash. */
	formatFull(value: number) {
		if (Number.isNaN(value)) return "–";
		return this.formatValue ? this.formatValue(value) : fullFormat.format(value);
	}

	/** Reads a series value from a row as a number. */
	getValue(row: object, key: string) {
		return toNumber(Reflect.get(row, key));
	}

	/** Converts a value to its pixel position along the value axis. */
	valueToPixel(value: number) {
		const [min, max] = this.domain;
		const share = (value - min) / (max - min || 1);
		return this.isHorizontal ? this.marginLeft + share * this.innerWidth : this.marginTop + (1 - share) * this.innerHeight;
	}

	/** Converts a row index to the pixel center of its category; bars sit in slots, and lines and areas span edge to edge. */
	categoryToPixel(index: number) {
		if (this.type === "bar") return (this.isHorizontal ? this.marginTop : this.marginLeft) + this.bandSize * (index + 0.5);
		const count = this.data.length;
		return this.marginLeft + (count <= 1 ? this.innerWidth / 2 : (this.innerWidth * index) / (count - 1));
	}

	/** Angle of a radar spoke, clockwise from the top. */
	spokeAngle(index: number) {
		return TOP + (FULL_TURN * index) / Math.max(1, this.data.length);
	}

	/** Converts a radar value on a spoke to its point; values below zero sit at the center. */
	radarPoint(index: number, value: number) {
		const share = Math.max(0, value) / (this.domain[1] || 1);
		return getPolarPoint(this.centerX, this.centerY, this.radius * share, this.spokeAngle(index));
	}

	/** Converts a radial value to the end angle of its ring. */
	radialAngle(value: number) {
		return TOP + (Math.max(0, value) / this.radialMax) * FULL_TURN;
	}

	/** Finds the row under a pointer in a round chart: the slice, the ring, or the nearest spoke. */
	polarIndexAt(x: number, y: number) {
		const distance = Math.hypot(x - this.centerX, y - this.centerY);
		// Angle clockwise from the top, from 0 to a full turn.
		const angle = (Math.atan2(y - this.centerY, x - this.centerX) - TOP + FULL_TURN) % FULL_TURN;
		// If a radar: the nearest spoke wins anywhere near the chart.
		if (this.type === "radar") return this.data.length && distance <= this.radius + TICK_PADDING * 3 ? Math.round(angle / (FULL_TURN / this.data.length)) % this.data.length : -1;
		// If a radial chart: the whole ring is the target, including its gaps.
		if (this.type === "radial") return this.rings.find((ring) => distance >= ring.innerRadius - RING_GAP / 2 && distance <= ring.outerRadius + RING_GAP / 2)?.row ?? -1;
		// If outside the pie or inside the donut's hole: hover nothing.
		if (distance > this.radius || distance < this.holeRadius) return -1;
		return this.slices.find((slice) => angle >= slice.startAngle - TOP && angle < slice.endAngle - TOP)?.row ?? -1;
	}

	/** Finds the row nearest a pointer position, or -1 when the pointer is outside the drawing area. */
	indexAt(x: number, y: number) {
		// If the chart is round: find the row by angle and distance.
		if (this.isPolar) return this.polarIndexAt(x, y);
		const count = this.data.length;
		const isInside = x >= this.marginLeft && x <= this.marginLeft + this.innerWidth && y >= this.marginTop && y <= this.marginTop + this.innerHeight;
		// If there is no data or the pointer is outside the drawing area: hover nothing.
		if (!count || !isInside) return -1;
		if (this.isHorizontal) return Math.min(count - 1, Math.floor((y - this.marginTop) / this.bandSize));
		if (this.type === "bar") return Math.min(count - 1, Math.floor((x - this.marginLeft) / this.bandSize));
		return count === 1 ? 0 : Math.round(((x - this.marginLeft) / (this.innerWidth || 1)) * (count - 1));
	}

	/** Point beside a row's mark where the tooltip sits while the keyboard drives it. */
	getAnchor(index: number) {
		if (this.type === "pie" || this.type === "donut") {
			const slice = this.slices.find((item) => item.row === index);
			const [x, y] = getPolarPoint(this.centerX, this.centerY, (this.holeRadius + this.radius) / 2, slice ? (slice.startAngle + slice.endAngle) / 2 : TOP);
			return { x, y };
		}
		if (this.type === "radial") {
			const ring = this.rings.find((item) => item.row === index);
			const [x, y] = getPolarPoint(this.centerX, this.centerY, ring ? (ring.innerRadius + ring.outerRadius) / 2 : this.radius, TOP);
			return { x, y };
		}
		if (this.type === "radar") {
			const [x, y] = getPolarPoint(this.centerX, this.centerY, this.radius, this.spokeAngle(index));
			return { x, y };
		}
		if (this.isHorizontal) return { x: this.marginLeft + this.innerWidth / 2, y: this.categoryToPixel(index) };
		return { x: this.categoryToPixel(index), y: this.marginTop + this.innerHeight / 3 };
	}

	/** Lists the values the tooltip shows for a row: every visible series, or the one value of a slice or ring with its share. */
	getTooltipItems(index: number): TooltipItem[] {
		const row = this.data[index];
		// If the row does not exist: show nothing.
		if (!row) return [];
		if (this.isCategorical) {
			const value = this.rowValues[index];
			const percent = this.type !== "radial" && this.total && value > 0 ? (value / this.total) * 100 : undefined;
			return this.valueSeries ? [{ key: this.valueSeries.key, label: this.valueSeries.label, color: this.rows[index].color, value, formattedValue: this.formatFull(value), percent }] : [];
		}
		return this.visibleSeries.map((series) => {
			const value = this.getValue(row, series.key);
			return { key: series.key, label: series.label, color: series.color, value, formattedValue: this.formatFull(value) };
		});
	}

	/** Activates a row from the keyboard, so the tooltip sits beside its mark. */
	moveActive(index: number) {
		this.pointer = null;
		this.activeIndex = index;
	}

	/** Hides or shows a series, or a row in pie, donut, and radial charts, and reports the change. */
	toggleSeries(key: string) {
		this.hidden = this.hidden.includes(key) ? this.hidden.filter((hiddenKey) => hiddenKey !== key) : [...this.hidden, key];
		this.onHiddenSeriesChange?.(this.hidden);
	}
}

export type CompCtxProps = Pick<InstanceType<typeof UseCompCtx>, "data" | "index" | "series" | "categories" | "type" | "stacked" | "orientation" | "curve" | "dots" | "gradient" | "hidden" | "formatValue" | "formatIndex" | "tooltip" | "onHiddenSeriesChange">;

export const setCompCtx = (props: CompCtxProps) => setContext(CONTEXT_ID, new UseCompCtx(props));

export const useCompCtx = () => getContext<ReturnType<typeof setCompCtx>>(CONTEXT_ID);
