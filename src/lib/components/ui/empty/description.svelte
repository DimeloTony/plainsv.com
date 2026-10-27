<script lang="ts">
	import type { DescriptionProps } from "./index.js";
	const { children, class: className, ...props }: DescriptionProps = $props();
</script>

<!-- Muted text that explains what to do next. -->
<p class={["emptyDescription", className]} {...props}>
	{@render children()}
</p>

<style>
	/* Base description; the text size comes from the empty state */
	.emptyDescription {
		margin: 0;
		color: var(--muted-foreground);
	}

	.emptyDescription :global(a) {
		color: inherit;
		text-decoration: underline;
		text-underline-offset: 0.25rem; /* 4px */
	}

	.emptyDescription :global(a:hover) {
		color: var(--primary);
	}
</style>
