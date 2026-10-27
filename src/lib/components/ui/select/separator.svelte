<script lang="ts">
	import type { SeparatorProps } from "./index.js";
	const { class: className, ...props }: SeparatorProps = $props();
</script>

<!-- Decorative divider between groups. -->
<div class={["selectSeparator", className]} aria-hidden="true" {...props}></div>

<style>
	/* A 1px line with space above and below, drawn in the content box so no margins are needed */
	.selectSeparator {
		box-sizing: content-box;
		background-clip: content-box;
		background-color: var(--border);
		padding-block: var(--spacing-xs);
		height: 1px;
	}
</style>
