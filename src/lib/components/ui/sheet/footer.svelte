<script lang="ts">
	import type { FooterProps } from "./index.js";
	const { children, class: className, ...props }: FooterProps = $props();
</script>

<!-- Footer for actions, pinned to the end of the panel. -->
<footer class={["sheetFooter", className]} {...props}>
	{@render children()}
</footer>

<style>
	/* Base footer; the auto margin pushes it to the end of the panel instead of adding space */
	.sheetFooter {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		margin-top: auto;
	}
</style>
