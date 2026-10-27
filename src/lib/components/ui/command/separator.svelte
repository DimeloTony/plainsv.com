<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	import type { SeparatorProps } from "./index.js";
	const { class: className, ...props }: SeparatorProps = $props();
	const ctx = useCompCtx();
</script>

<!-- Decorative divider between groups; hidden while the search filters the items. -->
<div class={["commandSeparator", className]} aria-hidden="true" hidden={ctx.isFiltering} {...props}></div>

<style>
	/* Base separator; spans the full list width */
	.commandSeparator {
		background-color: var(--border);
		height: 1px;
	}
</style>
