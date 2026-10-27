<script lang="ts">
	import { slide } from "svelte/transition";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { ContentProps } from "./index.js";
	const { children, class: className, ...props }: ContentProps = $props();
	const ctx = useCompCtx();
	// Skip the height animation for people who ask for less motion.
	const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
</script>

<!-- Content controlled by the trigger; it slides open and closed. -->
{#if ctx.open}
	<div class={["collapsibleContent", className]} id={ctx.contentId} data-state="open" transition:slide={{ duration: prefersReducedMotion ? 0 : 200 }} {...props}>
		{@render children()}
	</div>
{/if}
