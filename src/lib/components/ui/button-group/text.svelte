<script lang="ts">
	import type { TextProps } from "./index.js";
	const { size = "md", children, class: className, ...props }: TextProps = $props();
</script>

<!-- Static label joined with the buttons, such as a prefix or unit. -->
<div class={["buttonGroupText", className]} data-size={size} {...props}>
	{@render children()}
</div>

<style>
	/* Base text */
	.buttonGroupText {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		box-sizing: border-box;
		box-shadow: 0 1px 2px 0 color-mix(in oklab, var(--foreground) 5%, transparent);
		border: 1px solid var(--border);
		background-color: var(--muted);
		color: var(--foreground);
		font-weight: 500;
		white-space: nowrap;
	}

	.buttonGroupText :global(svg) {
		flex-shrink: 0;
		width: 1rem; /* 16px */
		height: 1rem; /* 16px */
		pointer-events: none;
	}

	/* =============== Sizes =============== */

	/* Large */
	.buttonGroupText[data-size="lg"] {
		border-radius: var(--radius-lg);
		padding-inline: var(--spacing-lg);
		min-height: var(--control-height-lg);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Medium — default */
	.buttonGroupText[data-size="md"] {
		border-radius: var(--radius-md);
		padding-inline: var(--spacing-lg);
		min-height: var(--control-height-md);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Small */
	.buttonGroupText[data-size="sm"] {
		border-radius: var(--radius-sm);
		padding-inline: var(--spacing-md);
		min-height: var(--control-height-sm);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Extra small */
	.buttonGroupText[data-size="xs"] {
		border-radius: var(--radius-xs);
		padding-inline: var(--spacing-sm);
		min-height: var(--control-height-xs);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}
</style>
