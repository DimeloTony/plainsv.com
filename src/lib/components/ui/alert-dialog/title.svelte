<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	import type { TitleProps } from "./index.js";
	const { children, class: className, ...props }: TitleProps = $props();
	const ctx = useCompCtx();
</script>

<!-- Heading that names the alert dialog through aria-labelledby. -->
<h2 class={["alertDialogTitle", className]} id={ctx.titleId} data-size={ctx.size} {...props}>
	{@render children()}
</h2>

<style>
	/* Base title */
	.alertDialogTitle {
		margin: 0;
		font-weight: 600;
	}

	/* =============== Sizes =============== */

	/* Large — default */
	.alertDialogTitle[data-size="lg"] {
		font-size: var(--text-md);
		line-height: var(--line-height-md);
	}

	/* Medium */
	.alertDialogTitle[data-size="md"] {
		font-size: var(--text-md);
		line-height: var(--line-height-md);
	}

	/* Small */
	.alertDialogTitle[data-size="sm"] {
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Extra small */
	.alertDialogTitle[data-size="xs"] {
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}
</style>
