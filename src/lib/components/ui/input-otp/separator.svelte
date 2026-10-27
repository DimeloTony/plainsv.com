<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	import type { SeparatorProps } from "./index.js";
	import { MinusIcon } from "@lucide/svelte";
	const { children, class: className, ...props }: SeparatorProps = $props();
	const ctx = useCompCtx();
</script>

<!-- Divider between groups; a dash unless custom content is passed. -->
<div class={["inputOtpSeparator", className]} role="separator" data-size={ctx.size} {...props}>
	{#if children}
		{@render children()}
	{:else}
		<MinusIcon />
	{/if}
</div>

<style>
	/* Base separator */
	.inputOtpSeparator {
		display: flex;
		justify-content: center;
		align-items: center;
		pointer-events: none;
		color: var(--foreground);
	}

	.inputOtpSeparator :global(svg) {
		flex-shrink: 0;
		width: 1rem; /* 16px */
		height: 1rem; /* 16px */
	}

	/* =============== Sizes =============== */

	/* Extra small */
	.inputOtpSeparator[data-size="xs"] :global(svg) {
		width: 0.75rem; /* 12px */
		height: 0.75rem; /* 12px */
	}
</style>
