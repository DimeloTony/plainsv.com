<script lang="ts">
	import { FileTree, FileTreeIcon, type FileTreeProps } from "#lib/components/ui/file-tree/index.js";
	import { Badge } from "#lib/components/ui/badge/index.js";
	import { CircleDotIcon } from "@lucide/svelte";

	const { section = "preview" }: Props = $props();
	const files = ["src/routes/+layout.svelte", "src/routes/+page.svelte", "src/routes/about/+page.svelte", "src/lib/utils.ts", "src/app.css", "static/favicon.svg", "package.json", "README.md", "svelte.config.js"];
	const variants: FileTreeProps["variant"][] = ["default", "outline"];
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	const roundeds: UiRounded[] = ["sm", "lg", "2xl"];
	let value = $state("src/routes/+page.svelte");
	let expanded = $state(["src", "src/routes"]);

	/** Live preview for one section of the file tree docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "expanded" | "highlighted" | "variants" | "sizes" | "rounded" | "snippets";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Selectable tree used at the top of the page. -->
		<div class="demoColumn">
			<FileTree {files} bind:value variant="outline" class="demoTree" />
			<p>Selected: <code>{value || "none"}</code></p>
		</div>
	{:else if section === "expanded"}
		<!-- Open folders bound to state. -->
		<div class="demoColumn">
			<FileTree {files} bind:expanded variant="outline" class="demoTree" />
			<p>Open: <code>{expanded.join(", ") || "none"}</code></p>
		</div>
	{:else if section === "highlighted"}
		<!-- Search matches drawn with the highlight. -->
		<FileTree {files} highlighted={["src/routes/+page.svelte", "src/routes/about/+page.svelte"]} variant="outline" class="demoTree" />
	{:else if section === "variants"}
		<!-- One tree per variant. -->
		{#each variants as variant (variant)}
			<FileTree files={files.slice(0, 4)} {variant} class="demoTree" />
		{/each}
	{:else if section === "sizes"}
		<!-- One tree per size. -->
		{#each sizes as size (size)}
			<FileTree files={files.slice(0, 3)} {size} variant="outline" class="demoTree" />
		{/each}
	{:else if section === "rounded"}
		<!-- One tree per radius. -->
		{#each roundeds as rounded (rounded)}
			<FileTree files={files.slice(0, 3)} {rounded} variant="outline" value="src/routes/+page.svelte" class="demoTree" />
		{/each}
	{:else if section === "snippets"}
		<!-- Custom icons and trailing badges. -->
		<FileTree {files} variant="outline" class="demoTree">
			{#snippet icon({ path, isFolder, open })}
				{#if isFolder}<FileTreeIcon {path} {isFolder} {open} />{:else}<CircleDotIcon class="demoIcon" />{/if}
			{/snippet}
			{#snippet trailing({ path })}
				{#if path.endsWith(".svelte")}<Badge variant="secondary" size="xs">M</Badge>{/if}
			{/snippet}
		</FileTree>
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: var(--spacing-lg);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 1rem 0;
	}

	.demoColumn {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		font-size: var(--text-sm);
	}

	.demo :global(.demoTree) {
		width: 16rem; /* 256px */
	}

	.demo :global(.demoIcon) {
		width: var(--file-tree-icon);
		height: var(--file-tree-icon);
		color: var(--muted-foreground);
	}
</style>
