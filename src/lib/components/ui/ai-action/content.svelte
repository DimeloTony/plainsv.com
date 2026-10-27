<script lang="ts">
	import { slide } from "svelte/transition";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { ContentProps } from "./index.js";
	const { children, class: className, ...props }: ContentProps = $props();
	const ctx = useCompCtx();
	// Skip the height animation for people who ask for less motion.
	const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
</script>

<!-- Details under the title; they slide open and closed. -->
{#if ctx.open}
	<div class={["aiActionContent", className]} id={ctx.contentId} transition:slide={{ duration: prefersReducedMotion ? 0 : 200 }} {...props}>
		{@render children()}
	</div>
{/if}

<style>
	/* Indented under the title, past the icon and gap */
	.aiActionContent {
		position: relative;
		padding-top: var(--spacing-sm);
		padding-left: calc(var(--ai-action-icon) + var(--ai-action-gap));
		font-size: var(--ai-action-content-text);
		line-height: var(--line-height-sm);
	}

	/* Line down the middle of the icon column */
	.aiActionContent::before {
		position: absolute;
		top: calc(var(--spacing-sm) * 2);
		bottom: var(--spacing-xs);
		left: calc(var(--ai-action-icon) / 2 - 1px);
		border-radius: var(--radius-pill);
		background-color: var(--border);
		width: 2px;
		content: "";
	}
</style>
