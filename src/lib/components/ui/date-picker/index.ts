import type { CalendarProps, DateRange } from "#lib/components/ui/calendar/index.js";
import type { PopoverTriggerAttrs } from "#lib/components/ui/popover/index.js";

export { default as DatePicker } from "./_.svelte";

/** Calendar options the date picker passes through */
type CalendarOptions = Pick<CalendarProps, "min" | "max" | "isDateDisabled" | "numberOfMonths" | "captionLayout" | "locale" | "weekStartsOn" | "fixedWeeks" | "showOutsideDays">;

/** Props a custom trigger spreads onto the element that opens the calendar */
export interface TriggerAttrs extends PopoverTriggerAttrs {
	/** Whether the date picker is disabled */
	disabled: boolean;
}

/** Selection mode: one date, or a start and an end date */
export type DatePickerMode = "single" | "range";

/** Value shape of a selection mode: a `Date`, or a `DateRange` for `range` */
export type DatePickerValue<M extends DatePickerMode> = M extends "range" ? DateRange : Date;

/** Button that opens a calendar in a popover; the type of `value` and `onValueChange` follows `mode`, even when `mode` is omitted */
export interface Props<M extends DatePickerMode = "single"> extends CalendarOptions {
	/** Selection mode; defaults to `single` */
	mode?: M;
	/** Picked date, or range when `mode` is `range`; supports `bind:value` */
	value?: DatePickerValue<M>;
	/** Called with the picked date, or range when `mode` is `range` */
	onValueChange?: (value: DatePickerValue<M>) => void;
	/** Whether the calendar is shown; supports `bind:open` */
	open?: boolean;
	/** Text on the button while no date is picked; defaults to `Pick a date` */
	placeholder?: string;
	/** How the button shows the picked date; defaults to `{ dateStyle: "long" }` */
	formatOptions?: Intl.DateTimeFormatOptions;
	/** Closes the calendar once a date, or both ends of a range, are picked; defaults to `true` */
	closeOnSelect?: boolean;
	/** Form field name; submits the date as `yyyy-mm-dd`, or the start and end of a range as two values */
	name?: string;
	/** Dims the button and blocks opening the calendar */
	disabled?: boolean;
	/** Alignment of the calendar along the button; defaults to `start` */
	align?: "start" | "center" | "end";
	/** Button and calendar size on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Corner radius of the button and calendar; follows `size` when omitted. `pill` makes the panels pills too, which can clip their items, so use `3xl` or `4xl` for round panels */
	rounded?: UiRounded;
	/** Custom trigger; spread `props` onto the element that opens the calendar, and show `label`, the picked date or range, or `""` */
	trigger?: Snippet<[{ props: TriggerAttrs; label: string }]>;
	/** Classes merged onto the button */
	class?: CompProps<"button">["class"];
}

export type DatePickerProps<M extends DatePickerMode = "single"> = Props<M>;
export type DatePickerTriggerAttrs = TriggerAttrs;
