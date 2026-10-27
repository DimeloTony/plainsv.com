<script lang="ts">
	import type { FooterProps } from "./index.js";
	const { children, class: className, ...props }: FooterProps = $props();
</script>

<!-- Footer row for actions or meta text. -->
<footer class={["cardFooter", className]} {...props}>
	{@render children()}
</footer>

<style>
	/* Base footer */
	.cardFooter {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
	}
</style>
