<script lang="ts">
	import type { ContentProps } from "./index.js";
	const { children, class: className, ...props }: ContentProps = $props();
</script>

<!-- Card body content. -->
<div class={["cardContent", className]} {...props}>
	{@render children()}
</div>

<style>
	/* Base content */
	.cardContent {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}
</style>
