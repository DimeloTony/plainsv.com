<script lang="ts">
	import type { ActionsProps } from "./index.js";
	const { children, class: className, ...props }: ActionsProps = $props();
</script>

<!-- Buttons or badges at the end of the item. -->
<div class={["itemActions", className]} {...props}>
	{@render children()}
</div>

<style>
	/* Base actions */
	.itemActions {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
	}
</style>
