<script lang="ts">
	import { Toggle } from "#lib/components/ui/toggle/index.js";
	import { BoldIcon, ItalicIcon, BookmarkIcon } from "@lucide/svelte";

	const { section = "preview" }: Props = $props();
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	const roundedValues: UiRounded[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"];
	let isBookmarked = $state(false);

	/** Live preview for one section of the toggle docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "outline" | "text" | "controlled" | "disabled" | "sizes" | "rounded";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Icon toggle used at the top of the page. -->
		<Toggle aria-label="Toggle bold"><BoldIcon /></Toggle>
	{:else if section === "outline"}
		<!-- Bordered toggles. -->
		<Toggle variant="outline" aria-label="Toggle bold"><BoldIcon /></Toggle>
		<Toggle variant="outline" aria-label="Toggle italic"><ItalicIcon /></Toggle>
	{:else if section === "text"}
		<!-- Icon with a text label. -->
		<Toggle variant="outline"><ItalicIcon />Italic</Toggle>
	{:else if section === "controlled"}
		<!-- Bound pressed state. -->
		<Toggle variant="outline" bind:pressed={isBookmarked}><BookmarkIcon />{isBookmarked ? "Bookmarked" : "Bookmark"}</Toggle>
	{:else if section === "disabled"}
		<!-- Disabled toggles block interaction. -->
		<Toggle disabled aria-label="Toggle bold"><BoldIcon /></Toggle>
		<Toggle variant="outline" defaultPressed disabled aria-label="Toggle italic"><ItalicIcon /></Toggle>
	{:else if section === "sizes"}
		<!-- One toggle per size; the radius follows the size. -->
		{#each sizes as size (size)}
			<Toggle variant="outline" {size} aria-label="Toggle bold, size {size}"><BoldIcon /></Toggle>
		{/each}
	{:else if section === "rounded"}
		<!-- Each rounded value overriding the size radius. -->
		{#each roundedValues as rounded (rounded)}
			<Toggle variant="outline" {rounded} defaultPressed aria-label="Toggle bold, rounded {rounded}"><BoldIcon /></Toggle>
		{/each}
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--spacing-sm);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 1rem 0;
	}
</style>
