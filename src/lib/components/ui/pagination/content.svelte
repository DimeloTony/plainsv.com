<script lang="ts">
	import type { ContentProps } from "./index.js";
	const { children, class: className, ...props }: ContentProps = $props();
</script>

<!-- List of page items. -->
<ul class={["paginationContent", className]} {...props}>
	{@render children()}
</ul>

<style>
	/* Base list */
	.paginationContent {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--spacing-xs);
		margin: 0;
		padding: 0;
		list-style: none;
	}
</style>
