<script lang="ts">
	import type { ListProps } from "./index.js";
	const { children, class: className, ...props }: ListProps = $props();
</script>

<!-- Ordered trail of items and separators; wraps onto more lines when it runs out of room. -->
<ol class={["breadcrumbList", className]} {...props}>
	{@render children()}
</ol>

<style>
	/* Base list; the gap comes from the size on the root */
	.breadcrumbList {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--breadcrumb-gap);
		margin: 0;
		padding: 0;
		color: var(--muted-foreground);
		list-style: none;
		overflow-wrap: break-word;
	}
</style>
