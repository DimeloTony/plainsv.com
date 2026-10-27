<script lang="ts">
	import type { EmptyProps } from "./index.js";
	const { children, class: className, ...props }: EmptyProps = $props();
</script>

<!-- Message for an empty search; CSS shows it only while the list has no visible item. -->
<div class={["commandEmpty", className]} role="presentation" {...props}>
	{@render children()}
</div>

<style>
	/* Base message */
	.commandEmpty {
		padding-block: var(--spacing-xl);
		color: var(--muted-foreground);
		text-align: center;
	}

	/* Hides the message while any item in the list is visible, including during server rendering */
	:global(.commandList:has([role="option"]:not([hidden]))) .commandEmpty {
		display: none;
	}
</style>
