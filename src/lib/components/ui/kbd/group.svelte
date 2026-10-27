<script lang="ts">
	import type { GroupProps } from "./index.js";
	const { children, class: className, ...props }: GroupProps = $props();
</script>

<!-- Keys pressed together; a `kbd` that wraps `kbd` elements is how HTML marks a key combination. -->
<kbd class={["kbdGroup not-typeset", className]} {...props}>
	{@render children()}
</kbd>

<style>
	/* Base group */
	.kbdGroup {
		display: inline-flex;
		align-items: center;
		gap: var(--spacing-xs);
		font: inherit;
	}
</style>
