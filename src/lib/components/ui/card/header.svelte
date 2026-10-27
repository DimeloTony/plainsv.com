<script lang="ts">
	import type { HeaderProps } from "./index.js";
	const { children, class: className, ...props }: HeaderProps = $props();
</script>

<!-- Header with the title and description, plus an optional trailing action. -->
<header class={["cardHeader", className]} {...props}>
	{@render children()}
</header>

<style>
	/* Base header; grid lets the action sit beside both the title and description without a wrapper */
	.cardHeader {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		align-items: center;
		gap: var(--spacing-sm) var(--spacing-md);
	}

	/* Adds a trailing column when the header holds an action */
	.cardHeader:has(> :global(.cardAction)) {
		grid-template-columns: minmax(0, 1fr) auto;
	}

	/* Title and description stay in the first column */
	.cardHeader > :global(:not(.cardAction)) {
		grid-column: 1;
	}

	/* The action spans both rows when a description is present */
	.cardHeader:has(> :global(.cardDescription)) > :global(.cardAction) {
		grid-row: 1 / span 2;
	}
</style>
