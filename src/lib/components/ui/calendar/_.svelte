<script lang="ts" generics="M extends CalendarMode = 'single'">
	import { tick } from "svelte";
	import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from "@lucide/svelte";
	import { startOfDay, startOfMonth, addDays, addMonths, compareDays, isSameDay, isSameMonth, toDateKey, getWeekColumn, getMonthWeeks, getWeekdays, getMonthNames, addToRange, toggleDate } from "./utils.js";
	import type { Props, CalendarMode, CalendarModeValue, CalendarValue, DateRange } from "./index.js";
	let { mode: modeProp, value = $bindable(), month = $bindable(startOfMonth(getFirstSelected() ?? new Date())), onValueChange, onMonthChange, numberOfMonths = 1, weekStartsOn = 0, showOutsideDays = true, fixedWeeks = false, captionLayout = "label", min, max, isDateDisabled, locale, variant = "default", size = "md", rounded = "lg", class: className, ...props }: Props<M> = $props();
	// `single` is the default selection mode.
	const mode = $derived(modeProp ?? "single");
	// The value shape follows the generic `mode`, so it is read through the type every mode shares.
	const currentValue: CalendarValue = $derived(value);
	const today = startOfDay(new Date());
	let rootEl: HTMLDivElement | undefined = $state();
	// Day the user last moved to with the keyboard or picked; it holds the single tab stop.
	let focusedDate: Date | undefined = $state();
	const firstMonth = $derived(startOfMonth(month));
	const months = $derived(Array.from({ length: numberOfMonths }, (_, index) => addMonths(firstMonth, index)));
	const lastMonth = $derived(months[months.length - 1]);
	const weekdays = $derived(getWeekdays(weekStartsOn, locale));
	const monthNames = $derived(getMonthNames(locale));
	const captionFormat = $derived(new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }));
	const dayLabelFormat = $derived(new Intl.DateTimeFormat(locale, { dateStyle: "full" }));
	// Without bounds, the year dropdown offers the last hundred years and the next ten.
	const firstYear = $derived(min?.getFullYear() ?? today.getFullYear() - 100);
	const lastYear = $derived(max?.getFullYear() ?? today.getFullYear() + 10);
	const years = $derived(Array.from({ length: lastYear - firstYear + 1 }, (_, index) => firstYear + index));
	const isPrevDisabled = $derived(!!min && compareDays(addDays(firstMonth, -1), min) < 0);
	const isNextDisabled = $derived(!!max && compareDays(addMonths(startOfMonth(lastMonth), 1), max) > 0);
	// Outside days repeat the next or previous month when several are shown, so only a single month styles them as selected.
	const showsOutsideState = $derived(numberOfMonths === 1);
	const range = $derived(mode === "range" && currentValue && !(currentValue instanceof Date) && !Array.isArray(currentValue) ? currentValue : undefined);
	const selectedDates = $derived(currentValue instanceof Date ? [currentValue] : Array.isArray(currentValue) ? currentValue : []);
	// The keyboard focus target: the last focused day, else a selected day, else today, else the first day that can be picked.
	const tabStopDate = $derived.by(() => {
		const candidates = [focusedDate, range?.from, ...selectedDates, today].filter((date) => date && isVisible(date) && !isDisabled(date));
		if (candidates[0]) return candidates[0];
		for (let date = firstMonth; isSameMonth(date, firstMonth); date = addDays(date, 1)) {
			if (!isDisabled(date)) return date;
		}
	});

	// Function declarations are hoisted, so the props and derived values above can use them.

	/** Returns the first selected date, used to pick the starting month. */
	function getFirstSelected() {
		// The props are still being read here, so the value is widened locally instead of through `currentValue`.
		const initial: CalendarValue = value;
		if (initial instanceof Date) return initial;
		if (Array.isArray(initial)) return initial[0];
		return initial?.from;
	}

	/** Whether the date falls in one of the shown months. */
	function isVisible(date: Date) {
		return months.some((shownMonth) => isSameMonth(date, shownMonth));
	}

	/** Whether the date is outside the bounds or disabled by the passed check. */
	function isDisabled(date: Date) {
		if (min && compareDays(date, min) < 0) return true;
		if (max && compareDays(date, max) > 0) return true;
		return !!isDateDisabled?.(date);
	}

	/** Whether the date is selected, or is the start or end of the range. */
	function isSelected(date: Date) {
		if (mode === "range") return isSameDay(date, range?.from) || isSameDay(date, range?.to);
		return selectedDates.some((selected) => isSameDay(selected, date));
	}

	/** Returns where the date sits in the range, for the band behind the days. */
	function getRangePosition(date: Date) {
		// If no range is started: the date is not part of one.
		if (!range?.from) return {};
		const isStart = isSameDay(date, range.from);
		// While the end is not picked, the start also closes the band.
		const isEnd = range.to ? isSameDay(date, range.to) : isStart;
		const isMiddle = !!range.to && compareDays(date, range.from) > 0 && compareDays(date, range.to) < 0;
		return { isStart, isEnd, isMiddle };
	}

	/** Shows a new first month, kept inside `min` and `max`, and reports the change. */
	function setMonth(nextMonth: Date) {
		let next = startOfMonth(nextMonth);
		// If the last shown month would pass `max`: show the months that end at `max`.
		if (max && compareDays(addMonths(next, numberOfMonths - 1), startOfMonth(max)) > 0) next = addMonths(startOfMonth(max), -(numberOfMonths - 1));
		// If the first month would start before `min`: start at the month of `min`.
		if (min && compareDays(next, startOfMonth(min)) < 0) next = startOfMonth(min);
		// If the month did not change: skip the update.
		if (isSameDay(next, firstMonth)) return;
		month = next;
		onMonthChange?.(next);
	}

	/** Picks a date by the rules of the current mode and reports the new value. */
	function selectDate(date: Date) {
		let next: CalendarValue;
		if (mode === "range") next = addToRange(range, date);
		else if (mode === "multiple") next = toggleDate(selectedDates, date);
		else next = date;
		// The value shape follows the generic `mode`, which a runtime check cannot narrow, so it is cast once here.
		const nextValue = next as CalendarModeValue<M>;
		value = nextValue;
		focusedDate = date;
		onValueChange?.(nextValue);
	}

	/** Whether a month option leaves the bounds for the given year. */
	function isMonthOutOfBounds(year: number, monthIndex: number) {
		if (min && compareDays(new Date(year, monthIndex + 1, 0), min) < 0) return true;
		return !!max && compareDays(new Date(year, monthIndex, 1), max) > 0;
	}

	/** Moves focus between days with the arrow keys, Home, End, Page Up, and Page Down. */
	async function handleGridKeydown(e: KeyboardEvent) {
		const current = tabStopDate;
		// If no day can take focus: leave the key alone.
		if (!current) return;
		const column = getWeekColumn(current, weekStartsOn);
		const keyMoves: Record<string, () => Date> = {
			ArrowLeft: () => addDays(current, -1),
			ArrowRight: () => addDays(current, 1),
			ArrowUp: () => addDays(current, -7),
			ArrowDown: () => addDays(current, 7),
			Home: () => addDays(current, -column),
			End: () => addDays(current, 6 - column),
			// Shift moves by a year instead of a month.
			PageUp: () => addMonths(current, e.shiftKey ? -12 : -1),
			PageDown: () => addMonths(current, e.shiftKey ? 12 : 1),
		};
		const move = keyMoves[e.key];
		// If the key does not move between days: let it through, so Enter and Space click the day.
		if (!move) return;
		e.preventDefault();
		let next = move();
		// Skip disabled days in the direction of travel, up to a year away.
		const step = compareDays(next, current) < 0 ? -1 : 1;
		for (let count = 0; count < 366 && isDisabled(next); count++) next = addDays(next, step);
		// If every day that way is disabled: keep focus where it is.
		if (isDisabled(next)) return;
		focusedDate = next;
		// If the day is outside the shown months: navigate so it is shown.
		if (compareDays(next, firstMonth) < 0) setMonth(next);
		else if (compareDays(next, addMonths(startOfMonth(lastMonth), 1)) >= 0) setMonth(addMonths(startOfMonth(next), -(numberOfMonths - 1)));
		// Wait for the new tab stop to render, then focus it.
		await tick();
		rootEl?.querySelector<HTMLButtonElement>(`[data-day="${toDateKey(next)}"]:not([data-outside])`)?.focus();
	}
</script>

<!-- Month grids with one pair of navigation buttons over the captions. -->
<div bind:this={rootEl} class={["calendar not-typeset", className]} data-mode={mode} data-variant={variant} data-size={size} data-rounded={rounded} {...props}>
	<div class="calendarNav">
		<button type="button" class="calendarNavButton" aria-label="Go to the previous month" disabled={isPrevDisabled} onclick={() => setMonth(addMonths(firstMonth, -1))}>
			<ChevronLeftIcon />
		</button>
		<button type="button" class="calendarNavButton" aria-label="Go to the next month" disabled={isNextDisabled} onclick={() => setMonth(addMonths(firstMonth, 1))}>
			<ChevronRightIcon />
		</button>
	</div>

	<div class="calendarMonths">
		{#each months as shownMonth, monthIndex (toDateKey(shownMonth))}
			{@const caption = captionFormat.format(shownMonth)}
			<div class="calendarMonth">
				<!-- Month and year as text, or as selects that jump to another month. -->
				<div class="calendarCaption">
					{#if captionLayout === "dropdown"}
						<span class="calendarDropdown">
							<select aria-label="Choose the month" value={shownMonth.getMonth()} onchange={(e) => setMonth(new Date(shownMonth.getFullYear(), Number(e.currentTarget.value) - monthIndex, 1))}>
								{#each monthNames as monthName, optionIndex (optionIndex)}
									<option value={optionIndex} disabled={isMonthOutOfBounds(shownMonth.getFullYear(), optionIndex)}>{monthName}</option>
								{/each}
							</select>
							<ChevronDownIcon />
						</span>
						<span class="calendarDropdown">
							<select aria-label="Choose the year" value={shownMonth.getFullYear()} onchange={(e) => setMonth(new Date(Number(e.currentTarget.value), shownMonth.getMonth() - monthIndex, 1))}>
								{#each years as year (year)}
									<option value={year}>{year}</option>
								{/each}
							</select>
							<ChevronDownIcon />
						</span>
					{:else}
						<span aria-live="polite">{caption}</span>
					{/if}
				</div>

				<!-- Day grid; one day at a time is in the tab order, and the arrow keys move between days. -->
				<table class="calendarGrid" role="grid" aria-label={caption} onkeydown={handleGridKeydown}>
					<thead class="calendarRows">
						<tr class="calendarRow">
							{#each weekdays as weekday (weekday.long)}
								<th class="calendarWeekday" scope="col" abbr={weekday.long}>{weekday.short}</th>
							{/each}
						</tr>
					</thead>
					<tbody class="calendarRows">
						{#each getMonthWeeks(shownMonth, weekStartsOn, fixedWeeks) as week (toDateKey(week[0]))}
							<tr class="calendarRow">
								{#each week as date (toDateKey(date))}
									{@const isOutside = !isSameMonth(date, shownMonth)}
									{@const showsState = !isOutside || showsOutsideState}
									{@const isDaySelected = showsState && isSelected(date)}
									{@const rangePosition = showsState ? getRangePosition(date) : {}}
									<td class="calendarDay" aria-selected={isDaySelected} data-range-start={rangePosition.isStart || undefined} data-range-end={rangePosition.isEnd || undefined} data-range-middle={rangePosition.isMiddle || undefined}>
										<!-- Hidden outside days keep their cell so the columns stay aligned. -->
										{#if !isOutside || showOutsideDays}
											<button type="button" class="calendarDayButton" tabindex={!isOutside && isSameDay(date, tabStopDate) ? 0 : -1} aria-label={dayLabelFormat.format(date)} aria-current={isSameDay(date, today) ? "date" : undefined} disabled={isDisabled(date)} data-day={toDateKey(date)} data-outside={isOutside || undefined} data-today={isSameDay(date, today) || undefined} data-selected={isDaySelected || undefined} data-range-middle={rangePosition.isMiddle || undefined} onclick={() => selectDate(date)}>
												{date.getDate()}
											</button>
										{/if}
									</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/each}
	</div>
</div>

<style>
	/* Base calendar; the day size and spacing come from the size rules */
	.calendar {
		display: flex;
		position: relative;
		flex-direction: column;
		box-sizing: border-box;
		padding: var(--calendar-padding);
		width: fit-content;
		color: var(--foreground);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Previous and next buttons sit over the first and last captions */
	.calendarNav {
		display: flex;
		position: absolute;
		top: var(--calendar-padding);
		right: var(--calendar-padding);
		left: var(--calendar-padding);
		justify-content: space-between;
		pointer-events: none;
	}

	.calendarNavButton,
	.calendarDayButton {
		display: flex;
		justify-content: center;
		align-items: center;
		transition-duration: 150ms;
		transition-property: color, background-color, box-shadow, opacity;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		cursor: pointer;
		outline: none;
		border: 0;
		border-radius: var(--calendar-day-radius);
		background-color: transparent;
		padding: 0;
		color: inherit;
		font: inherit;
	}

	.calendarNavButton {
		width: var(--calendar-cell);
		height: var(--calendar-cell);
		pointer-events: auto;
	}

	.calendarNavButton :global(svg) {
		width: calc(var(--calendar-cell) / 2);
		height: calc(var(--calendar-cell) / 2);
	}

	/* Months stack on narrow screens and sit side by side from 48rem */
	.calendarMonths {
		display: flex;
		flex-direction: column;
		gap: var(--calendar-gap);
	}

	@media (min-width: 48rem) {
		.calendarMonths {
			flex-direction: row;
		}
	}

	.calendarMonth {
		display: flex;
		flex-direction: column;
		gap: var(--calendar-gap);
	}

	/* Caption is as tall as a day, with room on both sides for the navigation buttons */
	.calendarCaption {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--spacing-xs);
		padding-inline: var(--calendar-cell);
		height: var(--calendar-cell);
		font-weight: 500;
	}

	/* Native select drawn as a bordered box with its own chevron */
	.calendarDropdown {
		display: inline-flex;
		position: relative;
		align-items: center;
		transition-duration: 150ms;
		transition-property: border-color, box-shadow;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 1px 2px 0 color-mix(in oklab, var(--foreground) 5%, transparent);
		border: 1px solid var(--input);
		border-radius: var(--calendar-day-radius);
	}

	.calendarDropdown select {
		appearance: none;
		cursor: pointer;
		outline: none;
		border: 0;
		background-color: transparent;
		padding-right: calc(var(--calendar-cell) / 2 + var(--spacing-xs));
		padding-left: var(--spacing-sm);
		height: calc(var(--calendar-cell) - 2px); /* minus the border */
		color: inherit;
		font: inherit;
	}

	.calendarDropdown select option {
		background-color: var(--popover);
		color: var(--popover-foreground);
	}

	.calendarDropdown :global(svg) {
		position: absolute;
		right: var(--spacing-xs);
		width: calc(var(--calendar-cell) / 2.5);
		height: calc(var(--calendar-cell) / 2.5);
		pointer-events: none;
		color: var(--muted-foreground);
	}

	/* Table rows laid out with flex, so the gap applies between weeks */
	.calendarGrid {
		display: flex;
		flex-direction: column;
		gap: calc(var(--calendar-gap) / 2);
		border-collapse: collapse;
	}

	.calendarRows {
		display: flex;
		flex-direction: column;
		gap: calc(var(--calendar-gap) / 2);
	}

	.calendarRow {
		display: flex;
	}

	.calendarWeekday {
		padding: 0;
		width: var(--calendar-cell);
		color: var(--muted-foreground);
		font-weight: 400;
		font-size: var(--text-xs);
	}

	/* The cell draws the range band; the button inside draws the day */
	.calendarDay {
		position: relative;
		padding: 0;
		width: var(--calendar-cell);
		height: var(--calendar-cell);
	}

	.calendarDayButton {
		width: 100%;
		height: 100%;
	}

	.calendarDayButton:hover {
		background-color: var(--accent);
		color: var(--accent-foreground);
	}

	/* Days from the months around the shown month */
	.calendarDayButton[data-outside] {
		color: var(--muted-foreground);
	}

	.calendarDayButton[data-today] {
		background-color: var(--accent);
		color: var(--accent-foreground);
	}

	/* =============== States =============== */

	/* Range band behind the start, middle, and end days */
	.calendarDay[data-range-start],
	.calendarDay[data-range-middle],
	.calendarDay[data-range-end] {
		background-color: var(--accent);
	}

	.calendarDay[data-range-start] {
		border-top-left-radius: var(--calendar-day-radius);
		border-bottom-left-radius: var(--calendar-day-radius);
	}

	.calendarDay[data-range-end] {
		border-top-right-radius: var(--calendar-day-radius);
		border-bottom-right-radius: var(--calendar-day-radius);
	}

	.calendarDayButton[data-range-middle] {
		background-color: transparent;
		color: var(--accent-foreground);
	}

	/* Selected days, and the start and end of a range */
	.calendarDayButton[data-selected] {
		background-color: var(--primary);
		color: var(--primary-foreground);
	}

	/* Keyboard focus ring; raised so the next day does not cover it */
	.calendarNavButton:focus-visible,
	.calendarDayButton:focus-visible {
		position: relative;
		z-index: 1;
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
	}

	.calendarDropdown:focus-within {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
		border-color: var(--ring);
	}

	/* Disabled navigation and days */
	.calendarNavButton:disabled,
	.calendarDayButton:disabled {
		opacity: 50%;
		pointer-events: none;
	}

	/* =============== Variants =============== */

	.calendar[data-variant="default"] {
		border: 1px solid var(--border);
	}

	/* =============== Sizes =============== */

	/* Large */
	.calendar[data-size="lg"] {
		--calendar-cell: var(--control-height-md);
		--calendar-padding: var(--spacing-lg);
		--calendar-gap: var(--spacing-lg);
		--calendar-day-radius: var(--radius-md);
		border-radius: var(--radius-lg);
	}

	/* Medium — default */
	.calendar[data-size="md"] {
		--calendar-cell: var(--control-height-sm);
		--calendar-padding: var(--spacing-md);
		--calendar-gap: var(--spacing-lg);
		--calendar-day-radius: var(--radius-sm);
		border-radius: var(--radius-md);
	}

	/* Small */
	.calendar[data-size="sm"] {
		--calendar-cell: 1.75rem; /* 28px */
		--calendar-padding: var(--spacing-sm);
		--calendar-gap: var(--spacing-md);
		--calendar-day-radius: var(--radius-xs);
		border-radius: var(--radius-sm);
	}

	/* Extra small */
	.calendar[data-size="xs"] {
		--calendar-cell: var(--control-height-xs);
		--calendar-padding: var(--spacing-sm);
		--calendar-gap: var(--spacing-sm);
		--calendar-day-radius: var(--radius-xs);
		border-radius: var(--radius-xs);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius; must stay after the size rules. Days use one step smaller so the corners nest */
	.calendar[data-rounded="xs"] {
		--calendar-day-radius: var(--radius-xs);
		border-radius: var(--radius-xs);
	}

	.calendar[data-rounded="sm"] {
		--calendar-day-radius: var(--radius-xs);
		border-radius: var(--radius-sm);
	}

	.calendar[data-rounded="md"] {
		--calendar-day-radius: var(--radius-sm);
		border-radius: var(--radius-md);
	}

	.calendar[data-rounded="lg"] {
		--calendar-day-radius: var(--radius-md);
		border-radius: var(--radius-lg);
	}

	.calendar[data-rounded="xl"] {
		--calendar-day-radius: var(--radius-lg);
		border-radius: var(--radius-xl);
	}

	.calendar[data-rounded="2xl"] {
		--calendar-day-radius: var(--radius-xl);
		border-radius: var(--radius-2xl);
	}

	.calendar[data-rounded="3xl"] {
		--calendar-day-radius: var(--radius-2xl);
		border-radius: var(--radius-3xl);
	}

	.calendar[data-rounded="4xl"] {
		--calendar-day-radius: var(--radius-3xl);
		border-radius: var(--radius-4xl);
	}

	/* Days become circles and the calendar a true pill, which can clip the corner days; use 3xl or 4xl for a round box */
	.calendar[data-rounded="pill"] {
		--calendar-day-radius: var(--radius-pill);
		border-radius: var(--radius-pill);
	}
</style>
