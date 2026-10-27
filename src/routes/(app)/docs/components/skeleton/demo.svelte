<script lang="ts">
	import { Skeleton } from "#lib/components/ui/skeleton/index.js";
	import { Card, CardHeader, CardContent } from "#lib/components/ui/card/index.js";

	const { section = "preview" }: Props = $props();
	const roundedValues: UiRounded[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"];

	/** Live preview for one section of the skeleton docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "card" | "rounded";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Avatar and two text lines, used at the top of the page. -->
		<div class="demoProfile" aria-busy="true" aria-label="Loading profile">
			<Skeleton rounded="pill" style="width: 3rem; height: 3rem" />
			<div class="demoLines">
				<Skeleton style="width: 15.625rem; height: 1rem" />
				<Skeleton style="width: 12.5rem; height: 1rem" />
			</div>
		</div>
	{:else if section === "card"}
		<!-- Placeholder for a card with an image, a title, and a description. -->
		<Card aria-busy="true" aria-label="Loading post" style="width: 20rem">
			<CardHeader>
				<Skeleton style="width: 66%; height: 1rem" />
				<Skeleton style="width: 50%; height: 1rem" />
			</CardHeader>
			<CardContent>
				<Skeleton style="aspect-ratio: 16 / 9; width: 100%" />
			</CardContent>
		</Card>
	{:else if section === "rounded"}
		<!-- Each rounded value overriding the default radius. -->
		{#each roundedValues as rounded (rounded)}
			<Skeleton {rounded} style="width: 3rem; height: 3rem" />
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

	.demoProfile {
		display: flex;
		align-items: center;
		gap: var(--spacing-lg);
	}

	.demoLines {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}
</style>
