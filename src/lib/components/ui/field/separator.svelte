<script lang="ts">
	import type { SeparatorProps } from "./index.js";
	const { children, class: className, ...props }: SeparatorProps = $props();
</script>

<!-- Line between fields; text in the middle sits on the page background. -->
<div class={["fieldSeparator", className]} role="none" data-content={!!children || undefined} {...props}>
	{#if children}
		<span class="fieldSeparatorText">{@render children()}</span>
	{/if}
</div>

<style>
	/* Base separator; the line runs through the middle */
	.fieldSeparator {
		display: flex;
		position: relative;
		justify-content: center;
		align-items: center;
		height: var(--line-height-sm);
		font-size: var(--text-sm);
	}

	.fieldSeparator::before {
		position: absolute;
		right: 0;
		left: 0;
		background-color: var(--border);
		height: 1px;
		content: "";
	}

	/* Text covers the line behind it */
	.fieldSeparatorText {
		position: relative;
		background-color: var(--background);
		padding-inline: var(--spacing-sm);
		color: var(--muted-foreground);
	}
</style>
