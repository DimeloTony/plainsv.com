<script lang="ts">
	import type { Props } from "./index.js";
	const { children, size = "md", rounded, class: className, ...props }: Props = $props();
</script>

<!-- One key, such as ⌘ or Enter. -->
<kbd class={["kbd not-typeset", className]} data-size={size} data-rounded={rounded} {...props}>
	{@render children()}
</kbd>

<style>
	/* Base key */
	.kbd {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
		background-color: var(--muted);
		width: fit-content;
		pointer-events: none;
		color: var(--muted-foreground);
		font-weight: 500;
		font-family: var(--font-sans, ui-sans-serif, system-ui, sans-serif);
		user-select: none;
	}

	.kbd :global(svg) {
		flex-shrink: 0;
	}

	/* =============== Sizes =============== */

	/* Large */
	.kbd[data-size="lg"] {
		gap: var(--spacing-xs);
		border-radius: var(--radius-md);
		padding-inline: calc(var(--spacing-xs) * 1.5); /* 6px */
		min-width: var(--control-height-xs);
		height: var(--control-height-xs);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	.kbd[data-size="lg"] :global(svg) {
		width: var(--text-sm);
		height: var(--text-sm);
	}

	/* Medium — default */
	.kbd[data-size="md"] {
		gap: var(--spacing-xs);
		border-radius: var(--radius-sm);
		padding-inline: var(--spacing-xs);
		min-width: 1.25rem; /* 20px */
		height: 1.25rem; /* 20px */
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* Small */
	.kbd[data-size="sm"] {
		gap: calc(var(--spacing-xs) / 2);
		border-radius: var(--radius-xs);
		padding-inline: calc(var(--spacing-xs) / 2);
		min-width: 1.125rem; /* 18px */
		height: 1.125rem; /* 18px */
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* Extra small */
	.kbd[data-size="xs"] {
		gap: calc(var(--spacing-xs) / 2);
		border-radius: var(--radius-xs);
		padding-inline: calc(var(--spacing-xs) / 2);
		min-width: 1rem; /* 16px */
		height: 1rem; /* 16px */
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	.kbd[data-size="md"] :global(svg),
	.kbd[data-size="sm"] :global(svg),
	.kbd[data-size="xs"] :global(svg) {
		width: var(--text-xs);
		height: var(--text-xs);
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius; must stay after the size rules */
	.kbd[data-rounded="xs"] {
		border-radius: var(--radius-xs);
	}

	.kbd[data-rounded="sm"] {
		border-radius: var(--radius-sm);
	}

	.kbd[data-rounded="md"] {
		border-radius: var(--radius-md);
	}

	.kbd[data-rounded="lg"] {
		border-radius: var(--radius-lg);
	}

	.kbd[data-rounded="xl"] {
		border-radius: var(--radius-xl);
	}

	.kbd[data-rounded="2xl"] {
		border-radius: var(--radius-2xl);
	}

	.kbd[data-rounded="3xl"] {
		border-radius: var(--radius-3xl);
	}

	.kbd[data-rounded="4xl"] {
		border-radius: var(--radius-4xl);
	}

	.kbd[data-rounded="pill"] {
		border-radius: var(--radius-pill);
	}
</style>
