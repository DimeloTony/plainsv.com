export { default as Chart } from "./_.svelte";

/** Label and color of one series */
export interface ChartSeries {
	/** Name shown in the legend, tooltip, and table; defaults to the data key */
	label?: string;
	/** Any CSS color; defaults to `--chart-1` through `--chart-5` in config order, then `--muted-foreground` */
	color?: string;
}

/** Series to plot, keyed by the data field that holds their values; the order sets the default colors */
export type ChartConfig<T extends object = Record<string, unknown>> = { [K in keyof T & string]?: ChartSeries };

/** One series with its resolved label and color */
export interface ChartSeriesItem {
	/** Data key that holds the values */
	key: string;
	/** Name shown in the legend, tooltip, and table */
	label: string;
	/** CSS color of the marks */
	color: string;
}

/** One series value a custom `tooltip` snippet receives */
export interface TooltipItem {
	/** Data key of the series */
	key: string;
	/** Series label */
	label: string;
	/** Series color */
	color: string;
	/** Raw value; `NaN` when missing */
	value: number;
	/** Value after `formatValue` */
	formattedValue: string;
	/** Share of the total from 0 to 100; set only in pie and donut charts */
	percent?: number;
}

/** Values a donut `center` snippet receives */
export interface CenterSnippetProps {
	/** Sum of the visible slices */
	total: number;
	/** Total after `formatValue` */
	formattedTotal: string;
}

/** Values a custom `tooltip` snippet receives */
export interface TooltipSnippetProps {
	/** Index of the hovered row in `data` */
	index: number;
	/** Category label after `formatIndex` */
	label: string;
	/** One item per visible series, in config order */
	items: TooltipItem[];
}

/** Bar, line, area, pie, donut, radar, or radial chart drawn with SVG, with a tooltip, legend, and data table */
export interface Props<T extends object = Record<string, unknown>> extends CompProps<"figure"> {
	/** Rows to plot, one per category or point in time */
	data: T[];
	/** Field that names each row, shown along the category axis */
	index: keyof T & string;
	/** Series to plot, keyed by the field that holds their values */
	config: ChartConfig<T>;
	/** Chart form; pie, donut, and radial charts draw one slice or ring per row from the first series; defaults to `bar` */
	type?: "bar" | "line" | "area" | "pie" | "donut" | "radar" | "radial";
	/** Labels and colors of the rows in pie, donut, and radial charts, keyed by each row's `index` value; colors default to `--chart-1` through `--chart-5` in row order */
	categories?: Record<string, ChartSeries>;
	/** Stacks the bars or areas of each row; lines never stack */
	stacked?: boolean;
	/** Direction of the bars; `horizontal` lists categories down the side; defaults to `vertical` */
	orientation?: "vertical" | "horizontal";
	/** Line shape; `monotone` curves through the points without overshooting them; defaults to `linear` */
	curve?: "linear" | "monotone";
	/** Draws a dot on every line and area point */
	dots?: boolean;
	/** Fades each area from the series color at its top to a faint tint at its bottom, like shadcn's interactive area chart, instead of a flat wash */
	gradient?: boolean;
	/** Shows the legend; on by default for two or more series, or two or more rows in pie, donut, and radial charts */
	legend?: boolean;
	/** Shows the data table under the chart; screen readers always get it */
	table?: boolean;
	/** Series keys hidden with the legend, or row `index` values in pie, donut, and radial charts; supports `bind:hiddenSeries` */
	hiddenSeries?: string[];
	/** Called with the hidden series keys when the legend hides or shows a series */
	onHiddenSeriesChange?: (hiddenSeries: string[]) => void;
	/** Formats values in ticks, the tooltip, and the table; ticks use compact numbers, such as 1.2K, when omitted */
	formatValue?: (value: number) => string;
	/** Formats the category labels from each row's `index` field */
	formatIndex?: (value: unknown, index: number) => string;
	/** Custom tooltip content for the hovered row */
	tooltip?: Snippet<[TooltipSnippetProps]>;
	/** Content in the hole of a donut chart, such as the total */
	center?: Snippet<[CenterSnippetProps]>;
	/** Accessible name of the plot, such as "Visitors per month"; defaults to "Chart" */
	label?: string;
	/** Axis and legend text, and the plot height unless `--chart-height` is set; defaults to `md` */
	size?: UiSize;
	/** Corner radius of each bar's end and each radial ring's end; the starting end stays square; defaults to `xs` like shadcn */
	rounded?: UiRounded;
	/** Classes merged onto the chart */
	class?: CompProps<"figure">["class"];
}

export type ChartProps<T extends object = Record<string, unknown>> = Props<T>;
export type ChartTooltipItem = TooltipItem;
export type ChartTooltipSnippetProps = TooltipSnippetProps;
export type ChartCenterSnippetProps = CenterSnippetProps;
