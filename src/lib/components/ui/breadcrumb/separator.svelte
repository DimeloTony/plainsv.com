<script lang="ts">
	import type { SeparatorProps } from "./index.js";
	import { ChevronRightIcon } from "@lucide/svelte";
	const { children, class: className, ...props }: SeparatorProps = $props();
</script>

<!-- Divider between items; hidden from screen readers, which already announce the list. -->
<li class={["breadcrumbSeparator", className]} role="presentation" aria-hidden="true" {...props}>
	{#if children}
		{@render children()}
	{:else}
		<ChevronRightIcon />
	{/if}
</li>

<style>
	/* Base separator */
	.breadcrumbSeparator {
		display: inline-flex;
		align-items: center;
	}

	.breadcrumbSeparator :global(svg) {
		flex-shrink: 0;
		width: var(--breadcrumb-icon);
		height: var(--breadcrumb-icon);
	}
</style>
