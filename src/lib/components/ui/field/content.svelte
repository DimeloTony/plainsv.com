<script lang="ts">
	import type { ContentProps } from "./index.js";
	const { children, class: className, ...props }: ContentProps = $props();
</script>

<!-- Label and description beside the control. -->
<div class={["fieldContent", className]} {...props}>
	{@render children()}
</div>

<style>
	/* Base content */
	.fieldContent {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: calc(var(--spacing-xs) * 1.5); /* 6px */
		min-width: 0;
	}
</style>
