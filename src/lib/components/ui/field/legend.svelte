<script lang="ts">
	import type { LegendProps } from "./index.js";
	const { variant = "legend", children, class: className, ...props }: LegendProps = $props();
</script>

<!-- Heading of the fieldset. -->
<legend class={["fieldLegend", className]} data-variant={variant} {...props}>
	{@render children()}
</legend>

<style>
	/* Base legend; a legend ignores the fieldset gap, so it sets its own space below */
	.fieldLegend {
		padding: 0 0 var(--spacing-md);
		font-weight: 500;
	}

	/* =============== Variants =============== */

	.fieldLegend[data-variant="legend"] {
		font-size: var(--text-md);
		line-height: var(--line-height-md);
	}

	.fieldLegend[data-variant="label"] {
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}
</style>
