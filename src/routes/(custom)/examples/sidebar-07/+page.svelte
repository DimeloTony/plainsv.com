<script lang="ts">
	import { PageMeta } from "#lib/components/shared/index.js";
	import { SidebarProvider, SidebarInset, SidebarTrigger } from "#lib/components/ui/sidebar/index.js";
	import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "#lib/components/ui/breadcrumb/index.js";
	import { Separator } from "#lib/components/ui/separator/index.js";
	import AppSidebar from "./app-sidebar.svelte";
</script>

<PageMeta title="Sidebar 07 example" description="A sidebar that collapses to icons." />

<SidebarProvider>
	<AppSidebar />
	<SidebarInset>
		<!-- Top bar that shrinks while the sidebar is collapsed to icons. -->
		<header class="pageHeader">
			<div class="pageHeaderInner">
				<SidebarTrigger style="margin-left: calc(var(--spacing-xs) * -1)" />
				<Separator orientation="vertical" style="align-self: center; margin-right: var(--spacing-sm); height: 1rem" />
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem class="hideOnMobile"><BreadcrumbLink href="#">Build Your Application</BreadcrumbLink></BreadcrumbItem>
						<BreadcrumbSeparator class="hideOnMobile" />
						<BreadcrumbItem><BreadcrumbPage>Data Fetching</BreadcrumbPage></BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>
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
</SidebarProvider>

<style>
	/* Top bar of the main content */
	.pageHeader {
		display: flex;
		flex-shrink: 0;
		align-items: center;
		gap: var(--spacing-sm);
		transition: height 200ms linear;
		height: 4rem; /* 64px */
	}

	:global(.sidebarWrapper:has(.sidebar[data-collapsible="icon"])) .pageHeader {
		height: 3rem; /* 48px */
	}

	.pageHeaderInner {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		padding-inline: var(--spacing-lg);
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
		padding: 0 var(--spacing-lg) var(--spacing-lg);
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
