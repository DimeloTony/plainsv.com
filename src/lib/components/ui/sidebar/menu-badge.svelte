<script lang="ts">
	import type { MenuBadgeProps } from "./index.js";
	const { children, class: className, ...props }: MenuBadgeProps = $props();
</script>

<!-- Count at the end of the menu item; hidden while collapsed to icons. -->
<div class={["sidebarMenuBadge", className]} {...props}>
	{@render children()}
</div>

<style>
	/* Base badge; centered on the button's end */
	.sidebarMenuBadge {
		display: flex;
		position: absolute;
		top: calc(var(--spacing-xs) + 2px);
		right: var(--spacing-xs);
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
		border-radius: var(--radius-md);
		padding-inline: var(--spacing-xs);
		min-width: 1.25rem; /* 20px */
		height: 1.25rem; /* 20px */
		pointer-events: none;
		color: var(--sidebar-foreground);
		font-weight: 500;
		font-size: var(--text-xs);
		font-variant-numeric: tabular-nums;
		user-select: none;
	}

	:global(.sidebar[data-collapsible="icon"]) .sidebarMenuBadge {
		display: none;
	}
</style>
