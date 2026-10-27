<script lang="ts">
	import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "#lib/components/ui/empty/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { FolderCodeIcon, CloudIcon, ArrowUpRightIcon } from "@lucide/svelte";

	const { section = "preview" }: Props = $props();

	/** Live preview for one section of the empty docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "outline" | "sizes" | "rounded";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- No projects yet, with two actions and a link. -->
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon"><FolderCodeIcon /></EmptyMedia>
				<EmptyTitle>No projects yet</EmptyTitle>
				<EmptyDescription>You haven't created any projects yet. Get started by creating your first project.</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<div class="demoRow">
					<Button>Create project</Button>
					<Button variant="outline">Import project</Button>
				</div>
				<Button variant="link" size="sm" href="/docs/components">Learn more <ArrowUpRightIcon /></Button>
			</EmptyContent>
		</Empty>
	{:else if section === "outline"}
		<!-- Dashed border around an upload area. -->
		<Empty variant="outline">
			<EmptyHeader>
				<EmptyMedia variant="icon"><CloudIcon /></EmptyMedia>
				<EmptyTitle>Cloud storage is empty</EmptyTitle>
				<EmptyDescription>Upload files to your cloud storage to access them anywhere.</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Button variant="outline" size="sm">Upload files</Button>
			</EmptyContent>
		</Empty>
	{:else if section === "sizes"}
		<!-- Each size of a compact empty state. -->
		{#each ["xs", "sm", "md", "lg"] as const as size (size)}
			<Empty variant="outline" {size}>
				<EmptyHeader>
					<EmptyTitle>No results</EmptyTitle>
					<EmptyDescription>Size {size}.</EmptyDescription>
				</EmptyHeader>
			</Empty>
		{/each}
	{:else if section === "rounded"}
		<!-- Each rounded value overriding the outline radius. -->
		{#each ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"] as const as rounded (rounded)}
			<Empty variant="outline" size="sm" {rounded}>
				<EmptyHeader>
					<EmptyTitle>No results</EmptyTitle>
					<EmptyDescription>Rounded {rounded}.</EmptyDescription>
				</EmptyHeader>
			</Empty>
		{/each}
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: var(--spacing-sm);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 1rem 0;
	}

	.demoRow {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--spacing-sm);
	}
</style>
