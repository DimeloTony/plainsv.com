<script lang="ts">
	import type { FooterProps } from "./index.js";
	const { children, class: className, ...props }: FooterProps = $props();
</script>

<!-- Full-width row below the content. -->
<div class={["itemFooter", className]} {...props}>
	{@render children()}
</div>

<style>
	/* Base footer; takes a full row of the wrapping item */
	.itemFooter {
		display: flex;
		flex-basis: 100%;
		justify-content: space-between;
		align-items: center;
		gap: var(--spacing-sm);
	}
</style>
