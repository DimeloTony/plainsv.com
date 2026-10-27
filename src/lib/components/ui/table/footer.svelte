<script lang="ts">
	import type { FooterProps } from "./index.js";
	const { children, class: className, ...props }: FooterProps = $props();
</script>

<!-- Summary rows on a muted background. -->
<tfoot class={["tableFooter", className]} {...props}>
	{@render children()}
</tfoot>

<style>
	/* Base footer */
	.tableFooter {
		border-top: 1px solid var(--border);
		background-color: color-mix(in oklab, var(--muted) 50%, transparent);
		font-weight: 500;
	}

	.tableFooter :global(tr:last-child) {
		border-bottom: 0;
	}
</style>
