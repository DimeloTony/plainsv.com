<script lang="ts">
	import { PageMeta } from "#lib/components/shared/index.js";
	import { SidebarProvider, SidebarInset, SidebarTrigger } from "#lib/components/ui/sidebar/index.js";
	import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage } from "#lib/components/ui/breadcrumb/index.js";
	import { Separator } from "#lib/components/ui/separator/index.js";
	import AppSidebar from "./app-sidebar.svelte";
	import NavActions from "./nav-actions.svelte";
</script>

<PageMeta title="Sidebar 10 example" description="A sidebar in a popover." />

<SidebarProvider>
	<AppSidebar />
	<SidebarInset>
		<!-- Page title on the start, page actions on the end. -->
		<header class="pageHeader">
			<div class="pageHeaderStart">
				<SidebarTrigger />
				<Separator orientation="vertical" style="align-self: center; margin-right: var(--spacing-sm); height: 1rem" />
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem><BreadcrumbPage class="pageTitle">Project Management & Task Tracking</BreadcrumbPage></BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>
			<div class="pageHeaderEnd">
				<NavActions />
			</div>
		</header>

		<!-- Placeholder document. -->
		<div class="pageBody">
			<div class="block blockShort"></div>
			<div class="block blockTall"></div>
		</div>
	</SidebarInset>
</SidebarProvider>

<style>
	.pageHeader {
		display: flex;
		flex-shrink: 0;
		align-items: center;
		gap: var(--spacing-sm);
		height: 3.5rem; /* 56px */
	}

	.pageHeaderStart {
		display: flex;
		flex: 1;
		align-items: center;
		gap: var(--spacing-sm);
		padding-inline: var(--spacing-md);
		min-width: 0;
	}

	/* The page title stays on one line */
	.pageHeaderStart :global(.pageTitle) {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		line-clamp: 1;
		overflow: hidden;
	}

	.pageHeaderEnd {
		margin-left: auto;
		padding-inline: var(--spacing-md);
	}

	.pageBody {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: var(--spacing-lg);
		padding: 2.5rem var(--spacing-lg); /* 40px */
	}

	/* Placeholder blocks in a centered column */
	.block {
		margin-inline: auto;
		border-radius: var(--radius-xl);
		background-color: color-mix(in oklab, var(--muted) 50%, transparent);
		width: 100%;
		max-width: 48rem; /* 768px */
	}

	.blockShort {
		height: 6rem; /* 96px */
	}

	.blockTall {
		flex: 1;
	}
</style>
