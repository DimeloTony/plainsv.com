<script lang="ts">
	import { setContext } from "svelte";
	import type { GroupProps } from "./index.js";
	const { children, class: className, ...props }: GroupProps = $props();
	// Tells the items inside to render as list items.
	setContext("item-group", true);
</script>

<!-- List of items. -->
<div class={["itemGroup not-typeset", className]} role="list" {...props}>
	{@render children()}
</div>

<style>
	/* Base group */
	.itemGroup {
		display: flex;
		flex-direction: column;
	}
</style>
