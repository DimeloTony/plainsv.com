<script lang="ts">
	import type { MediaProps } from "./index.js";
	const { variant = "default", children, class: className, ...props }: MediaProps = $props();
</script>

<!-- Icon, image, or avatar above the title. -->
<div class={["emptyMedia", className]} data-variant={variant} {...props}>
	{@render children()}
</div>

<style>
	/* Base media */
	.emptyMedia {
		display: flex;
		flex-shrink: 0;
		justify-content: center;
		align-items: center;
		margin-bottom: var(--spacing-sm);
	}

	/* =============== Variants =============== */

	/* Icon on a muted square */
	.emptyMedia[data-variant="icon"] {
		border-radius: var(--radius-lg);
		background-color: var(--muted);
		width: var(--control-height-lg);
		height: var(--control-height-lg);
		color: var(--foreground);
	}

	.emptyMedia[data-variant="icon"] :global(svg) {
		flex-shrink: 0;
		width: 1.5rem; /* 24px */
		height: 1.5rem; /* 24px */
	}
</style>
