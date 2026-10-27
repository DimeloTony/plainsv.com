<script lang="ts">
	import type { MenuProps } from "./index.js";
	const { children, class: className, ...props }: MenuProps = $props();
</script>

<!-- List of menu items. -->
<ul class={["sidebarMenu", className]} {...props}>
	{@render children()}
</ul>

<style>
	/* Base menu */
	.sidebarMenu {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
		margin: 0;
		padding: 0;
		width: 100%;
		min-width: 0;
		list-style: none;
	}
</style>
