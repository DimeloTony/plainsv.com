<script lang="ts">
	import type { MediaProps } from "./index.js";
	const { variant = "default", children, class: className, ...props }: MediaProps = $props();
</script>

<!-- Icon, avatar, or image at the start of the item. -->
<div class={["itemMedia", className]} data-variant={variant} {...props}>
	{@render children()}
</div>

<style>
	/* Base media; lines up with the title when the item has a description */
	.itemMedia {
		display: flex;
		flex-shrink: 0;
		justify-content: center;
		align-items: center;
		gap: var(--spacing-sm);
	}

	.itemMedia :global(svg) {
		flex-shrink: 0;
		width: 1rem; /* 16px */
		height: 1rem; /* 16px */
		pointer-events: none;
	}

	/* =============== Variants =============== */

	/* Icon in a bordered muted square */
	.itemMedia[data-variant="icon"] {
		box-sizing: border-box;
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		background-color: var(--muted);
		width: var(--control-height-sm);
		height: var(--control-height-sm);
	}

	/* Image cropped to a square */
	.itemMedia[data-variant="image"] {
		border-radius: var(--radius-sm);
		width: var(--control-height-lg);
		height: var(--control-height-lg);
		overflow: hidden;
	}

	.itemMedia[data-variant="image"] :global(img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
