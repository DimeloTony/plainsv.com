export { default as Calendar } from "./_.svelte";

/** First day of the week, from 0 for Sunday to 6 for Saturday */
export type WeekStart = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Start and end of a selected range; `to` is unset until the second date is picked */
export interface DateRange {
	/** First day of the range */
	from: Date | undefined;
	/** Last day of the range */
	to?: Date | undefined;
}

/** Selected value in any mode */
export type CalendarValue = Date | Date[] | DateRange | undefined;

/** Selection mode: one date, any number of dates, or a start and an end date */
export type CalendarMode = "single" | "multiple" | "range";

/** Value shape of a selection mode: a `Date`, a `Date[]` for `multiple`, or a `DateRange` for `range` */
export type CalendarModeValue<M extends CalendarMode> = M extends "multiple" ? Date[] : M extends "range" ? DateRange : Date;

/** Month grid date picker; the type of `value` and `onValueChange` follows `mode`, even when `mode` is omitted */
export interface Props<M extends CalendarMode = "single"> extends CompProps<"div"> {
	/** Selection mode; `multiple` removes a selected date when it is clicked again; defaults to `single` */
	mode?: M;
	/** Selected date, dates, or range, following `mode`; supports `bind:value` */
	value?: CalendarModeValue<M>;
	/** Called with the new selection, following `mode` */
	onValueChange?: (value: CalendarModeValue<M>) => void;
	/** First month shown; defaults to the month of the selected date, or today. Supports `bind:month` */
	month?: Date;
	/** Called with the first shown month when it changes */
	onMonthChange?: (month: Date) => void;
	/** Number of months shown side by side; defaults to `1` */
	numberOfMonths?: number;
	/** First day of the week, from 0 for Sunday to 6 for Saturday; defaults to `0` */
	weekStartsOn?: WeekStart;
	/** Shows the days of the previous and next months in the first and last weeks; defaults to `true` */
	showOutsideDays?: boolean;
	/** Always shows six weeks, so the height does not change between months */
	fixedWeeks?: boolean;
	/** `label` shows the month and year as text; `dropdown` lets the user pick them from selects */
	captionLayout?: "label" | "dropdown";
	/** Earliest date that can be picked or shown */
	min?: Date;
	/** Latest date that can be picked or shown */
	max?: Date;
	/** Returns true for dates that cannot be picked, such as weekends */
	isDateDisabled?: (date: Date) => boolean;
	/** BCP 47 locale for the month and weekday names; defaults to the browser locale */
	locale?: string;
	/** `default` draws a border; `ghost` drops it, such as inside a popover or card */
	variant?: "default" | "ghost";
	/** Day size, padding, and text size on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Corner radius of the calendar, with days one step smaller; defaults to `lg`, like shadcn; `pill` turns the days into circles */
	rounded?: UiRounded;
	/** Classes merged onto the calendar */
	class?: CompProps<"div">["class"];
}

export type CalendarProps<M extends CalendarMode = "single"> = Props<M>;
