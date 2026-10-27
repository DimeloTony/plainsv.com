<script lang="ts">
	import { Label } from "#lib/components/ui/label/index.js";
	import { Input } from "#lib/components/ui/input/index.js";
	import { MailIcon } from "@lucide/svelte";

	const { section = "preview" }: Props = $props();
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];

	/** Live preview for one section of the label docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "sizes" | "icons" | "disabled";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Label linked to an input with `for`. -->
		<div class="demoField">
			<Label for="demoEmail">Email</Label>
			<Input id="demoEmail" type="email" placeholder="m@example.com" />
		</div>
	{:else if section === "sizes"}
		<!-- One label per size, paired with an input of the same size. -->
		{#each sizes as size (size)}
			<div class="demoField">
				<Label {size} for="demoSize{size}">Size {size}</Label>
				<Input {size} id="demoSize{size}" placeholder="Size {size}" />
			</div>
		{/each}
	{:else if section === "icons"}
		<!-- Icon before the label text. -->
		<div class="demoField">
			<Label for="demoIcon"><MailIcon />Email</Label>
			<Input id="demoIcon" type="email" placeholder="m@example.com" />
		</div>
	{:else if section === "disabled"}
		<!-- Labels dim next to, or wrapped around, a disabled control. -->
		<div class="demoField">
			<Input id="demoDisabled" placeholder="Disabled" disabled />
			<Label for="demoDisabled">Follows a disabled input</Label>
		</div>
		<Label><input type="checkbox" disabled />Wraps a disabled checkbox</Label>
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

	.demoField {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		width: 100%;
		max-width: 20rem;
	}
</style>
