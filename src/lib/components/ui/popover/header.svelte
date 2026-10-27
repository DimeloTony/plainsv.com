<script lang="ts">
	import type { HeaderProps } from "./index.js";
	const { children, class: className, ...props }: HeaderProps = $props();
</script>

<!-- Header with the title and description. -->
<header class={["popoverHeader", className]} {...props}>
	{@render children()}
</header>

<style>
	/* Base header */
	.popoverHeader {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
	}
</style>
