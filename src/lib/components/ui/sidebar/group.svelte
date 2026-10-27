<script lang="ts">
	import type { GroupProps } from "./index.js";
	const { children, class: className, ...props }: GroupProps = $props();
</script>

<!-- Section of the sidebar with a label. -->
<div class={["sidebarGroup", className]} {...props}>
	{@render children()}
</div>

<style>
	/* Base group */
	.sidebarGroup {
		display: flex;
		position: relative;
		flex-direction: column;
		box-sizing: border-box;
		padding: var(--spacing-sm);
		width: 100%;
		min-width: 0;
	}
</style>
