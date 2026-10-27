<script lang="ts">
	import { PageMeta } from "#lib/components/shared/index.js";
	import { SidebarProvider, SidebarInset, SidebarTrigger } from "#lib/components/ui/sidebar/index.js";
	import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage } from "#lib/components/ui/breadcrumb/index.js";
	import { Separator } from "#lib/components/ui/separator/index.js";
	import AppSidebar from "./app-sidebar.svelte";
	// One placeholder per day in the grid.
	const days = Array.from({ length: 20 }, (_, index) => index);
</script>

<PageMeta title="Sidebar 12 example" description="A sidebar with a calendar." />

<SidebarProvider>
	<AppSidebar />
	<SidebarInset>
		<!-- Sticky top bar with the sidebar toggle and the shown month. -->
		<header class="pageHeader">
			<SidebarTrigger style="margin-left: calc(var(--spacing-xs) * -1)" />
			<Separator orientation="vertical" style="align-self: center; margin-right: var(--spacing-sm); height: 1rem" />
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem><BreadcrumbPage>October 2024</BreadcrumbPage></BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		</header>

		<!-- Placeholder days. -->
		<div class="pageBody">
			<div class="days">
				{#each days as day (day)}
					<div class="day"></div>
				{/each}
			</div>
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

	.pageBody {
		display: flex;
		flex: 1;
		flex-direction: column;
		padding: var(--spacing-lg);
	}

	/* One day per row on small screens, five on wider ones */
	.days {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-lg);
	}

	.day {
		flex: 1 1 100%;
		border-radius: var(--radius-xl);
		background-color: color-mix(in oklab, var(--muted) 50%, transparent);
		aspect-ratio: 1;
	}

	@media (min-width: 48rem) {
		.day {
			flex-basis: calc(20% - var(--spacing-lg));
		}
	}
</style>
