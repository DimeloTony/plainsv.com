<script lang="ts">
	import type { Props } from "./index.js";
	const { children, size = "md", class: className, ...props }: Props = $props();
</script>

<!-- Navigation landmark; sets the text size and the variables its parts read. -->
<nav class={["breadcrumb not-typeset", className]} aria-label="breadcrumb" data-size={size} {...props}>
	{@render children()}
</nav>

<style>
	/* =============== Sizes =============== */

	/* Large */
	.breadcrumb[data-size="lg"] {
		--breadcrumb-gap: var(--spacing-md);
		--breadcrumb-icon: var(--text-md);
		font-size: var(--text-md);
		line-height: var(--line-height-md);
	}

	/* Medium — default */
	.breadcrumb[data-size="md"] {
		--breadcrumb-gap: var(--spacing-sm);
		--breadcrumb-icon: var(--text-sm);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Small */
	.breadcrumb[data-size="sm"] {
		--breadcrumb-gap: calc(var(--spacing-xs) + var(--spacing-xs) / 2);
		--breadcrumb-icon: var(--text-sm);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Extra small */
	.breadcrumb[data-size="xs"] {
		--breadcrumb-gap: var(--spacing-xs);
		--breadcrumb-icon: var(--text-xs);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}
</style>
