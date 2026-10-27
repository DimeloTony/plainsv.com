<script lang="ts">
	import type { Props } from "./index.js";
	const { variant = "default", size = "lg", rounded, children, class: className, ...props }: Props = $props();
</script>

<!-- Centered empty state; sets the gap variable its header reads. -->
<div class={["empty not-typeset", className]} data-variant={variant} data-size={size} data-rounded={rounded} {...props}>
	{@render children()}
</div>

<style>
	/* Base empty state */
	.empty {
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
		border: 1px dashed transparent;
		min-width: 0;
		text-align: center;
		text-wrap: balance;
	}

	/* =============== Variants =============== */

	.empty[data-variant="outline"] {
		border-color: var(--border);
	}

	/* =============== Sizes =============== */

	/* Large — default */
	.empty[data-size="lg"] {
		--empty-header-gap: var(--spacing-sm);
		gap: var(--spacing-xl);
		border-radius: var(--radius-lg);
		padding: calc(var(--spacing-xl) * 2); /* 48px */
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Medium */
	.empty[data-size="md"] {
		--empty-header-gap: var(--spacing-sm);
		gap: var(--spacing-lg);
		border-radius: var(--radius-md);
		padding: var(--spacing-xl);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Small */
	.empty[data-size="sm"] {
		--empty-header-gap: var(--spacing-xs);
		gap: var(--spacing-md);
		border-radius: var(--radius-sm);
		padding: var(--spacing-lg);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Extra small */
	.empty[data-size="xs"] {
		--empty-header-gap: var(--spacing-xs);
		gap: var(--spacing-sm);
		border-radius: var(--radius-xs);
		padding: var(--spacing-md);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius; must stay after the size rules */
	.empty[data-rounded="xs"] {
		border-radius: var(--radius-xs);
	}

	.empty[data-rounded="sm"] {
		border-radius: var(--radius-sm);
	}

	.empty[data-rounded="md"] {
		border-radius: var(--radius-md);
	}

	.empty[data-rounded="lg"] {
		border-radius: var(--radius-lg);
	}

	.empty[data-rounded="xl"] {
		border-radius: var(--radius-xl);
	}

	.empty[data-rounded="2xl"] {
		border-radius: var(--radius-2xl);
	}

	.empty[data-rounded="3xl"] {
		border-radius: var(--radius-3xl);
	}

	.empty[data-rounded="4xl"] {
		border-radius: var(--radius-4xl);
	}

	/* A true pill; tall content can clip at the corners, so use 3xl or 4xl to stay safe */
	.empty[data-rounded="pill"] {
		border-radius: var(--radius-pill);
	}
</style>
