<script lang="ts">
	import { DatePicker } from "#lib/components/ui/date-picker/index.js";
	import type { DateRange } from "#lib/components/ui/calendar/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { CalendarClockIcon } from "@lucide/svelte";

	const { section = "preview" }: Props = $props();
	const today = new Date();
	let date: Date | undefined = $state();
	let range: DateRange | undefined = $state({ from: today, to: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7) });
	let birthday: Date | undefined = $state();
	let submitted = $state("nothing yet");
	let pinnedDate: Date | undefined = $state();
	let open = $state(false);
	let dueDate: Date | undefined = $state();
	const sizes = ["xs", "sm", "md", "lg"] as const;
	const roundedValues = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"] as const;

	/** Shows the submitted form data instead of sending it. */
	const handleSubmit = (e: SubmitEvent & { currentTarget: HTMLFormElement }) => {
		e.preventDefault();
		submitted = String(new FormData(e.currentTarget).get("due") ?? "none");
	};

	/** Live preview for one section of the date picker docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "behavior" | "range" | "dropdown" | "form" | "disabled" | "sizes" | "rounded" | "trigger";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Single date, used at the top of the page. -->
		<DatePicker bind:value={date} />
	{:else if section === "behavior"}
		<!-- Stays open after a pick, with a custom format and the open state shown. -->
		<DatePicker bind:value={pinnedDate} bind:open closeOnSelect={false} formatOptions={{ weekday: "short", month: "short", day: "numeric" }} />
		<p class="demoText">Open: {open ? "yes" : "no"}</p>
	{:else if section === "range"}
		<!-- Range across two months. -->
		<DatePicker mode="range" bind:value={range} numberOfMonths={2} placeholder="Pick a date range" formatOptions={{ month: "short", day: "numeric", year: "numeric" }} />
	{:else if section === "dropdown"}
		<!-- Date of birth with month and year selects. -->
		<DatePicker bind:value={birthday} captionLayout="dropdown" max={today} placeholder="Date of birth" />
	{:else if section === "form"}
		<!-- Submits the picked date under its name. -->
		<form class="demoForm" onsubmit={handleSubmit}>
			<DatePicker name="due" placeholder="Due date" />
			<Button type="submit" size="sm">Submit</Button>
		</form>
		<p class="demoText">Submitted: {submitted}</p>
	{:else if section === "disabled"}
		<!-- Disabled button that does not open. -->
		<DatePicker value={today} disabled />
	{:else if section === "sizes"}
		<!-- Each size of the button and calendar. -->
		{#each sizes as size (size)}
			<DatePicker {size} placeholder="Size {size}" />
		{/each}
	{:else if section === "rounded"}
		<!-- Each rounded value, with the calendar aligned to the button's end. -->
		{#each roundedValues as rounded (rounded)}
			<DatePicker {rounded} align="end" placeholder="Rounded {rounded}" />
		{/each}
	{:else if section === "trigger"}
		<!-- Ghost button that shows the picked date in place of the default button. -->
		<DatePicker bind:value={dueDate}>
			{#snippet trigger({ props, label })}
				<Button variant="ghost" {...props}>
					<CalendarClockIcon />
					{label || "Set due date"}
				</Button>
			{/snippet}
		</DatePicker>
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

	.demoForm {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--spacing-sm);
	}

	.demoText {
		margin: 0;
		color: var(--muted-foreground);
		font-size: var(--text-sm);
	}
</style>
