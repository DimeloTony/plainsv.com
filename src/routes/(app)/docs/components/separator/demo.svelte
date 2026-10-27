<script lang="ts">
	import { Separator } from "#lib/components/ui/separator/index.js";

	const { section = "preview" }: Props = $props();

	/** Live preview for one section of the separator docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "vertical";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Heading and text divided from a row of links. -->
		<div class="demoBlock">
			<div class="demoHeading">
				<strong>PlainSv</strong>
				<span class="demoText">Svelte components styled with theme tokens.</span>
			</div>
			<Separator />
			<nav class="demoRow">
				<span>Docs</span>
				<Separator orientation="vertical" />
				<span>Components</span>
				<Separator orientation="vertical" />
				<span>Source</span>
			</nav>
		</div>
	{:else if section === "vertical"}
		<!-- Vertical separators stretch to the height of the row. -->
		<div class="demoRow demoTall">
			<span>Blog</span>
			<Separator orientation="vertical" />
			<span>Docs</span>
			<Separator orientation="vertical" decorative={false} />
			<span>Source</span>
		</div>
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

	.demoBlock {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
		width: 100%;
		max-width: 20rem;
	}

	.demoHeading {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
		font-size: var(--text-sm);
	}

	.demoRow {
		display: flex;
		gap: var(--spacing-lg);
		font-size: var(--text-sm);
	}

	.demoTall {
		height: 1.25rem;
	}

	.demoText {
		color: var(--muted-foreground);
	}
</style>
