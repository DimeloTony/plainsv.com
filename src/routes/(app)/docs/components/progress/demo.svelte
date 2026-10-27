<script lang="ts">
	import { Progress, type ProgressProps } from "#lib/components/ui/progress/index.js";

	const { section = "preview" }: Props = $props();
	const variants: ProgressProps["variant"][] = ["default", "destructive"];
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	const roundedValues: UiRounded[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"];
	let previewValue = $state(13);

	// Advance the preview after mount so the indicator transition is visible.
	$effect(() => {
		const timer = setTimeout(() => (previewValue = 66), 500);
		return () => clearTimeout(timer);
	});

	/** Live preview for one section of the progress docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "max" | "variants" | "sizes" | "rounded" | "indeterminate";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Progress that animates from 13 to 66, used at the top of the page. -->
		<Progress value={previewValue} aria-label="Upload progress" />
	{:else if section === "max"}
		<!-- Three of eight files, so the bar is three eighths full. -->
		<Progress value={3} max={8} aria-label="Files uploaded" />
	{:else if section === "variants"}
		<!-- One bar per visual style. -->
		{#each variants as variant (variant)}
			<Progress {variant} value={33} aria-label="{variant} progress" />
		{/each}
	{:else if section === "sizes"}
		<!-- One bar per size; the radius follows the size. -->
		{#each sizes as size (size)}
			<Progress {size} value={33} aria-label="Size {size} progress" />
		{/each}
	{:else if section === "rounded"}
		<!-- Each rounded value overriding the size radius. -->
		{#each roundedValues as rounded (rounded)}
			<Progress size="md" {rounded} value={33} aria-label="Rounded {rounded} progress" />
		{/each}
	{:else if section === "indeterminate"}
		<!-- No value, so the indicator sweeps across the track. -->
		<Progress aria-label="Loading" />
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 1rem 0;
	}
</style>
