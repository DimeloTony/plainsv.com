<script lang="ts">
	import type { ContentProps } from "./index.js";
	const { children, class: className, ...props }: ContentProps = $props();
</script>

<!-- Title and description. -->
<div class={["itemContent", className]} {...props}>
	{@render children()}
</div>

<style>
	/* Base content; takes the room between the media and the actions */
	.itemContent {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: var(--spacing-xs);
		min-width: 0;
	}
</style>
