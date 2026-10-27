<script lang="ts">
	import type { Props } from "./index.js";
	const { rounded, class: className, ...props }: Props = $props();
</script>

<!-- Decorative placeholder; mark the loading region with aria-busy instead. -->
<div class={["skeleton not-typeset", className]} data-rounded={rounded} aria-hidden="true" {...props}></div>

<style>
	/* Base skeleton */
	.skeleton {
		flex-shrink: 0;
		animation: skeletonPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
		border-radius: var(--radius-md);
		background-color: var(--accent);
	}

	/* If the user prefers reduced motion: hold still at full opacity. */
	@media (prefers-reduced-motion: reduce) {
		.skeleton {
			animation: none;
		}
	}

	@keyframes skeletonPulse {
		50% {
			opacity: 50%;
		}
	}

	/* =============== Rounded =============== */

	/* Overrides the default radius */
	.skeleton[data-rounded="xs"] {
		border-radius: var(--radius-xs);
	}

	.skeleton[data-rounded="sm"] {
		border-radius: var(--radius-sm);
	}

	.skeleton[data-rounded="md"] {
		border-radius: var(--radius-md);
	}

	.skeleton[data-rounded="lg"] {
		border-radius: var(--radius-lg);
	}

	.skeleton[data-rounded="xl"] {
		border-radius: var(--radius-xl);
	}

	.skeleton[data-rounded="2xl"] {
		border-radius: var(--radius-2xl);
	}

	.skeleton[data-rounded="3xl"] {
		border-radius: var(--radius-3xl);
	}

	.skeleton[data-rounded="4xl"] {
		border-radius: var(--radius-4xl);
	}

	.skeleton[data-rounded="pill"] {
		border-radius: var(--radius-pill);
	}
</style>
