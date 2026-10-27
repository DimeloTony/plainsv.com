<script lang="ts">
	import type { MenuSubButtonProps } from "./index.js";
	const { isActive = false, size = "md", href, children, class: className, ...props }: MenuSubButtonProps = $props();
	const isLink = $derived(href !== undefined);
</script>

<!-- Nested link or button; the current page is highlighted. -->
<svelte:element this={isLink ? "a" : "button"} type={isLink ? undefined : "button"} class={["sidebarMenuSubButton", className]} {href} aria-current={isActive && isLink ? "page" : undefined} data-active={isActive || undefined} data-size={size} {...props}>
	{@render children()}
</svelte:element>

<style>
	/* Base sub button; the last span is the label and truncates */
	.sidebarMenuSubButton {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		transition-duration: 150ms;
		transition-property: color, background-color, box-shadow;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		cursor: pointer;
		box-sizing: border-box;
		outline: none;
		border: 0;
		border-radius: var(--radius-md);
		background-color: transparent;
		padding-inline: var(--spacing-sm);
		width: 100%;
		min-width: 0;
		height: 1.75rem; /* 28px */
		overflow: hidden;
		color: var(--sidebar-foreground);
		font: inherit;
		text-align: left;
		text-decoration: none;
	}

	.sidebarMenuSubButton:hover,
	.sidebarMenuSubButton:active {
		background-color: var(--sidebar-accent);
		color: var(--sidebar-accent-foreground);
	}

	.sidebarMenuSubButton > :global(span:last-child) {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.sidebarMenuSubButton > :global(svg) {
		flex-shrink: 0;
		width: 1rem; /* 16px */
		height: 1rem; /* 16px */
		color: var(--sidebar-accent-foreground);
	}

	/* =============== States =============== */

	/* Current page */
	.sidebarMenuSubButton[data-active] {
		background-color: var(--sidebar-accent);
		color: var(--sidebar-accent-foreground);
	}

	/* Keyboard focus ring */
	.sidebarMenuSubButton:focus-visible {
		box-shadow: 0 0 0 2px var(--sidebar-ring);
	}

	/* Disabled state for buttons and links */
	.sidebarMenuSubButton:disabled,
	.sidebarMenuSubButton[aria-disabled="true"] {
		opacity: 50%;
		pointer-events: none;
	}

	/* =============== Sizes =============== */

	.sidebarMenuSubButton[data-size="md"] {
		font-size: var(--text-sm);
	}

	.sidebarMenuSubButton[data-size="sm"] {
		font-size: var(--text-xs);
	}
</style>
