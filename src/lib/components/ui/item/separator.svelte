<script lang="ts">
	import type { SeparatorProps } from "./index.js";
	const { class: className, ...props }: SeparatorProps = $props();
</script>

<!-- Hairline between items; decorative, so screen readers skip it. -->
<div class={["itemSeparator", className]} role="none" {...props}></div>

<style>
	/* Base separator */
	.itemSeparator {
		flex-shrink: 0;
		background-color: var(--border);
		width: 100%;
		height: 1px;
	}
</style>
