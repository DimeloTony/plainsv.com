/** Calendar unit and step that time ticks fall on, such as every 15 minutes */
type TimeUnit = [kind: "minute" | "hour" | "day" | "month" | "year", step: number];

/** Calendar fields of a time in one time zone */
export interface ZonedTime {
	/** Full year */
	year: number;
	/** Month from 0 to 11 */
	month: number;
	/** Day of the month */
	day: number;
	/** Minutes since midnight */
	minuteOfDay: number;
	/** Days since 1970-01-01 for this calendar date, so dates compare across time zones */
	dayNumber: number;
}

/** Time formats for one time zone */
interface TimeFormats {
	/** Clock time, such as 09:30 AM */
	time: Intl.DateTimeFormat;
	/** Short date, such as Oct 21 */
	day: Intl.DateTimeFormat;
	/** Short month, such as Oct */
	month: Intl.DateTimeFormat;
	/** Year, such as 2026 */
	year: Intl.DateTimeFormat;
	/** Date and clock time for intraday candles */
	intraday: Intl.DateTimeFormat;
	/** Full date for daily candles */
	daily: Intl.DateTimeFormat;
	/** Calendar fields in numeric parts, read by `getZonedTime` */
	parts: Intl.DateTimeFormat;
}

// Tick units from finest to coarsest; the axis uses the finest one whose labels fit.
const TIME_UNITS: TimeUnit[] = [
	["minute", 1],
	["minute", 5],
	["minute", 15],
	["minute", 30],
	["hour", 1],
	["hour", 2],
	["hour", 4],
	["hour", 6],
	["hour", 12],
	["day", 1],
	["day", 2],
	["day", 7],
	["month", 1],
	["month", 3],
	["month", 6],
	["year", 1],
];
const DAY_MS = 86_400_000;
// Formats per time zone, built once; the empty key is the viewer's own zone.
const formatsByZone = new Map<string, TimeFormats>();

/** Returns the time formats for a time zone, building them on first use. */
function getFormats(timeZone: string | undefined) {
	const cached = formatsByZone.get(timeZone ?? "");
	// If the formats exist: reuse them, since building them is slow.
	if (cached) return cached;
	const formats: TimeFormats = {
		time: new Intl.DateTimeFormat(undefined, { timeZone, hour: "2-digit", minute: "2-digit" }),
		day: new Intl.DateTimeFormat(undefined, { timeZone, month: "short", day: "numeric" }),
		month: new Intl.DateTimeFormat(undefined, { timeZone, month: "short" }),
		year: new Intl.DateTimeFormat(undefined, { timeZone, year: "numeric" }),
		intraday: new Intl.DateTimeFormat(undefined, { timeZone, month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
		daily: new Intl.DateTimeFormat(undefined, { timeZone, year: "numeric", month: "short", day: "numeric" }),
		parts: new Intl.DateTimeFormat("en-US", { timeZone, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", hourCycle: "h23" }),
	};
	formatsByZone.set(timeZone ?? "", formats);
	return formats;
}

/** Converts a candle time to a timestamp in milliseconds. */
export function toTimestamp(time: Date | number | string) {
	if (time instanceof Date) return time.getTime();
	return typeof time === "number" ? time : Date.parse(time);
}

/** Reads the calendar fields of a time in a time zone; the viewer's zone when `timeZone` is omitted. */
export function getZonedTime(time: number, timeZone?: string): ZonedTime {
	const parts = Object.fromEntries(
		getFormats(timeZone)
			.parts.formatToParts(time)
			.map((part) => [part.type, part.value]),
	);
	const year = Number(parts.year);
	const month = Number(parts.month) - 1;
	const day = Number(parts.day);
	return { year, month, day, minuteOfDay: (Number(parts.hour) % 24) * 60 + Number(parts.minute), dayNumber: Date.UTC(year, month, day) / DAY_MS };
}

/** Converts a clock time such as `09:30` to minutes since midnight. */
export function parseClock(clock: string) {
	const [hours = 0, minutes = 0] = clock.split(":").map(Number);
	return hours * 60 + minutes;
}

/** Whether minutes since midnight fall in a clock window; a window that ends before it starts runs past midnight. */
export function isInWindow(minuteOfDay: number, start: number, end: number) {
	return start <= end ? minuteOfDay >= start && minuteOfDay < end : minuteOfDay >= start || minuteOfDay < end;
}

/** Whether candles are less than a day apart, judged by the median gap so weekends do not count. */
export function isIntraday(times: number[]) {
	const gaps = times
		.slice(1)
		.map((time, index) => time - times[index])
		.toSorted((a, b) => a - b);
	return gaps.length > 0 && gaps[Math.floor(gaps.length / 2)] < DAY_MS;
}

/** Formats a candle time in full for the tooltip, table, and announcements. */
export function formatFullTime(time: number, intraday: boolean, timeZone?: string) {
	const formats = getFormats(timeZone);
	return (intraday ? formats.intraday : formats.daily).format(time);
}

/** Names the bucket a time falls in for a unit; a candle starting a new bucket gets a tick. */
function getBucket(zoned: ZonedTime, [kind, step]: TimeUnit) {
	if (kind === "minute" || kind === "hour") return `${zoned.dayNumber}-${Math.floor(zoned.minuteOfDay / (kind === "hour" ? step * 60 : step))}`;
	// Weeks start on Monday; the epoch day 0 was a Thursday, so shift by 3.
	if (kind === "day") return String(Math.floor((zoned.dayNumber + (step === 7 ? 3 : 0)) / step));
	if (kind === "month") return `${zoned.year}-${Math.floor(zoned.month / step)}`;
	return String(zoned.year);
}

/** Formats a tick: times within a day show the clock, and a tick that starts a new day or year shows that instead. */
function formatTick(time: number, zoned: ZonedTime, previous: ZonedTime | undefined, [kind]: TimeUnit, formats: TimeFormats) {
	const isNewDay = !previous || previous.dayNumber !== zoned.dayNumber;
	const isNewYear = !previous || previous.year !== zoned.year;
	if (kind === "minute" || kind === "hour") return isNewDay ? formats.day.format(time) : formats.time.format(time);
	if (kind === "day") return formats.day.format(time);
	if (kind === "month") return isNewYear ? formats.year.format(time) : formats.month.format(time);
	return formats.year.format(time);
}

/** Picks the candles that get a time tick, using the finest calendar unit whose labels fit in `width`. */
export function getTimeTicks(times: number[], zoned: ZonedTime[], indexes: number[], width: number, minGap: number, timeZone?: string) {
	const formats = getFormats(timeZone);
	for (const [position, unit] of TIME_UNITS.entries()) {
		// A candle starts a bucket when its bucket differs from the candle before it, even one off screen.
		const starts = indexes.filter((index) => index > 0 && getBucket(zoned[index], unit) !== getBucket(zoned[index - 1], unit));
		// If the labels fit, or this is the coarsest unit: use it.
		if (starts.length * minGap <= width || position === TIME_UNITS.length - 1) return starts.map((index) => ({ index, label: formatTick(times[index], zoned[index], zoned[index - 1], unit, formats) }));
	}
	return [];
}
