<script lang="ts">
	import type { Props } from "./index.js";
	const { value, max = 100, variant = "default", size = "sm", rounded, class: className, ...props }: Props = $props();
	const isIndeterminate = $derived(value === undefined || value === null || !(max > 0));
	// Keep the value inside the track so the indicator never overflows or goes negative.
	const clampedValue = $derived(isIndeterminate ? 0 : Math.min(Math.max(value ?? 0, 0), max));
	const percent = $derived((clampedValue / max) * 100);
	const state = $derived(isIndeterminate ? "indeterminate" : clampedValue === max ? "complete" : "loading");
</script>

<!-- Track with an indicator that slides in from the left; screen readers read the aria values. -->
<div class={["progress not-typeset", className]} role="progressbar" aria-valuemin={0} aria-valuemax={max} aria-valuenow={isIndeterminate ? undefined : clampedValue} data-state={state} data-variant={variant} data-size={size} data-rounded={rounded} {...props}>
	<div class="progressIndicator" style:transform={isIndeterminate ? undefined : `translateX(-${100 - percent}%)`}></div>
</div>

<style>
	/* Base track; clips the indicator as it slides in */
	.progress {
		position: relative;
		box-sizing: border-box;
		width: 100%;
		overflow: hidden;
	}

	/* Full-width indicator moved left by the remaining amount */
	.progressIndicator {
		transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
		border-radius: inherit;
		width: 100%;
		height: 100%;
	}

	/* =============== Variants =============== */

	.progress[data-variant="default"] {
		background-color: color-mix(in oklab, var(--primary) 20%, transparent);
	}

	.progress[data-variant="default"] .progressIndicator {
		background-color: var(--primary);
	}

	.progress[data-variant="destructive"] {
		background-color: color-mix(in oklab, var(--destructive) 20%, transparent);
	}

	.progress[data-variant="destructive"] .progressIndicator {
		background-color: var(--destructive);
	}

	/* =============== States =============== */

	/* A short indicator sweeps across the track while the amount is unknown */
	.progress[data-state="indeterminate"] .progressIndicator {
		animation: progressSweep 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
		width: 40%;
	}

	/* If the user prefers reduced motion: pulse in place instead of sweeping. */
	@media (prefers-reduced-motion: reduce) {
		.progress[data-state="indeterminate"] .progressIndicator {
			animation: progressPulse 2s ease-in-out infinite;
			width: 100%;
		}
	}

	@keyframes progressSweep {
		from {
			transform: translateX(-100%);
		}
		to {
			transform: translateX(250%);
		}
	}

	@keyframes progressPulse {
		50% {
			opacity: 40%;
		}
	}

	/* =============== Sizes =============== */

	/* Large */
	.progress[data-size="lg"] {
		border-radius: var(--radius-lg);
		height: var(--spacing-lg);
	}

	/* Medium */
	.progress[data-size="md"] {
		border-radius: var(--radius-md);
		height: var(--spacing-md);
	}

	/* Small — default */
	.progress[data-size="sm"] {
		border-radius: var(--radius-sm);
		height: var(--spacing-sm);
	}

	/* Extra small */
	.progress[data-size="xs"] {
		border-radius: var(--radius-xs);
		height: var(--spacing-xs);
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius; must stay after the size rules */
	.progress[data-rounded="xs"] {
		border-radius: var(--radius-xs);
	}

	.progress[data-rounded="sm"] {
		border-radius: var(--radius-sm);
	}

	.progress[data-rounded="md"] {
		border-radius: var(--radius-md);
	}

	.progress[data-rounded="lg"] {
		border-radius: var(--radius-lg);
	}

	.progress[data-rounded="xl"] {
		border-radius: var(--radius-xl);
	}

	.progress[data-rounded="2xl"] {
		border-radius: var(--radius-2xl);
	}

	.progress[data-rounded="3xl"] {
		border-radius: var(--radius-3xl);
	}

	.progress[data-rounded="4xl"] {
		border-radius: var(--radius-4xl);
	}

	.progress[data-rounded="pill"] {
		border-radius: var(--radius-pill);
	}
</style>
