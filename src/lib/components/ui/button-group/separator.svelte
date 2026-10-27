<script lang="ts">
	import type { SeparatorProps } from "./index.js";
	const { orientation = "vertical", class: className, ...props }: SeparatorProps = $props();
</script>

<!-- Hairline between joined children; decorative, so screen readers skip it. -->
<div class={["buttonGroupSeparator", className]} role="none" data-orientation={orientation} {...props}></div>

<style>
	/* Base separator; stretches across the group */
	.buttonGroupSeparator {
		position: relative;
		flex-shrink: 0;
		align-self: stretch;
		margin: 0;
		background-color: var(--input);
	}

	.buttonGroupSeparator[data-orientation="vertical"] {
		width: 1px;
	}

	.buttonGroupSeparator[data-orientation="horizontal"] {
		height: 1px;
	}
</style>
