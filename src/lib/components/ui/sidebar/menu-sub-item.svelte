<script lang="ts">
	import type { MenuSubItemProps } from "./index.js";
	const { children, class: className, ...props }: MenuSubItemProps = $props();
</script>

<!-- One nested entry. -->
<li class={["sidebarMenuSubItem", className]} {...props}>
	{@render children()}
</li>

<style>
	/* Base sub item */
	.sidebarMenuSubItem {
		position: relative;
	}
</style>
