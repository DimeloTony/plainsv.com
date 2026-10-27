<script lang="ts">
	import type { GroupActionProps } from "./index.js";
	const { children, class: className, ...props }: GroupActionProps = $props();
</script>

<!-- Icon button at the end of the group label; give it an aria-label. -->
<button type="button" class={["sidebarGroupAction", className]} {...props}>
	{@render children()}
</button>

<style>
	/* Base action; lines up with the label */
	.sidebarGroupAction {
		display: flex;
		position: absolute;
		top: calc(var(--spacing-md) + 2px);
		right: var(--spacing-md);
		justify-content: center;
		align-items: center;
		transition-duration: 150ms;
		transition-property: color, background-color, box-shadow;
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

	.sidebarGroupAction:hover {
		background-color: var(--sidebar-accent);
		color: var(--sidebar-accent-foreground);
	}

	.sidebarGroupAction:focus-visible {
		box-shadow: 0 0 0 2px var(--sidebar-ring);
	}

	.sidebarGroupAction :global(svg) {
		flex-shrink: 0;
		width: 1rem; /* 16px */
		height: 1rem; /* 16px */
	}

	/* Collapsed to icons, the action hides with its label */
	:global(.sidebar[data-collapsible="icon"]) .sidebarGroupAction {
		display: none;
	}
</style>
