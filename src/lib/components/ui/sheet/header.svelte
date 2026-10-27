<script lang="ts">
	import type { HeaderProps } from "./index.js";
	const { children, class: className, ...props }: HeaderProps = $props();
</script>

<!-- Header with the title and description. -->
<header class={["sheetHeader", className]} {...props}>
	{@render children()}
</header>

<style>
	/* Base header */
	.sheetHeader {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
	}
</style>
