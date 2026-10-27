<script lang="ts">
	import { PageMeta } from "#lib/components/shared/index.js";
	import { SidebarProvider, SidebarInset, SidebarTrigger } from "#lib/components/ui/sidebar/index.js";
	import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage } from "#lib/components/ui/breadcrumb/index.js";
	import { Separator } from "#lib/components/ui/separator/index.js";
	import SidebarLeft from "./sidebar-left.svelte";
	import SidebarRight from "./sidebar-right.svelte";
</script>

<PageMeta title="Sidebar 15 example" description="A left and right sidebar." />

<SidebarProvider>
	<SidebarLeft />
	<SidebarInset>
		<!-- Sticky top bar with the sidebar toggle and the page title. -->
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
		</header>

		<!-- Placeholder document. -->
		<div class="pageBody">
			<div class="block blockShort"></div>
			<div class="block blockTall"></div>
		</div>
	</SidebarInset>
	<SidebarRight />
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
		background-color: var(--background);
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

	.pageBody {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: var(--spacing-lg);
		padding: var(--spacing-lg);
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
		height: 100svh;
	}
</style>
