<script lang="ts">
	import { SidebarTrigger } from "#lib/components/ui/sidebar/index.js";
	import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "#lib/components/ui/breadcrumb/index.js";
	import { Separator } from "#lib/components/ui/separator/index.js";
	import SearchForm from "./search-form.svelte";
</script>

<!-- Full-width header above the sidebar and the page, with the toggle, location, and search. -->
<header class="siteHeader">
	<div class="siteHeaderInner">
		<SidebarTrigger />
		<Separator orientation="vertical" style="align-self: center; margin-right: var(--spacing-sm); height: 1rem" />
		<div class="siteCrumbs">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem><BreadcrumbLink href="#">Build Your Application</BreadcrumbLink></BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem><BreadcrumbPage>Data Fetching</BreadcrumbPage></BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		</div>
		<SearchForm class="siteSearch" />
	</div>
</header>

<style>
	/* Stays above the page and the sidebar while scrolling */
	.siteHeader {
		display: flex;
		position: sticky;
		top: 0;
		align-items: center;
		z-index: 50;
		border-bottom: 1px solid var(--border);
		background-color: var(--background);
		width: 100%;
	}

	.siteHeaderInner {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		padding-inline: var(--spacing-lg);
		width: 100%;
		height: 3.5rem; /* 56px */
	}

	/* The location only shows from 40rem; below it, the search fills the row */
	.siteCrumbs {
		display: none;
	}

	.siteHeaderInner :global(.siteSearch) {
		width: 100%;
	}

	@media (min-width: 40rem) {
		.siteCrumbs {
			display: block;
		}

		.siteHeaderInner :global(.siteSearch) {
			margin-left: auto;
			width: auto;
		}
	}
</style>
