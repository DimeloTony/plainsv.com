<script lang="ts">
	import type { MenuItemProps } from "./index.js";
	const { children, class: className, ...props }: MenuItemProps = $props();
</script>

<!-- One menu entry; holds its button, action, badge, and sub menu. -->
<li class={["sidebarMenuItem", className]} {...props}>
	{@render children()}
</li>

<style>
	/* Base item; the action and badge are placed against it */
	.sidebarMenuItem {
		position: relative;
	}

	/* A button beside an action or badge leaves room for it */
	.sidebarMenuItem:has(> :global(.sidebarMenuAction)) > :global(.sidebarMenuButton),
	.sidebarMenuItem:has(> :global(.sidebarMenuBadge)) > :global(.sidebarMenuButton),
	.sidebarMenuItem > :global(.collapsible:has(> .sidebarMenuAction)) > :global(.sidebarMenuButton) {
		padding-right: var(--control-height-sm);
	}
</style>
