<script lang="ts">
	import { PageMeta } from "#lib/components/shared/index.js";
	import { SidebarProvider, SidebarInset, SidebarTrigger } from "#lib/components/ui/sidebar/index.js";
	import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "#lib/components/ui/breadcrumb/index.js";
	import { Separator } from "#lib/components/ui/separator/index.js";
	import AppSidebar from "./app-sidebar.svelte";
	// Enough placeholder rows to scroll under the sticky header.
	const rows = Array.from({ length: 24 }, (_, index) => index);
</script>

<PageMeta title="Sidebar 02 example" description="A sidebar with collapsible sections." />

<SidebarProvider>
	<AppSidebar />
	<SidebarInset>
		<!-- Sticky top bar with the sidebar toggle and the current location. -->
		<header class="pageHeader">
			<SidebarTrigger style="margin-left: calc(var(--spacing-xs) * -1)" />
			<Separator orientation="vertical" style="align-self: center; margin-right: var(--spacing-sm); height: 1rem" />
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem class="hideOnMobile"><BreadcrumbLink href="#">Build Your Application</BreadcrumbLink></BreadcrumbItem>
					<BreadcrumbSeparator class="hideOnMobile" />
					<BreadcrumbItem><BreadcrumbPage>Data Fetching</BreadcrumbPage></BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		</header>

		<!-- Placeholder rows. -->
		<div class="pageBody">
			{#each rows as row (row)}
				<div class="row"></div>
			{/each}
		</div>
	</SidebarInset>
</SidebarProvider>

<style>
	/* Top bar that stays in view while the content scrolls */
	.pageHeader {
		display: flex;
		position: sticky;
		top: 0;
		flex-shrink: 0;
		align-items: center;
		gap: var(--spacing-sm);
		z-index: 1;
		border-bottom: 1px solid var(--border);
		background-color: var(--background);
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

	/* Placeholder row */
	.row {
		flex-shrink: 0;
		border-radius: var(--radius-lg);
		background-color: color-mix(in oklab, var(--muted) 50%, transparent);
		height: 3rem; /* 48px */
	}
</style>
