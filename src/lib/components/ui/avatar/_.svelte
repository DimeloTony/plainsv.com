<script lang="ts">
	import { setCompCtx } from "./ctx.svelte.js";
	import type { Props } from "./index.js";
	const { children, variant = "default", size = "sm", rounded = "pill", class: className, ...props }: Props = $props();
	setCompCtx({ status: "loading" });
</script>

<!-- Avatar frame; the image covers the fallback once it loads. -->
<span class={["avatar not-typeset", className]} data-variant={variant} data-size={size} data-rounded={rounded} {...props}>
	{@render children()}
</span>

<style>
	/* Base avatar; relative so the image can cover the fallback */
	.avatar {
		display: inline-flex;
		position: relative;
		flex-shrink: 0;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
		border: 1px solid transparent;
		overflow: hidden;
		font-weight: 500;
		user-select: none;
	}

	/* =============== Variants =============== */

	/* Muted backdrop for the fallback */
	.avatar[data-variant="default"] {
		background-color: var(--muted);
		color: var(--muted-foreground);
	}

	.avatar[data-variant="secondary"] {
		background-color: var(--secondary);
		color: var(--secondary-foreground);
	}

	/* Bordered frame that stays visible around the image */
	.avatar[data-variant="outline"] {
		border-color: var(--border);
		background-color: var(--background);
		color: var(--foreground);
	}

	:global(.dark) .avatar[data-variant="outline"] {
		border-color: var(--input);
	}

	/* =============== Sizes =============== */

	/* Large */
	.avatar[data-size="lg"] {
		border-radius: var(--radius-lg);
		width: var(--control-height-lg);
		height: var(--control-height-lg);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Medium — default */
	.avatar[data-size="md"] {
		border-radius: var(--radius-md);
		width: var(--control-height-md);
		height: var(--control-height-md);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Small */
	.avatar[data-size="sm"] {
		border-radius: var(--radius-sm);
		width: var(--control-height-sm);
		height: var(--control-height-sm);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* Extra small */
	.avatar[data-size="xs"] {
		border-radius: var(--radius-xs);
		width: var(--control-height-xs);
		height: var(--control-height-xs);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* Fallback icons scale with the avatar */
	.avatar :global(svg) {
		flex-shrink: 0;
		width: 1rem; /* 16px */
		height: 1rem; /* 16px */
	}

	.avatar[data-size="sm"] :global(svg) {
		width: var(--text-sm);
		height: var(--text-sm);
	}

	.avatar[data-size="xs"] :global(svg) {
		width: var(--text-xs);
		height: var(--text-xs);
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius; must stay after the size rules */
	.avatar[data-rounded="xs"] {
		border-radius: var(--radius-xs);
	}

	.avatar[data-rounded="sm"] {
		border-radius: var(--radius-sm);
	}

	.avatar[data-rounded="md"] {
		border-radius: var(--radius-md);
	}

	.avatar[data-rounded="lg"] {
		border-radius: var(--radius-lg);
	}

	.avatar[data-rounded="xl"] {
		border-radius: var(--radius-xl);
	}

	.avatar[data-rounded="2xl"] {
		border-radius: var(--radius-2xl);
	}

	.avatar[data-rounded="3xl"] {
		border-radius: var(--radius-3xl);
	}

	.avatar[data-rounded="4xl"] {
		border-radius: var(--radius-4xl);
	}

	.avatar[data-rounded="pill"] {
		border-radius: var(--radius-pill);
	}
</style>
