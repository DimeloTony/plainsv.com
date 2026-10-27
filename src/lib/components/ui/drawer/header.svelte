<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	import type { HeaderProps } from "./index.js";
	const { children, class: className, ...props }: HeaderProps = $props();
	const ctx = useCompCtx();
</script>

<!-- Title and description; centered in top and bottom drawers on narrow screens. -->
<header class={["drawerHeader", className]} data-direction={ctx.direction} {...props}>
	{@render children()}
</header>

<style>
	/* Base header; the padding comes from the size on the drawer */
	.drawerHeader {
		display: flex;
		flex-direction: column;
		gap: calc(var(--spacing-xs) / 2);
		padding: var(--drawer-padding);
		touch-action: none; /* touch drags start on the header, so the content can still scroll */
	}

	.drawerHeader[data-direction="top"],
	.drawerHeader[data-direction="bottom"] {
		text-align: center;
	}

	/* Aligns to the start once the screen is wide enough */
	@media (min-width: 48rem) {
		.drawerHeader[data-direction="top"],
		.drawerHeader[data-direction="bottom"] {
			text-align: left;
		}
	}
</style>
