<script lang="ts">
	import type { SeparatorProps } from "./index.js";
	const { class: className, ...props }: SeparatorProps = $props();
</script>

<!-- Divider between groups. -->
<div class={["dropdownMenuSeparator", className]} role="separator" {...props}></div>

<style>
	/* A 1px line with space above and below, drawn in the content box so no vertical margins are needed */
	.dropdownMenuSeparator {
		box-sizing: content-box;
		margin-inline: calc(-1 * var(--spacing-xs)); /* Bleeds through the menu padding to meet the border */
		background-clip: content-box;
		background-color: var(--border);
		padding-block: var(--spacing-xs);
		height: 1px;
	}
</style>
