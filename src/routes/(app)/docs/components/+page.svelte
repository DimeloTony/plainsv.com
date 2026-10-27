<script lang="ts">
	import { PageMeta } from "#lib/components/shared/index.js";
	import { Card, CardHeader, CardTitle, CardAction } from "#lib/components/ui/card/index.js";
	import { ChevronRightIcon } from "@lucide/svelte";

	// Each folder in the ui directory with an `index.ts` is a component.
	// Only the paths are read, so `?raw` keeps the components out of the lazy imports that hide their CSS from the page head.
	const componentModules = import.meta.glob("/src/lib/components/ui/*/index.ts", { query: "?raw", import: "default" });
	// Each sibling folder with a `+page.svelte` or `+page.svx` is a component docs page.
	const docsPages = import.meta.glob("./*/+page.{svelte,svx}", { query: "?raw", import: "default" });
	const docsSlugs = new Set(Object.keys(docsPages).map((path) => path.split("/").at(-2)));
	const components = Object.keys(componentModules)
		.map(toComponentEntry)
		.sort((a, b) => a.name.localeCompare(b.name));

	/** Builds a component entry from its `index.ts` path. */
	function toComponentEntry(path: string): ComponentEntry {
		const slug = path.split("/").at(-2) ?? "";
		const name = slug
			.split("-")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
		// If the component has a docs page: link to it.
		const href = docsSlugs.has(slug) ? `/docs/components/${slug}` : undefined;
		return { slug, name, href };
	}

	/** A component found in the ui folder */
	interface ComponentEntry {
		/** Folder name, used in the docs URL */
		slug: string;
		/** Display name derived from the slug */
		name: string;
		/** Docs page URL; undefined when no docs page exists */
		href?: string;
	}
</script>

<PageMeta title="Components" description="Browse every PlainSv component: accessible Svelte 5 UI written with runes and plain CSS, ready to copy into your project." />

<main class="componentsDocs not-typeset">
	<header class="componentsDocsHeader">
		<h1>Components</h1>
		<p>{components.length} components built with runes, scoped styles, and shadcn tokens.</p>
		<!-- Point to the styling docs for theming beyond each component's props. -->
		<p>Change their look with <code>variant</code>, <code>size</code>, and <code>rounded</code>, or restyle every component at once with theme tokens on the <a class="componentsDocsLink" href="/docs/styling">styling page</a>.</p>
	</header>

	<!-- One card per component in the ui folder. -->
	<ul class="componentsDocsList">
		{#each components as component (component.slug)}
			<li>
				{#if component.href}
					<Card href={component.href}>
						<CardHeader>
							<CardTitle>{component.name}</CardTitle>
							<CardAction><ChevronRightIcon /></CardAction>
						</CardHeader>
					</Card>
				{:else}
					<!-- Components without a docs page are listed but not linked. -->
					<Card disabled>
						<CardHeader>
							<CardTitle>{component.name}</CardTitle>
							<CardAction><span>No docs yet</span></CardAction>
						</CardHeader>
					</Card>
				{/if}
			</li>
		{/each}
	</ul>
</main>

<style>
	.componentsDocs {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xl);
	}

	.componentsDocsHeader {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
	}

	.componentsDocsHeader h1 {
		font-weight: 600;
		font-size: 1.5rem;
	}

	.componentsDocsHeader p {
		color: var(--muted-foreground);
		font-size: var(--text-sm);
	}

	.componentsDocsLink {
		color: var(--foreground);
		text-decoration: underline;
		text-underline-offset: 0.25rem;
	}

	.componentsDocsList {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-md);
		padding: 0;
		list-style: none;
	}

	/* Cards grow from a 14rem minimum to fill each row */
	.componentsDocsList li {
		flex: 1 1 14rem;
	}

	/* Cards fill the row height so neighbors line up */
	.componentsDocsList li > :global(.card) {
		height: 100%;
	}
</style>
