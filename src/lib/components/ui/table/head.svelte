<script lang="ts">
	import type { HeadProps } from "./index.js";
	const { children, class: className, ...props }: HeadProps = $props();
</script>

<!-- Column heading; set `scope` when a heading labels a row instead of a column. -->
<th class={["tableHead", className]} {...props}>
	{@render children()}
</th>

<style>
	/* Base heading; the height and padding come from the size on the table */
	.tableHead {
		vertical-align: middle;
		padding-inline: var(--table-cell-padding);
		height: var(--table-head-height);
		color: var(--foreground);
		font-weight: 500;
		text-align: left;
		white-space: nowrap;
	}

	/* A checkbox column stays narrow */
	.tableHead:has(:global([role="checkbox"])) {
		padding-right: 0;
	}
</style>
