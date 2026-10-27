<script lang="ts">
	import { PageMeta } from "#lib/components/shared/index.js";
	import { Card, CardHeader, CardTitle, CardDescription, CardAction } from "#lib/components/ui/card/index.js";
	import { exampleLinks } from "#lib/data/app.js";
	import { ChevronRightIcon } from "@lucide/svelte";
</script>

<PageMeta title="Examples" description="Full-screen dashboard, sidebar, login, and sign up layouts built from PlainSv components, ported from the shadcn blocks." />

<main class="examplesIndex not-typeset">
	<header class="examplesIndexHeader">
		<h1>Examples</h1>
		<p>Full-screen pages built from PlainSv components, styled with scoped style blocks and shadcn tokens.</p>
	</header>

	<!-- One card per example page. -->
	<ul class="examplesIndexList">
		{#each exampleLinks as example (example.href)}
			<li>
				<Card href={example.href}>
					<CardHeader>
						<CardTitle>{example.label}</CardTitle>
						<CardDescription>{example.description}</CardDescription>
						<CardAction><ChevronRightIcon /></CardAction>
					</CardHeader>
				</Card>
			</li>
		{/each}
	</ul>
</main>

<style>
	.examplesIndex {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xl);
	}

	.examplesIndexHeader {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
	}

	.examplesIndexHeader h1 {
		font-weight: 600;
		font-size: 1.5rem;
	}

	.examplesIndexHeader p {
		color: var(--muted-foreground);
		font-size: var(--text-sm);
	}

	.examplesIndexList {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-md);
		padding: 0;
		list-style: none;
	}

	/* Cards grow from an 18rem minimum to fill each row */
	.examplesIndexList li {
		flex: 1 1 18rem;
	}

	/* Cards fill the row height so neighbors line up */
	.examplesIndexList li > :global(.card) {
		height: 100%;
	}
</style>
