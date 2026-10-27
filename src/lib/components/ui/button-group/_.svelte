<script lang="ts">
	import type { Props } from "./index.js";
	const { orientation = "horizontal", children, class: className, ...props }: Props = $props();
</script>

<!-- Joins its children: inner corners turn square and neighbors share a border. -->
<div class={["buttonGroup not-typeset", className]} role="group" data-orientation={orientation} {...props}>
	{@render children()}
</div>

<style>
	/* Base group; children stretch to the tallest one */
	.buttonGroup {
		display: flex;
		align-items: stretch;
		width: fit-content;
	}

	.buttonGroup[data-orientation="vertical"] {
		flex-direction: column;
	}

	/* A focused child rises above its neighbors so the ring is not covered */
	.buttonGroup > :global(*:focus-visible),
	.buttonGroup > :global(*:focus-within) {
		position: relative;
		z-index: 1;
	}

	/* Inputs inside the group fill the room left by the buttons */
	.buttonGroup > :global(.input) {
		flex: 1;
	}

	/* Joined corners; [data-orientation] keeps these above the children's own radius */
	.buttonGroup[data-orientation="horizontal"] > :global(*:not(:first-child)) {
		border-left-width: 0;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
	}

	.buttonGroup[data-orientation="horizontal"] > :global(*:not(:last-child)) {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}

	.buttonGroup[data-orientation="vertical"] > :global(*:not(:first-child)) {
		border-top-width: 0;
		border-top-right-radius: 0;
		border-top-left-radius: 0;
	}

	.buttonGroup[data-orientation="vertical"] > :global(*:not(:last-child)) {
		border-bottom-right-radius: 0;
		border-bottom-left-radius: 0;
	}

	/* Nested groups sit apart instead of joining */
	.buttonGroup:has(> :global(.buttonGroup)) {
		gap: var(--spacing-sm);
	}
</style>
