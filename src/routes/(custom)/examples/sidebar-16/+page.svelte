<script lang="ts">
	import { PageMeta } from "#lib/components/shared/index.js";
	import { SidebarProvider, SidebarInset } from "#lib/components/ui/sidebar/index.js";
	import AppSidebar from "./app-sidebar.svelte";
	import SiteHeader from "./site-header.svelte";
</script>

<PageMeta title="Sidebar 16 example" description="A sidebar with a sticky site header." />

<!-- The site header spans the top; the sidebar and the page sit in a row below it. -->
<SidebarProvider style="flex-direction: column">
	<SiteHeader />
	<div class="pageRow">
		<AppSidebar />
		<SidebarInset>
			<!-- Placeholder content. -->
			<div class="pageBody">
				<div class="tiles">
					<div class="tile"></div>
					<div class="tile"></div>
					<div class="tile"></div>
				</div>
				<div class="tile tileLarge"></div>
			</div>
		</SidebarInset>
	</div>
</SidebarProvider>

<style>
	.pageRow {
		display: flex;
		flex: 1;
	}

	.pageBody {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: var(--spacing-lg);
		padding: var(--spacing-lg);
	}

	/* Placeholder content blocks */
	.tiles {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-lg);
	}

	.tile {
		flex: 1 1 12rem;
		border-radius: var(--radius-xl);
		background-color: color-mix(in oklab, var(--muted) 50%, transparent);
		aspect-ratio: 16 / 9;
	}

	.tileLarge {
		flex: 1;
		aspect-ratio: auto;
		min-height: 100svh;
	}

	@media (min-width: 48rem) {
		.tileLarge {
			min-height: min-content;
		}
	}
</style>
