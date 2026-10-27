<script lang="ts">
	import { Switch, type SwitchProps } from "#lib/components/ui/switch/index.js";
	import { Label } from "#lib/components/ui/label/index.js";

	const { section = "preview" }: Props = $props();
	const variants: SwitchProps["variant"][] = ["default", "destructive"];
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	const roundedValues: UiRounded[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"];
	let isNotifying = $state(true);

	/** Live preview for one section of the switch docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "controlled" | "variants" | "sizes" | "rounded" | "states";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Switch linked to a label with `for`, used at the top of the page. -->
		<div class="demoField">
			<Switch id="demoAirplaneMode" />
			<Label for="demoAirplaneMode">Airplane mode</Label>
		</div>
	{:else if section === "controlled"}
		<!-- Switch bound to state that the text below reads. -->
		<div class="demoField">
			<Switch id="demoNotifications" bind:checked={isNotifying} />
			<Label for="demoNotifications">Notifications</Label>
		</div>
		<p class="demoValue">Notifications are {isNotifying ? "on" : "off"}.</p>
	{:else if section === "variants"}
		<!-- One switch per visual style, turned on to show the color. -->
		{#each variants as variant (variant)}
			<div class="demoField">
				<Switch id="demoVariant{variant}" {variant} defaultChecked />
				<Label for="demoVariant{variant}">{variant}</Label>
			</div>
		{/each}
	{:else if section === "sizes"}
		<!-- One switch per size; the radius follows the size. -->
		{#each sizes as size (size)}
			<div class="demoField">
				<Switch id="demoSize{size}" {size} defaultChecked />
				<Label for="demoSize{size}">Size {size}</Label>
			</div>
		{/each}
	{:else if section === "rounded"}
		<!-- Each rounded value overriding the size radius. -->
		{#each roundedValues as rounded (rounded)}
			<div class="demoField">
				<Switch id="demoRounded{rounded}" size="lg" {rounded} defaultChecked />
				<Label for="demoRounded{rounded}">Rounded {rounded}</Label>
			</div>
		{/each}
	{:else if section === "states"}
		<!-- Disabled in both positions, and invalid. -->
		<div class="demoField">
			<Switch id="demoDisabledOff" disabled />
			<Label for="demoDisabledOff">Disabled</Label>
		</div>
		<div class="demoField">
			<Switch id="demoDisabledOn" disabled defaultChecked />
			<Label for="demoDisabledOn">Disabled on</Label>
		</div>
		<div class="demoField">
			<Switch id="demoInvalid" aria-invalid="true" />
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

	.demoValue {
		margin: 0;
		color: var(--muted-foreground);
		font-size: var(--text-sm);
	}
</style>
