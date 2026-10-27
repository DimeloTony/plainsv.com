<script lang="ts">
	import type { InsetProps } from "./index.js";
	const { children, class: className, ...props }: InsetProps = $props();
</script>

<!-- Main content beside the sidebar. -->
<main class={["sidebarInset", className]} {...props}>
	{@render children()}
</main>

<style>
	/* Base inset; takes the room beside the sidebar */
	.sidebarInset {
		display: flex;
		position: relative;
		flex: 1;
		flex-direction: column;
		background-color: var(--background);
		width: 100%;
		min-width: 0;
	}

	/* Beside an inset sidebar, the content is a rounded frame */
	@media (min-width: 48rem) {
		:global(.sidebarWrapper:has(> .sidebar[data-variant="inset"])) > .sidebarInset {
			border-radius: var(--radius-lg);
		}
	}
</style>
