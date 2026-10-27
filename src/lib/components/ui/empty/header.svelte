<script lang="ts">
	import type { HeaderProps } from "./index.js";
	const { children, class: className, ...props }: HeaderProps = $props();
</script>

<!-- Media, title, and description, centered in a readable width. -->
<header class={["emptyHeader", className]} {...props}>
	{@render children()}
</header>

<style>
	/* Base header; the gap comes from the size on the empty state */
	.emptyHeader {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--empty-header-gap);
		max-width: 24rem; /* 384px */
	}
</style>
