<script lang="ts">
	import type { ContentProps } from "./index.js";
	const { children, class: className, ...props }: ContentProps = $props();
</script>

<!-- Scrolling area that holds the groups. -->
<div class={["sidebarContent", className]} {...props}>
	{@render children()}
</div>

<style>
	/* Base content; scrolls when the groups are taller than the sidebar */
	.sidebarContent {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: var(--spacing-sm);
		min-height: 0;
		overflow: auto;
	}

	/* Collapsed to icons, the content never scrolls sideways */
	:global(.sidebar[data-collapsible="icon"]) .sidebarContent {
		overflow: hidden;
	}
</style>
