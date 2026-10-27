<script lang="ts">
	import type { Props } from "./index.js";
	const { children, size = "md", class: className, ...props }: Props = $props();
</script>

<!-- Scroll container; sets the size variables its cells read. -->
<div class="tableContainer not-typeset" data-size={size}>
	<table class={["table", className]} {...props}>
		{@render children()}
	</table>
</div>

<style>
	/* Container scrolls sideways when the table is wider than it */
	.tableContainer {
		position: relative;
		width: 100%;
		overflow-x: auto;
	}

	/* Base table; the caption sits under the rows */
	.table {
		border-collapse: collapse;
		width: 100%;
		caption-side: bottom;
		color: var(--foreground);
	}

	/* =============== Sizes =============== */

	/* Large */
	.tableContainer[data-size="lg"] {
		--table-head-height: 3rem; /* 48px */
		--table-cell-padding: var(--spacing-md);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Medium — default */
	.tableContainer[data-size="md"] {
		--table-head-height: var(--control-height-lg);
		--table-cell-padding: var(--spacing-sm);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Small */
	.tableContainer[data-size="sm"] {
		--table-head-height: var(--control-height-md);
		--table-cell-padding: calc(var(--spacing-xs) * 1.5); /* 6px */
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Extra small */
	.tableContainer[data-size="xs"] {
		--table-head-height: var(--control-height-sm);
		--table-cell-padding: var(--spacing-xs);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}
</style>
