<script lang="ts">
	import type { ContentProps } from "./index.js";
	const { children, class: className, ...props }: ContentProps = $props();
</script>

<!-- Actions under the header, such as buttons or a search input. -->
<div class={["emptyContent", className]} {...props}>
	{@render children()}
</div>

<style>
	/* Base content */
	.emptyContent {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-lg);
		width: 100%;
		min-width: 0;
		max-width: 24rem; /* 384px */
	}
</style>
