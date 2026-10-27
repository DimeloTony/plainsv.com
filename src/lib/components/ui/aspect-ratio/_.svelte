<script lang="ts">
	import type { Props } from "./index.js";
	const { ratio = 1, rounded, children, class: className, ...props }: Props = $props();
</script>

<!-- Fills the width and sets the height from the ratio; images and videos inside cover it. -->
<div class={["aspectRatio not-typeset", className]} data-rounded={rounded} style:aspect-ratio={ratio} {...props}>
	{@render children()}
</div>

<style>
	/* Base box */
	.aspectRatio {
		position: relative;
		width: 100%;
	}

	/* Media fills the box and crops to the ratio */
	.aspectRatio > :global(img),
	.aspectRatio > :global(video),
	.aspectRatio > :global(iframe) {
		display: block;
		border: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* =============== Rounded =============== */

	/* Rounds the box and clips the media to its corners */
	.aspectRatio[data-rounded] {
		overflow: hidden;
	}

	.aspectRatio[data-rounded="xs"] {
		border-radius: var(--radius-xs);
	}

	.aspectRatio[data-rounded="sm"] {
		border-radius: var(--radius-sm);
	}

	.aspectRatio[data-rounded="md"] {
		border-radius: var(--radius-md);
	}

	.aspectRatio[data-rounded="lg"] {
		border-radius: var(--radius-lg);
	}

	.aspectRatio[data-rounded="xl"] {
		border-radius: var(--radius-xl);
	}

	.aspectRatio[data-rounded="2xl"] {
		border-radius: var(--radius-2xl);
	}

	.aspectRatio[data-rounded="3xl"] {
		border-radius: var(--radius-3xl);
	}

	.aspectRatio[data-rounded="4xl"] {
		border-radius: var(--radius-4xl);
	}

	/* A true pill; tall content can clip at the corners, so use 3xl or 4xl to stay safe */
	.aspectRatio[data-rounded="pill"] {
		border-radius: var(--radius-pill);
	}
</style>
