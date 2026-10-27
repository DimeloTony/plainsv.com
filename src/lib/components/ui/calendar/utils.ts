import type { DateRange, WeekStart } from "./index.js";

/** Returns the date at local midnight. */
export const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

/** Returns the first day of the date's month. */
export const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

/** Returns the date moved by a number of days. */
export const addDays = (date: Date, amount: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);

/** Returns the date moved by a number of months, clamped to the last day of a shorter month. */
export function addMonths(date: Date, amount: number) {
	const target = new Date(date.getFullYear(), date.getMonth() + amount, 1);
	const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
	target.setDate(Math.min(date.getDate(), lastDay));
	return target;
}

/** Compares two dates by day; negative when `a` is earlier, 0 on the same day. */
export const compareDays = (a: Date, b: Date) => startOfDay(a).getTime() - startOfDay(b).getTime();

/** Whether both dates are set and fall on the same day. */
export const isSameDay = (a?: Date, b?: Date) => !!a && !!b && compareDays(a, b) === 0;

/** Whether both dates fall in the same month of the same year. */
export const isSameMonth = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

/** Builds a `yyyy-mm-dd` key in local time, for ids, keys, and lookups. */
export const toDateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

/** Returns the column of a date in a week that starts on `weekStartsOn`. */
export const getWeekColumn = (date: Date, weekStartsOn: WeekStart) => (date.getDay() - weekStartsOn + 7) % 7;

/** Returns the weeks shown for a month, each with seven days, including days from the months around it. */
export function getMonthWeeks(month: Date, weekStartsOn: WeekStart, fixedWeeks: boolean) {
	const firstDay = startOfMonth(month);
	const leadingDays = getWeekColumn(firstDay, weekStartsOn);
	const gridStart = addDays(firstDay, -leadingDays);
	const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
	// Fixed weeks always show six rows, so the height does not change between months.
	const weekCount = fixedWeeks ? 6 : Math.ceil((leadingDays + daysInMonth) / 7);
	return Array.from({ length: weekCount }, (_, week) => Array.from({ length: 7 }, (_, day) => addDays(gridStart, week * 7 + day)));
}

/** Returns the short and long weekday names in display order. */
export function getWeekdays(weekStartsOn: WeekStart, locale?: string) {
	const shortFormat = new Intl.DateTimeFormat(locale, { weekday: "short" });
	const longFormat = new Intl.DateTimeFormat(locale, { weekday: "long" });
	// January 1, 2023 was a Sunday, so day `n` of that week has weekday `n`.
	return Array.from({ length: 7 }, (_, column) => {
		const date = new Date(2023, 0, 1 + ((column + weekStartsOn) % 7));
		return { short: shortFormat.format(date), long: longFormat.format(date) };
	});
}

/** Returns the short month names from January to December. */
export function getMonthNames(locale?: string) {
	const format = new Intl.DateTimeFormat(locale, { month: "short" });
	return Array.from({ length: 12 }, (_, month) => format.format(new Date(2023, month, 1)));
}

/** Adds a date to a range: starts a new range, or completes the open one in either direction. */
export function addToRange(range: DateRange | undefined, date: Date): DateRange {
	// If no range is started or the range is complete: start a new one.
	if (!range?.from || range.to) return { from: date, to: undefined };
	// If the date comes before the start: it becomes the start, and the old start the end.
	if (compareDays(date, range.from) < 0) return { from: date, to: range.from };
	return { from: range.from, to: date };
}

/** Adds the date to the list, or removes it when it is already there. */
export function toggleDate(dates: Date[], date: Date) {
	const hasDate = dates.some((selected) => isSameDay(selected, date));
	return hasDate ? dates.filter((selected) => !isSameDay(selected, date)) : [...dates, date];
}
