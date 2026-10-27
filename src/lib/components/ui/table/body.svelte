<script lang="ts">
	import type { BodyProps } from "./index.js";
	const { children, class: className, ...props }: BodyProps = $props();
</script>

<!-- Body rows. -->
<tbody class={["tableBody", className]} {...props}>
	{@render children()}
</tbody>

<style>
	/* The last row drops its border so it does not double the table edge */
	.tableBody :global(tr:last-child) {
		border-bottom: 0;
	}
</style>
