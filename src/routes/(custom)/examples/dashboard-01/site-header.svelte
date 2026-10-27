<script lang="ts">
	import { SidebarTrigger } from "#lib/components/ui/sidebar/index.js";
	import { Separator } from "#lib/components/ui/separator/index.js";
</script>

<!-- Top bar with the sidebar toggle and the page title. -->
<header class="siteHeader">
	<div class="siteHeaderInner">
		<SidebarTrigger style="margin-left: calc(var(--spacing-xs) * -1)" />
		<Separator orientation="vertical" style="align-self: center; margin-inline: var(--spacing-sm); height: 1rem" />
		<h1>Documents</h1>
	</div>
</header>

<style>
	.siteHeader {
		display: flex;
		flex-shrink: 0;
		align-items: center;
		border-bottom: 1px solid var(--border);
		height: 3rem; /* 48px */
	}

	.siteHeaderInner {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		padding-inline: var(--spacing-lg);
		width: 100%;
	}

	.siteHeaderInner h1 {
		margin: 0;
		font-weight: 500;
		font-size: var(--text-md);
	}

	@media (min-width: 64rem) {
		.siteHeaderInner {
			gap: var(--spacing-sm);
			padding-inline: var(--spacing-xl);
		}
	}
</style>
