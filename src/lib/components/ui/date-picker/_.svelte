<script lang="ts" generics="M extends DatePickerMode = 'single'">
	import { CalendarIcon } from "@lucide/svelte";
	import { Button } from "#lib/components/ui/button/index.js";
	import { Calendar, type DateRange } from "#lib/components/ui/calendar/index.js";
	import { Popover, PopoverTrigger, PopoverContent } from "#lib/components/ui/popover/index.js";
	import { toDateKey } from "#lib/components/ui/calendar/utils.js";
	import type { Props, DatePickerMode, DatePickerValue } from "./index.js";
	let { mode: modeProp, value = $bindable(), onValueChange, open = $bindable(false), placeholder = "Pick a date", formatOptions = { dateStyle: "long" }, closeOnSelect = true, name, disabled = false, align = "start", size = "md", rounded, min, max, isDateDisabled, numberOfMonths, captionLayout, locale, weekStartsOn, fixedWeeks, showOutsideDays, trigger: customTrigger, class: className }: Props<M> = $props();
	// `single` is the default selection mode.
	const mode = $derived(modeProp ?? "single");
	// The value shape follows the generic `mode`, so it is read through the type both modes share.
	const currentValue: Date | DateRange | undefined = $derived(value);
	const dateFormat = $derived(new Intl.DateTimeFormat(locale, formatOptions));
	const singleValue = $derived(currentValue instanceof Date ? currentValue : undefined);
	const rangeValue = $derived(currentValue && !(currentValue instanceof Date) ? currentValue : undefined);
	// Text on the button: the date, the range, or the start of a range still being picked.
	const label = $derived.by(() => {
		if (singleValue) return dateFormat.format(singleValue);
		if (rangeValue?.from && rangeValue.to) return dateFormat.formatRange(rangeValue.from, rangeValue.to);
		if (rangeValue?.from) return `${dateFormat.format(rangeValue.from)} –`;
		return "";
	});
	// Dates submitted with a form, as `yyyy-mm-dd` in local time.
	const submittedDates = $derived([singleValue, rangeValue?.from, rangeValue?.to].filter((date) => date instanceof Date).map(toDateKey));

	/** Stores a picked date or range and reports it. */
	const emitChange = (next: Date | DateRange) => {
		// The value shape follows the generic `mode`, which a runtime check cannot narrow, so it is cast once here.
		const nextValue = next as DatePickerValue<M>;
		value = nextValue;
		onValueChange?.(nextValue);
	};

	/** Stores a picked date and closes the calendar when `closeOnSelect` is set. */
	const handleSingleChange = (next: Date) => {
		emitChange(next);
		if (closeOnSelect) open = false;
	};

	/** Stores a picked range, and closes the calendar once both ends are picked. */
	const handleRangeChange = (next: DateRange) => {
		emitChange(next);
		if (closeOnSelect && next.from && next.to) open = false;
	};
</script>

<!-- Outline button with the picked date; the calendar opens in a popover below it. -->
<div class="datePicker not-typeset">
	<Popover bind:open side="bottom" {align} {size} {rounded}>
		<PopoverTrigger>
			{#snippet trigger({ props })}
				<!-- Render the custom trigger when given, otherwise an outline button with the picked date. -->
				{#if customTrigger}
					{@render customTrigger({ props: { ...props, disabled }, label })}
				{:else}
					<Button variant="outline" {size} {rounded} class={className} data-empty={!label || undefined} {disabled} {...props}>
						<CalendarIcon />
						{label || placeholder}
					</Button>
				{/if}
			{/snippet}
		</PopoverTrigger>
		<PopoverContent style="width: auto; padding: 0">
			{#if mode === "range"}
				<Calendar mode="range" value={rangeValue} onValueChange={handleRangeChange} variant="ghost" {size} {rounded} {min} {max} {isDateDisabled} {numberOfMonths} {captionLayout} {locale} {weekStartsOn} {fixedWeeks} {showOutsideDays} />
			{:else}
				<Calendar value={singleValue} onValueChange={handleSingleChange} variant="ghost" {size} {rounded} {min} {max} {isDateDisabled} {numberOfMonths} {captionLayout} {locale} {weekStartsOn} {fixedWeeks} {showOutsideDays} />
			{/if}
		</PopoverContent>
	</Popover>

	<!-- Submit the date, or the start and end of the range, like native date inputs. -->
	{#if name}
		{#each submittedDates as date, index (index)}
			<input type="hidden" {name} value={date} />
		{/each}
	{/if}
</div>

<style>
	/* Wrapper; the button inside sets the width */
	.datePicker {
		display: inline-flex;
	}

	/* Text sits at the start of the button like an input */
	.datePicker > :global(.button) {
		justify-content: flex-start;
		min-width: 15rem; /* 240px */
		font-weight: 400;
	}

	/* The placeholder and icon are muted while no date is picked */
	.datePicker > :global(.button[data-empty]) {
		color: var(--muted-foreground);
	}
</style>
