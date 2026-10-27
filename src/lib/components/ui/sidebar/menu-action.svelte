<script lang="ts">
	import type { MenuActionProps } from "./index.js";
	const { showOnHover = false, children, class: className, ...props }: MenuActionProps = $props();
</script>

<!-- Icon button at the end of the menu item, such as a "more" menu; give it an aria-label. -->
<button type="button" class={["sidebarMenuAction", className]} data-show-on-hover={showOnHover || undefined} {...props}>
	{@render children()}
</button>

<style>
	/* Base action; centered on the button's end */
	.sidebarMenuAction {
		display: flex;
		position: absolute;
		top: calc(var(--spacing-xs) + 2px);
		right: var(--spacing-xs);
		justify-content: center;
		align-items: center;
		transition-duration: 150ms;
		transition-property: color, background-color, box-shadow, opacity;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		cursor: pointer;
		outline: none;
		border: 0;
		border-radius: var(--radius-md);
		background-color: transparent;
		padding: 0;
		width: 1.25rem; /* 20px */
		height: 1.25rem; /* 20px */
		color: var(--sidebar-foreground);
	}

	.sidebarMenuAction:hover {
		background-color: var(--sidebar-accent);
		color: var(--sidebar-accent-foreground);
	}

	.sidebarMenuAction :global(svg) {
		flex-shrink: 0;
		width: 1rem; /* 16px */
		height: 1rem; /* 16px */
	}

	/* Hidden until the item is hovered or focused, or its menu is open; also inside a `Collapsible` that wraps the item's parts */
	.sidebarMenuAction[data-show-on-hover] {
		opacity: 0;
	}

	:global(.sidebarMenuItem:hover) > .sidebarMenuAction[data-show-on-hover],
	:global(.sidebarMenuItem:focus-within) > .sidebarMenuAction[data-show-on-hover],
	:global(.sidebarMenuItem:hover > .collapsible) > .sidebarMenuAction[data-show-on-hover],
	:global(.sidebarMenuItem:focus-within > .collapsible) > .sidebarMenuAction[data-show-on-hover],
	.sidebarMenuAction[data-show-on-hover][data-state="open"] {
		opacity: 1;
	}

	/* =============== States =============== */

	/* Keyboard focus ring */
	.sidebarMenuAction:focus-visible {
		box-shadow: 0 0 0 2px var(--sidebar-ring);
	}

	/* Collapsed to icons, the action hides */
	:global(.sidebar[data-collapsible="icon"]) .sidebarMenuAction {
		display: none;
	}
</style>
