<script lang="ts">
	import { setContext } from "svelte";
	import type { Props } from "./index.js";
	const { size = "md", children, class: className, ...props }: Props = $props();
	// Links read the size through a getter, so they follow changes to the prop.
	setContext("pagination-size", () => size);
</script>

<!-- Page navigation landmark. -->
<nav class={["pagination not-typeset", className]} aria-label="pagination" data-size={size} {...props}>
	{@render children()}
</nav>

<style>
	/* Base pagination; centered in its container */
	.pagination {
		display: flex;
		justify-content: center;
		width: 100%;
	}
</style>
