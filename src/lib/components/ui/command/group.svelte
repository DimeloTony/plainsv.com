<script lang="ts">
	import type { GroupProps } from "./index.js";
	const { heading, children, class: className, ...props }: GroupProps = $props();
	const headingId = $props.id();
</script>

<!-- Group of items with an optional heading that names it. -->
<div class={["commandGroup", className]} role="group" aria-labelledby={heading ? headingId : undefined} {...props}>
	{#if heading}
		<div class="commandGroupHeading" id={headingId} aria-hidden="true">{heading}</div>
	{/if}
	{@render children()}
</div>

<style>
	/* Base group */
	.commandGroup {
		padding: var(--spacing-xs);
		color: var(--foreground);
	}

	/* Hides the group, heading included, while none of its items match */
	.commandGroup:not(:has(:global([role="option"]:not([hidden])))) {
		display: none;
	}

	/* Muted heading lined up with the item text */
	.commandGroupHeading {
		padding: var(--command-item-padding) var(--command-item-padding-inline);
		color: var(--muted-foreground);
		font-weight: 500;
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}
</style>
