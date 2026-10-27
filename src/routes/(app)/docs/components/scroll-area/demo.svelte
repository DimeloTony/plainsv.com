<script lang="ts">
	import { ScrollArea } from "#lib/components/ui/scroll-area/index.js";
	import { Button } from "#lib/components/ui/button/index.js";

	const { section = "preview" }: Props = $props();
	const tags = Array.from({ length: 50 }, (_, index) => `v1.2.0-beta.${50 - index}`);
	let viewport: HTMLDivElement | undefined = $state();
	const works = ["Ornella Binni", "Tom Byrom", "Vladimir Malyavko", "Rayan Almeida", "Sasha Freemind", "Lukas Blazek"];

	/** Live preview for one section of the scroll area docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "horizontal" | "always" | "position" | "sizes" | "rounded";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Long list of tags in a fixed-height box. -->
		<ScrollArea class="demoBox" style="height: 18rem; width: 12rem" rounded="md">
			<div class="demoList">
				<h4 class="demoHeading">Tags</h4>
				{#each tags as tag (tag)}
					<div class="demoTag">{tag}</div>
				{/each}
			</div>
		</ScrollArea>
	{:else if section === "horizontal"}
		<!-- Row of cards that scrolls sideways. -->
		<ScrollArea orientation="horizontal" class="demoBox" style="width: 100%; max-width: 24rem" rounded="md">
			<div class="demoRow">
				{#each works as artist (artist)}
					<figure class="demoCard">
						<div class="demoArt"></div>
						<figcaption>Photo by <strong>{artist}</strong></figcaption>
					</figure>
				{/each}
			</div>
		</ScrollArea>
	{:else if section === "always"}
		<!-- Scrollbar always shown. -->
		<ScrollArea type="always" class="demoBox" style="height: 10rem; width: 12rem" rounded="md">
			<div class="demoList">
				{#each tags.slice(0, 20) as tag (tag)}
					<div class="demoTag">{tag}</div>
				{/each}
			</div>
		</ScrollArea>
	{:else if section === "position"}
		<!-- Bound viewport scrolled back to the top by a button. -->
		<ScrollArea bind:viewport class="demoBox" style="height: 10rem; width: 12rem" rounded="md">
			<div class="demoList">
				{#each tags.slice(0, 20) as tag (tag)}
					<div class="demoTag">{tag}</div>
				{/each}
			</div>
		</ScrollArea>
		<Button variant="outline" size="sm" onclick={() => viewport?.scrollTo({ top: 0, behavior: "smooth" })}>Back to top</Button>
	{:else if section === "sizes"}
		<!-- Each scrollbar thickness, kept visible. -->
		<div class="demoGrid">
			{#each ["xs", "sm", "md", "lg"] as const as size (size)}
				<ScrollArea {size} type="always" class="demoBox" style="height: 8rem; width: 8rem" rounded="md">
					<div class="demoList">
						<h4 class="demoHeading">Size {size}</h4>
						{#each tags.slice(0, 10) as tag (tag)}
							<div class="demoTag">{tag}</div>
						{/each}
					</div>
				</ScrollArea>
			{/each}
		</div>
	{:else if section === "rounded"}
		<!-- Each rounded value on the box. -->
		<div class="demoGrid">
			{#each ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"] as const as rounded (rounded)}
				<ScrollArea {rounded} class="demoBox" style="height: 8rem; width: 8rem">
					<div class="demoList">
						<h4 class="demoHeading">Rounded {rounded}</h4>
						{#each tags.slice(0, 10) as tag (tag)}
							<div class="demoTag">{tag}</div>
						{/each}
					</div>
				</ScrollArea>
			{/each}
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

	.demoGrid {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-lg);
	}

	.demo :global(.demoBox) {
		border: 1px solid var(--border);
	}

	.demoList {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		padding: var(--spacing-lg);
		font-size: var(--text-sm);
	}

	.demoHeading {
		margin: 0 0 var(--spacing-sm);
		font-weight: 500;
		font-size: var(--text-sm);
	}

	.demoTag {
		border-bottom: 1px solid var(--border);
		padding-bottom: var(--spacing-sm);
	}

	.demoRow {
		display: flex;
		gap: var(--spacing-lg);
		padding: var(--spacing-lg);
	}

	.demoCard {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		margin: 0;
		color: var(--muted-foreground);
		font-size: var(--text-xs);
	}

	.demoArt {
		border-radius: var(--radius-md);
		background: linear-gradient(135deg, var(--muted), var(--accent));
		width: 9rem;
		height: 12rem;
	}

	.demoCard strong {
		color: var(--foreground);
		font-weight: 600;
	}
</style>
