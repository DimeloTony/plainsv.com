<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	import type { ListProps } from "./index.js";
	const { children, class: className, ...props }: ListProps = $props();
	const ctx = useCompCtx();
</script>

<!-- Scrolling list of groups and items, controlled by the input; its edges fade while it scrolls. -->
<div class={["commandList scroll-fade-y", className]} id={ctx.listId} role="listbox" aria-label="Suggestions" {...props}>
	{@render children()}
</div>

<style>
	/* Base list; scrolls past 300px without scrolling the page */
	.commandList {
		max-height: 18.75rem; /* 300px */
		overflow-x: hidden;
		overflow-y: auto;
		overscroll-behavior: contain;
	}
</style>
