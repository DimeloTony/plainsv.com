<script lang="ts">
	import type { FooterProps } from "./index.js";
	const { children, class: className, ...props }: FooterProps = $props();
</script>

<!-- Actions pinned to the bottom of the drawer. -->
<footer class={["drawerFooter", className]} {...props}>
	{@render children()}
</footer>

<style>
	/* Base footer; pushed to the bottom of the panel */
	.drawerFooter {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		margin-top: auto;
		padding: var(--drawer-padding);
	}
</style>
