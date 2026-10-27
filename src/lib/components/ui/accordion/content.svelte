<script lang="ts">
	import { slide } from "svelte/transition";
	import { useCompCtx, useItemCtx } from "./ctx.svelte.js";
	import type { ContentProps } from "./index.js";
	const { children, class: className, ...props }: ContentProps = $props();
	const ctx = useCompCtx();
	const itemCtx = useItemCtx();
	// Skip the height animation for people who ask for less motion.
	const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	const isOpen = $derived(ctx.isOpen(itemCtx.value));
</script>

<!-- Region named by its trigger; it slides open and closed. -->
{#if isOpen}
	<div class={["accordionContent", className]} id={ctx.contentId(itemCtx.value)} role="region" aria-labelledby={ctx.triggerId(itemCtx.value)} transition:slide={{ duration: prefersReducedMotion ? 0 : 200 }} {...props}>
		<!-- Inner wrapper holds the padding, so the slide does not animate it. -->
		<div class="accordionContentInner">
			{@render children()}
		</div>
	</div>
{/if}

<style>
	/* Stacks paragraphs and other blocks with a gap instead of their margins */
	.accordionContentInner {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
		padding-bottom: var(--accordion-padding-block);
	}

	.accordionContentInner :global(p) {
		margin: 0;
	}
</style>
