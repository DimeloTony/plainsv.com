<script lang="ts">
	import type { FooterProps } from "./index.js";
	const { children, class: className, ...props }: FooterProps = $props();
</script>

<!-- Row at the bottom of the sidebar, such as a user menu. -->
<div class={["sidebarFooter", className]} {...props}>
	{@render children()}
</div>

<style>
	/* Base footer */
	.sidebarFooter {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		padding: var(--spacing-sm);
	}
</style>
