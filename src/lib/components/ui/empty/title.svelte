<script lang="ts">
	import type { TitleProps } from "./index.js";
	const { children, class: className, ...props }: TitleProps = $props();
</script>

<!-- Heading of the empty state. -->
<h3 class={["emptyTitle", className]} {...props}>
	{@render children()}
</h3>

<style>
	/* Base title; one step larger than the body text */
	.emptyTitle {
		margin: 0;
		font-weight: 500;
		font-size: var(--text-md);
		line-height: var(--line-height-md);
		letter-spacing: -0.01em;
	}
</style>
