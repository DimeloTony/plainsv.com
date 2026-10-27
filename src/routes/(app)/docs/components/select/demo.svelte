<script lang="ts">
	import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem, SelectSeparator, type SelectProps } from "#lib/components/ui/select/index.js";
	import { Label } from "#lib/components/ui/label/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { ChevronsUpDownIcon } from "@lucide/svelte";

	const { section = "preview" }: Props = $props();
	const variants: SelectProps["variant"][] = ["default", "secondary", "ghost"];
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	const roundedValues: UiRounded[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"];
	const timezones = ["Pacific/Honolulu", "America/Anchorage", "America/Los_Angeles", "America/Denver", "America/Chicago", "America/New_York", "America/Sao_Paulo", "Atlantic/Azores", "Europe/London", "Europe/Paris", "Europe/Athens", "Europe/Moscow", "Asia/Dubai", "Asia/Karachi", "Asia/Kolkata", "Asia/Dhaka", "Asia/Bangkok", "Asia/Shanghai", "Asia/Tokyo", "Australia/Sydney", "Pacific/Auckland"];
	let fruit = $state("banana");
	let submitted = $state("");

	/** Shows the submitted form value instead of sending the form. */
	const handleSubmit = (e: SubmitEvent & { currentTarget: HTMLFormElement }) => {
		e.preventDefault();
		submitted = String(new FormData(e.currentTarget).get("fruit"));
	};

	/** Live preview for one section of the select docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "scrollable" | "controlled" | "form" | "variants" | "sizes" | "rounded" | "disabled" | "trigger";
	}
</script>

<!-- Fruits and vegetables in two labeled groups, reused by the style sections. -->
{#snippet produceSelect(props: Omit<SelectProps, "children">)}
	<Select {...props}>
		<SelectTrigger style="width: 11.25rem">
			<SelectValue placeholder="Select a fruit" />
		</SelectTrigger>
		<SelectContent>
			<SelectGroup>
				<SelectLabel>Fruits</SelectLabel>
				<SelectItem value="apple">Apple</SelectItem>
				<SelectItem value="banana">Banana</SelectItem>
				<SelectItem value="blueberry">Blueberry</SelectItem>
			</SelectGroup>
			<SelectSeparator />
			<SelectGroup>
				<SelectLabel>Vegetables</SelectLabel>
				<SelectItem value="carrot">Carrot</SelectItem>
				<SelectItem value="spinach">Spinach</SelectItem>
			</SelectGroup>
		</SelectContent>
	</Select>
{/snippet}

<div class="demo">
	{#if section === "preview"}
		<!-- Grouped select used at the top of the page. -->
		{@render produceSelect({})}
	{:else if section === "scrollable"}
		<!-- Long list that scrolls inside the available space. -->
		<Select>
			<SelectTrigger style="width: 17.5rem">
				<SelectValue placeholder="Select a timezone" />
			</SelectTrigger>
			<SelectContent>
				{#each timezones as timezone (timezone)}
					<SelectItem value={timezone}>{timezone.replace("_", " ")}</SelectItem>
				{/each}
			</SelectContent>
		</Select>
	{:else if section === "controlled"}
		<!-- Select bound to state that the text below reads. -->
		<Select bind:value={fruit}>
			<SelectTrigger style="width: 11.25rem">
				<SelectValue placeholder="Select a fruit" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="apple">Apple</SelectItem>
				<SelectItem value="banana">Banana</SelectItem>
				<SelectItem value="blueberry">Blueberry</SelectItem>
			</SelectContent>
		</Select>
		<p class="demoValue">Selected value: {fruit || "none"}</p>
	{:else if section === "form"}
		<!-- Required select linked to a label, submitted with a form. -->
		<form class="demoForm" onsubmit={handleSubmit}>
			<Label for="demoSelectFruit">Favorite fruit</Label>
			<Select name="fruit" required>
				<SelectTrigger id="demoSelectFruit" style="width: 11.25rem">
					<SelectValue placeholder="Select a fruit" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="apple">Apple</SelectItem>
					<SelectItem value="banana">Banana</SelectItem>
					<SelectItem value="blueberry">Blueberry</SelectItem>
				</SelectContent>
			</Select>
			<Button type="submit" size="sm">Submit</Button>
			<p class="demoValue">Submitted: {submitted || "nothing yet"}</p>
		</form>
	{:else if section === "variants"}
		<!-- One select per visual style. -->
		{#each variants as variant (variant)}
			{@render produceSelect({ variant })}
		{/each}
	{:else if section === "sizes"}
		<!-- One select per size; the radius follows the size. -->
		{#each sizes as size (size)}
			{@render produceSelect({ size })}
		{/each}
	{:else if section === "rounded"}
		<!-- Each rounded value overriding the size radius. -->
		{#each roundedValues as rounded (rounded)}
			{@render produceSelect({ rounded })}
		{/each}
	{:else if section === "disabled"}
		<!-- A disabled select, and a select with one disabled item. -->
		{@render produceSelect({ disabled: true })}
		<Select>
			<SelectTrigger style="width: 11.25rem">
				<SelectValue placeholder="Select a fruit" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="apple">Apple</SelectItem>
				<SelectItem value="banana" disabled>Banana</SelectItem>
				<SelectItem value="blueberry">Blueberry</SelectItem>
			</SelectContent>
		</Select>
	{:else if section === "trigger"}
		<!-- Ghost button that holds the value in place of the default trigger. -->
		<Select defaultValue="apple">
			<SelectTrigger>
				{#snippet trigger({ props })}
					<Button variant="ghost" {...props}>
						<SelectValue placeholder="Select a fruit" />
						<ChevronsUpDownIcon />
					</Button>
				{/snippet}
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="apple">Apple</SelectItem>
				<SelectItem value="banana">Banana</SelectItem>
				<SelectItem value="blueberry">Blueberry</SelectItem>
			</SelectContent>
		</Select>
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--spacing-md);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 1rem 0;
	}

	.demoForm {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--spacing-sm);
	}

	.demoValue {
		margin: 0;
		width: 100%;
		color: var(--muted-foreground);
		font-size: var(--text-sm);
	}
</style>
