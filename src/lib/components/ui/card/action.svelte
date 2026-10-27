<script lang="ts">
	import type { ActionProps } from "./index.js";
	const { children, class: className, ...props }: ActionProps = $props();
</script>

<!-- Trailing header content placed in the header's second column. -->
<div class={["cardAction", className]} {...props}>
	{@render children()}
</div>

<style>
	/* Base action */
	.cardAction {
		display: flex;
		grid-row: 1;
		grid-column: 2;
		align-items: center;
		justify-self: end;
		gap: var(--spacing-xs);
		color: var(--muted-foreground);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* Default icon size */
	.cardAction :global(svg) {
		flex-shrink: 0;
		width: 1rem; /* 16px */
		height: 1rem; /* 16px */
	}
</style>
