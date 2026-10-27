<script lang="ts">
	import type { ListProps } from "./index.js";
	const { children, class: className, ...props }: ListProps = $props();
</script>

<!-- Row of top-level items. -->
<ul class={["navigationMenuList", className]} {...props}>
	{@render children()}
</ul>

<style>
	/* Base list; drops the bullets and default spacing */
	.navigationMenuList {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		margin: 0;
		padding: 0;
		list-style: none;
	}
</style>
