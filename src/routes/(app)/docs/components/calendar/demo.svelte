<script lang="ts">
	import { Calendar, type DateRange } from "#lib/components/ui/calendar/index.js";
	import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "#lib/components/ui/card/index.js";

	const { section = "preview" }: Props = $props();
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	const roundedValues: UiRounded[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"];
	const today = new Date();
	const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });
	let date: Date | undefined = $state(today);
	let range: DateRange | undefined = $state({ from: today, to: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6) });
	let dates: Date[] = $state([]);
	let birthday: Date | undefined = $state();
	let shownMonth = $state(new Date(today.getFullYear(), today.getMonth(), 1));

	/** Whether the date falls on a Saturday or Sunday. */
	const isWeekend = (day: Date) => day.getDay() === 0 || day.getDay() === 6;

	/** Live preview for one section of the calendar docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "range" | "multiple" | "dropdown" | "disabled" | "month" | "week" | "card" | "sizes" | "rounded";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Single date bound to state, used at the top of the page. -->
		<Calendar bind:value={date} />
		<p class="demoText">Selected: {date ? dateFormat.format(date) : "none"}</p>
	{:else if section === "range"}
		<!-- Range across two months side by side. -->
		<Calendar mode="range" bind:value={range} numberOfMonths={2} />
		<p class="demoText">From {range?.from ? dateFormat.format(range.from) : "not set"} to {range?.to ? dateFormat.format(range.to) : "not set"}</p>
	{:else if section === "multiple"}
		<!-- Any number of dates; clicking one again removes it. -->
		<Calendar mode="multiple" bind:value={dates} />
		<p class="demoText">{dates.length} dates selected</p>
	{:else if section === "dropdown"}
		<!-- Month and year selects for dates far from today. -->
		<Calendar bind:value={birthday} captionLayout="dropdown" />
	{:else if section === "disabled"}
		<!-- Only weekdays from today through 60 days ahead can be picked. -->
		<Calendar min={today} max={new Date(today.getFullYear(), today.getMonth(), today.getDate() + 60)} isDateDisabled={isWeekend} />
	{:else if section === "month"}
		<!-- Shown month bound to state, with fixed weeks so the height stays the same. -->
		<Calendar bind:month={shownMonth} fixedWeeks />
		<p class="demoText">Showing {new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(shownMonth)}</p>
	{:else if section === "week"}
		<!-- Monday first with German month and weekday names. -->
		<Calendar weekStartsOn={1} locale="de-DE" />
	{:else if section === "card"}
		<!-- Ghost calendar inside a card, without its own border. -->
		<Card size="md" style="width: fit-content">
			<CardHeader>
				<CardTitle>Book a meeting</CardTitle>
				<CardDescription>Pick a day that works for you.</CardDescription>
			</CardHeader>
			<CardContent>
				<Calendar variant="ghost" style="padding: 0" />
			</CardContent>
		</Card>
	{:else if section === "sizes"}
		<!-- One calendar per size. -->
		<div class="demoRow">
			{#each sizes as size (size)}
				<Calendar {size} />
			{/each}
		</div>
	{:else if section === "rounded"}
		<!-- Each rounded value overriding the size radius; full turns the days into circles. -->
		<div class="demoRow">
			{#each roundedValues as rounded (rounded)}
				<Calendar {rounded} mode="range" value={range} />
			{/each}
		</div>
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--spacing-sm);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 1rem 0;
	}

	.demoRow {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: var(--spacing-md);
	}

	.demoText {
		margin: 0;
		color: var(--muted-foreground);
		font-size: var(--text-sm);
	}
</style>
