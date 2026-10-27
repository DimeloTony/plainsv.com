<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	import type { FooterProps } from "./index.js";
	const { children, class: className, ...props }: FooterProps = $props();
	const ctx = useCompCtx();
</script>

<!-- Action buttons; stacked with the action on top on narrow screens. -->
<footer class={["alertDialogFooter", className]} data-size={ctx.size} {...props}>
	{@render children()}
</footer>

<style>
	/* Base footer; reversed so the action, written last, sits on top */
	.alertDialogFooter {
		display: flex;
		flex-direction: column-reverse;
		gap: var(--spacing-sm);
	}

	/* A row aligned to the end once the panel is wide enough */
	@media (min-width: 40rem) {
		.alertDialogFooter {
			flex-direction: row;
			justify-content: flex-end;
		}
	}

	/* =============== Sizes =============== */

	/* Extra small */
	.alertDialogFooter[data-size="xs"] {
		gap: var(--spacing-xs);
	}
</style>
