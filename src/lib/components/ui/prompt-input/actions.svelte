<script lang="ts">
	import type { ActionsProps } from "./index.js";
	const { children, class: className, ...props }: ActionsProps = $props();
</script>

<!-- Row of prompt controls; the send button pushes itself to the end. -->
<div class={["promptInputActions", className]} {...props}>
	{@render children()}
</div>

<style>
	/* Base row */
	.promptInputActions {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		min-width: 0;
	}
</style>
