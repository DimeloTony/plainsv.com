<script lang="ts">
	import type { ActionsProps } from "./index.js";
	const { children, class: className, ...props }: ActionsProps = $props();
</script>

<!-- Actions under the content, on the same side as the content. -->
<div class={["messageActions", className]} role="group" {...props}>
	{@render children()}
</div>

<style>
	/* Base actions */
	.messageActions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--spacing-xs);
	}
</style>
