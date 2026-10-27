<script lang="ts">
	import type { MenuSubProps } from "./index.js";
	const { children, class: className, ...props }: MenuSubProps = $props();
</script>

<!-- Nested list with a line on its start edge; hidden while collapsed to icons. -->
<ul class={["sidebarMenuSub", className]} {...props}>
	{@render children()}
</ul>

<style>
	/* Base sub menu */
	.sidebarMenuSub {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
		margin: 0 calc(var(--spacing-md) + 2px);
		border-left: 1px solid var(--sidebar-border);
		padding: calc(var(--spacing-xs) / 2) calc(var(--spacing-xs) * 2.5);
		min-width: 0;
		list-style: none;
	}

	:global(.sidebar[data-collapsible="icon"]) .sidebarMenuSub {
		display: none;
	}
</style>
