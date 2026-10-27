<script lang="ts">
	import { PageMeta } from "#lib/components/shared/index.js";
	import { SidebarProvider, SidebarInset, SidebarTrigger } from "#lib/components/ui/sidebar/index.js";
	import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "#lib/components/ui/breadcrumb/index.js";
	import AppSidebar from "./app-sidebar.svelte";
</script>

<PageMeta title="Sidebar 14 example" description="A sidebar on the right." />

<SidebarProvider>
	<SidebarInset>
		<!-- Top bar with the current location, and the sidebar toggle on the end. -->
		<header class="pageHeader">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem class="hideOnMobile"><BreadcrumbLink href="#">Build Your Application</BreadcrumbLink></BreadcrumbItem>
					<BreadcrumbSeparator class="hideOnMobile" />
					<BreadcrumbItem><BreadcrumbPage>Data Fetching</BreadcrumbPage></BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<SidebarTrigger style="margin-right: calc(var(--spacing-xs) * -1); margin-left: auto; transform: rotate(180deg)" />
		</header>

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
	<AppSidebar side="right" />
</SidebarProvider>

<style>
	/* Top bar of the main content */
	.pageHeader {
		display: flex;
		flex-shrink: 0;
		align-items: center;
		gap: var(--spacing-sm);
		border-bottom: 1px solid var(--border);
		padding-inline: var(--spacing-lg);
		height: 4rem; /* 64px */
	}

	/* The parent crumb only shows on wider screens */
	@media (max-width: 47.99rem) {
		.pageHeader :global(.hideOnMobile) {
			display: none;
		}
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
