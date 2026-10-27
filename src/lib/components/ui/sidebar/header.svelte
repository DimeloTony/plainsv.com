<script lang="ts">
	import type { HeaderProps } from "./index.js";
	const { children, class: className, ...props }: HeaderProps = $props();
</script>

<!-- Row at the top of the sidebar, such as a team switcher. -->
<div class={["sidebarHeader", className]} {...props}>
	{@render children()}
</div>

<style>
	/* Base header */
	.sidebarHeader {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		padding: var(--spacing-sm);
	}
</style>
