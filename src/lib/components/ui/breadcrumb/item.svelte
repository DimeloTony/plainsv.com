<script lang="ts">
	import type { ItemProps } from "./index.js";
	const { children, class: className, ...props }: ItemProps = $props();
</script>

<!-- One step in the trail, holding a link, the current page, or an ellipsis. -->
<li class={["breadcrumbItem", className]} {...props}>
	{@render children()}
</li>

<style>
	/* Base item */
	.breadcrumbItem {
		display: inline-flex;
		align-items: center;
		gap: var(--spacing-xs);
	}
</style>
