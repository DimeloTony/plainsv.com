<script lang="ts">
	import { PageMeta } from "#lib/components/shared/index.js";
	import { SidebarProvider, SidebarInset } from "#lib/components/ui/sidebar/index.js";
	import AppSidebar from "./app-sidebar.svelte";
	import SiteHeader from "./site-header.svelte";
	import SectionCards from "./section-cards.svelte";
	import ChartAreaInteractive from "./chart-area-interactive.svelte";
	import DataTable from "./data-table.svelte";
	import sections from "./data.json";
</script>

<PageMeta title="Dashboard 01 example" description="A dashboard with an inset sidebar, stat cards, an interactive chart, and a data table." />

<SidebarProvider width="18rem">
	<AppSidebar variant="inset" />
	<SidebarInset>
		<SiteHeader />

		<!-- Stat cards, the visitors chart, and the sections table. -->
		<div class="dashboardMain">
			<SectionCards />
			<div class="dashboardChart">
				<ChartAreaInteractive />
			</div>
			<DataTable data={sections} />
		</div>
	</SidebarInset>
</SidebarProvider>

<style>
	/* Named container, so the cards and table adapt to the content width instead of the viewport */
	.dashboardMain {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: var(--spacing-lg);
		container: dashboardMain / inline-size;
		padding-block: var(--spacing-lg);
	}

	.dashboardChart {
		padding-inline: var(--spacing-lg);
	}

	@media (min-width: 48rem) {
		.dashboardMain {
			gap: var(--spacing-xl);
			padding-block: var(--spacing-xl);
		}
	}

	@media (min-width: 64rem) {
		.dashboardChart {
			padding-inline: var(--spacing-xl);
		}
	}
</style>
