<script lang="ts">
	import { Checkbox, type CheckboxProps } from "#lib/components/ui/checkbox/index.js";
	import { Label } from "#lib/components/ui/label/index.js";

	const { section = "preview" }: Props = $props();
	const variants: CheckboxProps["variant"][] = ["default", "destructive"];
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	const roundedValues: UiRounded[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"];
	const toppings = ["Cheese", "Mushrooms", "Olives"];
	let isAccepted = $state(false);
	let selectedToppings = $state(["Cheese"]);
	const allSelected = $derived(selectedToppings.length === toppings.length);
	const someSelected = $derived(selectedToppings.length > 0 && !allSelected);

	/** Selects every topping, or clears them when all are already selected. */
	const toggleAll = (checked: boolean) => {
		selectedToppings = checked ? [...toppings] : [];
	};

	/** Adds or removes one topping from the selection. */
	const toggleTopping = (topping: string, checked: boolean) => {
		selectedToppings = checked ? [...selectedToppings, topping] : selectedToppings.filter((item) => item !== topping);
	};

	/** Live preview for one section of the checkbox docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "controlled" | "indeterminate" | "variants" | "sizes" | "rounded" | "states";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Checkbox linked to a label with `for`, used at the top of the page. -->
		<div class="demoField">
			<Checkbox id="demoTerms" />
			<Label for="demoTerms">Accept terms and conditions</Label>
		</div>
	{:else if section === "controlled"}
		<!-- Checkbox bound to state that the text below reads. -->
		<div class="demoField">
			<Checkbox id="demoAccepted" bind:checked={isAccepted} />
			<Label for="demoAccepted">Accept terms and conditions</Label>
		</div>
		<p class="demoValue">Terms are {isAccepted ? "accepted" : "not accepted"}.</p>
	{:else if section === "indeterminate"}
		<!-- Parent checkbox that shows the mixed state while only some toppings are selected. -->
		<div class="demoField">
			<Checkbox id="demoAllToppings" checked={allSelected} indeterminate={someSelected} onCheckedChange={toggleAll} />
			<Label for="demoAllToppings">All toppings</Label>
		</div>
		<div class="demoGroup">
			{#each toppings as topping (topping)}
				<div class="demoField">
					<Checkbox id="demoTopping{topping}" checked={selectedToppings.includes(topping)} onCheckedChange={(checked) => toggleTopping(topping, checked)} />
					<Label for="demoTopping{topping}">{topping}</Label>
				</div>
			{/each}
		</div>
	{:else if section === "variants"}
		<!-- One checkbox per visual style, checked to show the color. -->
		{#each variants as variant (variant)}
			<div class="demoField">
				<Checkbox id="demoVariant{variant}" {variant} defaultChecked />
				<Label for="demoVariant{variant}">{variant}</Label>
			</div>
		{/each}
	{:else if section === "sizes"}
		<!-- One checkbox per size, each with a matching label size. -->
		{#each sizes as size (size)}
			<div class="demoField">
				<Checkbox id="demoSize{size}" {size} defaultChecked />
				<Label for="demoSize{size}" {size}>Size {size}</Label>
			</div>
		{/each}
	{:else if section === "rounded"}
		<!-- Each rounded value overriding the size radius. -->
		{#each roundedValues as rounded (rounded)}
			<div class="demoField">
				<Checkbox id="demoRounded{rounded}" size="lg" {rounded} defaultChecked />
				<Label for="demoRounded{rounded}">Rounded {rounded}</Label>
			</div>
		{/each}
	{:else if section === "states"}
		<!-- Disabled in both states, and invalid. -->
		<div class="demoField">
			<Checkbox id="demoDisabledOff" disabled />
			<Label for="demoDisabledOff">Disabled</Label>
		</div>
		<div class="demoField">
			<Checkbox id="demoDisabledOn" disabled defaultChecked />
			<Label for="demoDisabledOn">Disabled checked</Label>
		</div>
		<div class="demoField">
			<Checkbox id="demoInvalid" aria-invalid="true" />
			<Label for="demoInvalid">Invalid</Label>
		</div>
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 1rem 0;
	}

	.demoField {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
	}

	/* Child checkboxes sit indented under the parent */
	.demoGroup {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
		padding-left: var(--spacing-xl);
	}

	.demoValue {
		margin: 0;
		color: var(--muted-foreground);
		font-size: var(--text-sm);
	}
</style>
