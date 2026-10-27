<script lang="ts">
	import { Spinner, type SpinnerProps } from "#lib/components/ui/spinner/index.js";
	import { Button } from "#lib/components/ui/button/index.js";

	const { section = "preview" }: Props = $props();
	const variants: SpinnerProps["variant"][] = ["default", "destructive"];
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];

	/** Live preview for one section of the spinner docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "button" | "variants" | "sizes";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Default spinner used at the top of the page. -->
		<Spinner />
	{:else if section === "button"}
		<!-- Spinners take the button's text color. -->
		<Button disabled><Spinner />Saving</Button>
		<Button variant="outline" disabled><Spinner />Please wait</Button>
		<Button size="sm" variant="secondary" disabled><Spinner size="sm" />Processing</Button>
	{:else if section === "variants"}
		<!-- One spinner per color. -->
		{#each variants as variant (variant)}
			<Spinner {variant} />
		{/each}
	{:else if section === "sizes"}
		<!-- One spinner per size. -->
		{#each sizes as size (size)}
			<Spinner {size} />
		{/each}
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--spacing-lg);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 1rem 0;
	}
</style>
