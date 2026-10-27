<script lang="ts">
	import { RadioGroup, RadioGroupItem, type RadioGroupProps } from "#lib/components/ui/radio-group/index.js";
	import { Label } from "#lib/components/ui/label/index.js";
	import { Button } from "#lib/components/ui/button/index.js";

	const { section = "preview" }: Props = $props();
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	const options = [
		{ value: "default", label: "Default" },
		{ value: "comfortable", label: "Comfortable" },
		{ value: "compact", label: "Compact" },
	];
	let plan = $state("monthly");
	let submitted = $state("nothing yet");

	/** Shows the submitted form data instead of sending it. */
	const handleSubmit = (e: SubmitEvent & { currentTarget: HTMLFormElement }) => {
		e.preventDefault();
		submitted = String(new FormData(e.currentTarget).get("notify") ?? "none");
	};

	/** Live preview for one section of the radio group docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "controlled" | "horizontal" | "form" | "disabled" | "sizes";
	}
</script>

<!-- Three labeled options, reused by most sections. -->
{#snippet basicGroup(props: Omit<RadioGroupProps, "children">, idPrefix: string)}
	<RadioGroup defaultValue="comfortable" {...props}>
		{#each options as option (option.value)}
			<div class="demoOption">
				<RadioGroupItem value={option.value} id="{idPrefix}-{option.value}" />
				<Label for="{idPrefix}-{option.value}" size={props.size}>{option.label}</Label>
			</div>
		{/each}
	</RadioGroup>
{/snippet}

<div class="demo">
	{#if section === "preview"}
		<!-- Default group used at the top of the page. -->
		{@render basicGroup({}, "preview")}
	{:else if section === "controlled"}
		<!-- Bound value with a button that changes it from outside. -->
		<RadioGroup bind:value={plan}>
			<div class="demoOption"><RadioGroupItem value="monthly" id="plan-monthly" /><Label for="plan-monthly">Monthly</Label></div>
			<div class="demoOption"><RadioGroupItem value="yearly" id="plan-yearly" /><Label for="plan-yearly">Yearly</Label></div>
		</RadioGroup>
		<p class="demoText">Plan: {plan}</p>
		<Button variant="outline" size="sm" onclick={() => (plan = plan === "monthly" ? "yearly" : "monthly")}>Switch plan</Button>
	{:else if section === "horizontal"}
		<!-- Items in a row. -->
		{@render basicGroup({ orientation: "horizontal" }, "horizontal")}
	{:else if section === "form"}
		<!-- Submits the checked value under its name. -->
		<form class="demoForm" onsubmit={handleSubmit}>
			<RadioGroup name="notify" defaultValue="mentions">
				<div class="demoOption"><RadioGroupItem value="all" id="notify-all" /><Label for="notify-all">All new messages</Label></div>
				<div class="demoOption"><RadioGroupItem value="mentions" id="notify-mentions" /><Label for="notify-mentions">Direct messages and mentions</Label></div>
				<div class="demoOption"><RadioGroupItem value="none" id="notify-none" /><Label for="notify-none">Nothing</Label></div>
			</RadioGroup>
			<Button type="submit" size="sm">Submit</Button>
		</form>
		<p class="demoText">Submitted: {submitted}</p>
	{:else if section === "disabled"}
		<!-- One disabled item, then a disabled group. -->
		<RadioGroup defaultValue="default">
			<div class="demoOption"><RadioGroupItem value="default" id="disabled-default" /><Label for="disabled-default">Default</Label></div>
			<div class="demoOption"><RadioGroupItem value="pro" id="disabled-pro" disabled /><Label for="disabled-pro">Pro (unavailable)</Label></div>
		</RadioGroup>
		{@render basicGroup({ disabled: true }, "disabled-group")}
	{:else if section === "sizes"}
		<!-- One group per size. -->
		<div class="demoRow">
			{#each sizes as size (size)}
				{@render basicGroup({ size }, `size-${size}`)}
			{/each}
		</div>
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--spacing-lg);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 1rem 0;
	}

	.demoOption {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
	}

	.demoForm {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--spacing-lg);
	}

	.demoRow {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-xl);
	}

	.demoText {
		margin: 0;
		color: var(--muted-foreground);
		font-size: var(--text-sm);
	}
</style>
