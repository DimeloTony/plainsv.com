<script lang="ts">
	import type { HeaderProps } from "./index.js";
	const { children, class: className, ...props }: HeaderProps = $props();
</script>

<!-- Full-width row above the content. -->
<div class={["itemHeader", className]} {...props}>
	{@render children()}
</div>

<style>
	/* Base header; takes a full row of the wrapping item */
	.itemHeader {
		display: flex;
		flex-basis: 100%;
		justify-content: space-between;
		align-items: center;
		gap: var(--spacing-sm);
	}
</style>
