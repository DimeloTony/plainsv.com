<script lang="ts">
	import type { GroupContentProps } from "./index.js";
	const { children, class: className, ...props }: GroupContentProps = $props();
</script>

<!-- Body of the group. -->
<div class={["sidebarGroupContent", className]} {...props}>
	{@render children()}
</div>

<style>
	/* Base content */
	.sidebarGroupContent {
		width: 100%;
		font-size: var(--text-sm);
	}
</style>
