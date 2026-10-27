<script lang="ts">
	import type { RowProps } from "./index.js";
	const { children, class: className, ...props }: RowProps = $props();
</script>

<!-- One row; highlighted on hover and while `data-state="selected"`. -->
<tr class={["tableRow", className]} {...props}>
	{@render children()}
</tr>

<style>
	/* Base row */
	.tableRow {
		transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1);
		border-bottom: 1px solid var(--border);
	}

	.tableRow:hover {
		background-color: color-mix(in oklab, var(--muted) 50%, transparent);
	}

	/* =============== States =============== */

	/* Selected row */
	.tableRow[data-state="selected"] {
		background-color: var(--muted);
	}
</style>
