<script lang="ts">
	import type { DescriptionProps } from "./index.js";
	const { children, class: className, ...props }: DescriptionProps = $props();
</script>

<!-- Muted supporting text; a div so it can hold paragraphs and lists. -->
<div class={["alertDescription", className]} {...props}>
	{@render children()}
</div>

<style>
	/* Base description; inherits the alert's text size */
	.alertDescription {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--spacing-xs);
		color: var(--muted-foreground);
	}

	/* Nested paragraphs drop their margins and read more loosely */
	.alertDescription :global(p) {
		margin: 0;
		line-height: 1.625;
	}
</style>
