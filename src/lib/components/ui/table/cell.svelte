<script lang="ts">
	import type { CellProps } from "./index.js";
	const { children, class: className, ...props }: CellProps = $props();
</script>

<!-- Data cell. -->
<td class={["tableCell", className]} {...props}>
	{@render children()}
</td>

<style>
	/* Base cell; the padding comes from the size on the table */
	.tableCell {
		vertical-align: middle;
		padding: var(--table-cell-padding);
		white-space: nowrap;
	}

	/* A checkbox column stays narrow */
	.tableCell:has(:global([role="checkbox"])) {
		padding-right: 0;
	}
</style>
