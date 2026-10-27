<script lang="ts">
	import type { SeparatorProps } from "./index.js";
	const { class: className, ...props }: SeparatorProps = $props();
</script>

<!-- Hairline between sidebar sections; decorative, so screen readers skip it. -->
<div class={["sidebarSeparator", className]} role="none" {...props}></div>

<style>
	/* Base separator; inset from the sidebar edges */
	.sidebarSeparator {
		flex-shrink: 0;
		align-self: stretch;
		margin-inline: var(--spacing-sm);
		background-color: var(--sidebar-border);
		height: 1px;
	}
</style>
