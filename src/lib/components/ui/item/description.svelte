<script lang="ts">
	import type { DescriptionProps } from "./index.js";
	const { children, class: className, ...props }: DescriptionProps = $props();
</script>

<!-- Muted text under the title. -->
<p class={["itemDescription", className]} {...props}>
	{@render children()}
</p>

<style>
	/* Base description; clamped to two lines */
	.itemDescription {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		margin: 0;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow: hidden;
		color: var(--muted-foreground);
		text-wrap: balance;
	}

	.itemDescription :global(a) {
		color: inherit;
		text-decoration: underline;
		text-underline-offset: 0.25rem; /* 4px */
	}

	.itemDescription :global(a:hover) {
		color: var(--primary);
	}
</style>
