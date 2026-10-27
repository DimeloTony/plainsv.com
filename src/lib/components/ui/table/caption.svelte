<script lang="ts">
	import type { CaptionProps } from "./index.js";
	const { children, class: className, ...props }: CaptionProps = $props();
</script>

<!-- Title of the table, announced with it and shown under the rows. -->
<caption class={["tableCaption", className]} {...props}>
	{@render children()}
</caption>

<style>
	/* Base caption; padding instead of a gap, since a caption is not a flex item */
	.tableCaption {
		padding-top: var(--spacing-lg);
		color: var(--muted-foreground);
	}
</style>
