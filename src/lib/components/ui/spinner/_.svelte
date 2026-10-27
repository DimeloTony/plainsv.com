<script lang="ts">
	import type { Props } from "./index.js";
	const { variant = "default", size = "md", class: className, ...props }: Props = $props();
</script>

<!-- Status region named for screen readers; the spinning circle inside is decorative. -->
<span class={["spinner not-typeset", className]} role="status" aria-label="Loading" data-variant={variant} data-size={size} {...props}>
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
		<path d="M21 12a9 9 0 1 1-6.219-8.56" />
	</svg>
</span>

<style>
	/* Base spinner; sits inline with text and buttons */
	.spinner {
		display: inline-flex;
		flex-shrink: 0;
		justify-content: center;
		align-items: center;
	}

	/* Fills the spinner, even inside parents that size their own icons */
	.spinner svg {
		animation: spinnerRotate 1s linear infinite;
		width: 100%;
		height: 100%;
	}

	/* If the user prefers reduced motion: spin slower instead of stopping, so loading stays visible. */
	@media (prefers-reduced-motion: reduce) {
		.spinner svg {
			animation-duration: 3s;
		}
	}

	@keyframes spinnerRotate {
		to {
			transform: rotate(360deg);
		}
	}

	/* =============== Variants =============== */

	/* Follows the surrounding text color, such as a button's label */
	.spinner[data-variant="default"] {
		color: currentColor;
	}

	.spinner[data-variant="destructive"] {
		color: var(--destructive);
	}

	/* =============== Sizes =============== */

	/* Large */
	.spinner[data-size="lg"] {
		width: 1.25rem; /* 20px */
		height: 1.25rem; /* 20px */
	}

	/* Medium — default */
	.spinner[data-size="md"] {
		width: 1rem; /* 16px */
		height: 1rem; /* 16px */
	}

	/* Small */
	.spinner[data-size="sm"] {
		width: var(--text-sm);
		height: var(--text-sm);
	}

	/* Extra small */
	.spinner[data-size="xs"] {
		width: var(--text-xs);
		height: var(--text-xs);
	}
</style>
