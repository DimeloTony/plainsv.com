<script lang="ts">
	import Orbling from "./_.svelte";
	import { MOODS } from "./moods.js";
	import type { StatusProps } from "./index.js";
	const { mood = "idle", variant = "default", size = "sm", label, class: className, ...props }: StatusProps = $props();
</script>

<!-- Small orb with the mood label beside it, announced as a status. -->
<span class={["orblingStatus not-typeset", className]} role="status" data-size={size} {...props}>
	<Orbling {mood} {variant} size="xs" />
	<span class="shimmer">{label ?? MOODS[mood].label}</span>
</span>

<style>
	/* Base status line */
	.orblingStatus {
		display: inline-flex;
		align-items: center;
		color: var(--muted-foreground);
	}

	/* =============== Sizes =============== */

	/* Large */
	.orblingStatus[data-size="lg"] {
		gap: var(--spacing-md);
		font-size: var(--text-md);
		line-height: var(--line-height-md);
	}

	/* Medium */
	.orblingStatus[data-size="md"] {
		gap: var(--spacing-sm);
		font-size: var(--text-md);
		line-height: var(--line-height-md);
	}

	/* Small — default */
	.orblingStatus[data-size="sm"] {
		gap: var(--spacing-sm);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Extra small */
	.orblingStatus[data-size="xs"] {
		gap: var(--spacing-xs);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}
</style>
