<script lang="ts">
	import { setCompCtx } from "./ctx.svelte.js";
	import type { Props } from "./index.js";
	import type { CompCtxProps } from "./ctx.svelte.js";
	const { variant = "default", size = "md", rounded, children, class: className, ...props }: Props = $props();
	const contextData: CompCtxProps = $derived({ variant, size, rounded });
	const ctx = setCompCtx({ ...contextData });

	// Keep the shared settings in sync when the props change.
	$effect.pre(() => void Object.assign(ctx, contextData));
</script>

<!-- Bar of menu triggers; one trigger is in the tab order and the arrow keys move between them. -->
<div bind:this={ctx.rootEl} class={["menubar not-typeset", className]} role="menubar" data-variant={ctx.variant} data-size={ctx.size} data-rounded={ctx.rounded} {...props}>
	{@render children()}
</div>

<style>
	/* Base bar */
	.menubar {
		display: flex;
		align-items: center;
		box-sizing: border-box;
		box-shadow: 0 1px 2px 0 color-mix(in oklab, var(--foreground) 5%, transparent);
		border: 1px solid var(--border);
		background-color: var(--background);
		padding: 0.1875rem; /* 3px */
		width: fit-content;
	}

	/* =============== Variants =============== */

	/* No container; the triggers sit on the page */
	.menubar[data-variant="ghost"] {
		box-shadow: none;
		border-color: transparent;
		background-color: transparent;
	}

	/* =============== Sizes =============== */

	/* Large; the triggers read the radius and padding */
	.menubar[data-size="lg"] {
		--menubar-trigger-radius: var(--radius-md);
		--menubar-trigger-padding: var(--spacing-md);
		gap: var(--spacing-xs);
		border-radius: var(--radius-lg);
		height: var(--control-height-lg);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Medium — default */
	.menubar[data-size="md"] {
		--menubar-trigger-radius: var(--radius-sm);
		--menubar-trigger-padding: var(--spacing-sm);
		gap: var(--spacing-xs);
		border-radius: var(--radius-md);
		height: var(--control-height-md);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Small */
	.menubar[data-size="sm"] {
		--menubar-trigger-radius: var(--radius-xs);
		--menubar-trigger-padding: calc(var(--spacing-xs) * 1.5); /* 6px */
		gap: calc(var(--spacing-xs) / 2);
		border-radius: var(--radius-sm);
		height: var(--control-height-sm);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Extra small */
	.menubar[data-size="xs"] {
		--menubar-trigger-radius: var(--radius-xs);
		--menubar-trigger-padding: var(--spacing-xs);
		gap: calc(var(--spacing-xs) / 2);
		border-radius: var(--radius-xs);
		padding: 0.125rem; /* 2px */
		height: var(--control-height-xs);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius; triggers use one step smaller so the corners nest. Must stay after the size rules */
	.menubar[data-rounded="xs"] {
		--menubar-trigger-radius: var(--radius-xs);
		border-radius: var(--radius-xs);
	}

	.menubar[data-rounded="sm"] {
		--menubar-trigger-radius: var(--radius-xs);
		border-radius: var(--radius-sm);
	}

	.menubar[data-rounded="md"] {
		--menubar-trigger-radius: var(--radius-sm);
		border-radius: var(--radius-md);
	}

	.menubar[data-rounded="lg"] {
		--menubar-trigger-radius: var(--radius-md);
		border-radius: var(--radius-lg);
	}

	.menubar[data-rounded="xl"] {
		--menubar-trigger-radius: var(--radius-lg);
		border-radius: var(--radius-xl);
	}

	.menubar[data-rounded="2xl"] {
		--menubar-trigger-radius: var(--radius-xl);
		border-radius: var(--radius-2xl);
	}

	.menubar[data-rounded="3xl"] {
		--menubar-trigger-radius: var(--radius-2xl);
		border-radius: var(--radius-3xl);
	}

	.menubar[data-rounded="4xl"] {
		--menubar-trigger-radius: var(--radius-3xl);
		border-radius: var(--radius-4xl);
	}

	.menubar[data-rounded="pill"] {
		--menubar-trigger-radius: var(--radius-pill);
		border-radius: var(--radius-pill);
	}
</style>
