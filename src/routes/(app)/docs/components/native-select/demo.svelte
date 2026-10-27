<script lang="ts">
	import { NativeSelect, NativeSelectOption, NativeSelectOptGroup } from "#lib/components/ui/native-select/index.js";

	const { section = "preview" }: Props = $props();
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	let status = $state("todo");

	/** Live preview for one section of the native select docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "groups" | "binding" | "sizes" | "rounded" | "states";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Status select used at the top of the page. -->
		<NativeSelect>
			<NativeSelectOption value="">Select status</NativeSelectOption>
			<NativeSelectOption value="todo">Todo</NativeSelectOption>
			<NativeSelectOption value="in-progress">In progress</NativeSelectOption>
			<NativeSelectOption value="done">Done</NativeSelectOption>
			<NativeSelectOption value="cancelled">Cancelled</NativeSelectOption>
		</NativeSelect>
	{:else if section === "groups"}
		<!-- Options grouped under labels. -->
		<NativeSelect>
			<NativeSelectOption value="">Select department</NativeSelectOption>
			<NativeSelectOptGroup label="Engineering">
				<NativeSelectOption value="frontend">Frontend</NativeSelectOption>
				<NativeSelectOption value="backend">Backend</NativeSelectOption>
			</NativeSelectOptGroup>
			<NativeSelectOptGroup label="Sales">
				<NativeSelectOption value="enterprise">Enterprise</NativeSelectOption>
				<NativeSelectOption value="partners">Partners</NativeSelectOption>
			</NativeSelectOptGroup>
		</NativeSelect>
	{:else if section === "binding"}
		<!-- Two-way bound value. -->
		<NativeSelect bind:value={status}>
			<NativeSelectOption value="todo">Todo</NativeSelectOption>
			<NativeSelectOption value="in-progress">In progress</NativeSelectOption>
			<NativeSelectOption value="done">Done</NativeSelectOption>
		</NativeSelect>
		<p class="demoText">Value: {status}</p>
	{:else if section === "sizes"}
		<!-- One select per size; the height matches the input of the same size. -->
		{#each sizes as size (size)}
			<NativeSelect {size}>
				<NativeSelectOption value="">Size {size}</NativeSelectOption>
			</NativeSelect>
		{/each}
	{:else if section === "rounded"}
		<!-- Each rounded value overriding the size radius. -->
		{#each ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"] as const as rounded (rounded)}
			<NativeSelect {rounded}>
				<NativeSelectOption value="">Rounded {rounded}</NativeSelectOption>
			</NativeSelect>
		{/each}
	{:else if section === "states"}
		<!-- Disabled and invalid states. -->
		<NativeSelect disabled>
			<NativeSelectOption value="">Disabled</NativeSelectOption>
		</NativeSelect>
		<NativeSelect aria-invalid="true">
			<NativeSelectOption value="">Invalid</NativeSelectOption>
		</NativeSelect>
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

	.demoText {
		margin: 0;
		color: var(--muted-foreground);
		font-size: var(--text-sm);
	}
</style>
