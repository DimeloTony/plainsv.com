<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	import type { HeaderProps } from "./index.js";
	const { children, class: className, ...props }: HeaderProps = $props();
	const ctx = useCompCtx();
</script>

<!-- Title and description; centered on narrow screens. -->
<header class={["alertDialogHeader", className]} data-size={ctx.size} {...props}>
	{@render children()}
</header>

<style>
	/* Base header */
	.alertDialogHeader {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		text-align: center;
	}

	/* Aligns to the start once the panel is wide enough */
	@media (min-width: 40rem) {
		.alertDialogHeader {
			text-align: left;
		}
	}

	/* =============== Sizes =============== */

	/* Extra small */
	.alertDialogHeader[data-size="xs"] {
		gap: var(--spacing-xs);
	}
</style>
