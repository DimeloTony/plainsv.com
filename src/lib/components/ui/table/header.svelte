<script lang="ts">
	import type { HeaderProps } from "./index.js";
	const { children, class: className, ...props }: HeaderProps = $props();
</script>

<!-- Header rows, divided from the body by a border. -->
<thead class={["tableHeader", className]} {...props}>
	{@render children()}
</thead>

<style>
	/* Every header row keeps its bottom border */
	.tableHeader :global(tr) {
		border-bottom: 1px solid var(--border);
	}
</style>
