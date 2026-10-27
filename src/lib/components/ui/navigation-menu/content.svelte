<script lang="ts">
	import { scale } from "svelte/transition";
	import { useCompCtx, useItemCtx, setContentCtx } from "./ctx.svelte.js";
	import type { ContentProps } from "./index.js";
	const { align = "start", size, rounded, children, class: className, ...props }: ContentProps = $props();
	const ctx = useCompCtx();
	const itemCtx = useItemCtx();
	setContentCtx();
	// Skip the scale animation for people who ask for less motion.
	const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	const isOpen = $derived(ctx.value === itemCtx.value);
</script>

<!-- Panel below the item; the transparent top padding bridges the gap so the mouse can reach it without closing. -->
{#if isOpen}
	<div class="navigationMenuContent" id={ctx.contentId(itemCtx.value)} data-align={align} transition:scale={{ duration: prefersReducedMotion ? 0 : 150, start: 0.95 }}>
		<div class={["navigationMenuContentPanel", className]} data-state="open" data-size={size} data-rounded={rounded} {...props}>
			{@render children()}
		</div>
	</div>
{/if}

<style>
	/* Positions the panel under the item; sized to the panel rather than the narrow item */
	.navigationMenuContent {
		position: absolute;
		top: 100%;
		z-index: 50;
		padding-top: calc(var(--spacing-xs) * 1.5); /* 6px */
		width: max-content;
		max-width: calc(100vw - 2rem);
	}

	.navigationMenuContent[data-align="start"] {
		left: 0;
		transform-origin: top left;
	}

	.navigationMenuContent[data-align="end"] {
		right: 0;
		transform-origin: top right;
	}

	/* Visible panel */
	.navigationMenuContentPanel {
		box-sizing: border-box;
		border: 1px solid var(--border);
		border-radius: var(--navigation-menu-content-radius);
		background-color: var(--popover);
		padding: var(--navigation-menu-content-padding);
		color: var(--popover-foreground);
	}

	/* =============== Sizes =============== */

	/* Overrides the menu size for this panel; the link variables reach the links inside it */

	/* Large */
	.navigationMenuContentPanel[data-size="lg"] {
		--navigation-menu-inner-radius: var(--radius-md);
		--navigation-menu-link-padding: var(--spacing-md);
		border-radius: var(--radius-lg);
		padding: var(--spacing-sm);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Medium */
	.navigationMenuContentPanel[data-size="md"] {
		--navigation-menu-inner-radius: var(--radius-sm);
		--navigation-menu-link-padding: var(--spacing-sm);
		border-radius: var(--radius-md);
		padding: var(--spacing-sm);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Small */
	.navigationMenuContentPanel[data-size="sm"] {
		--navigation-menu-inner-radius: var(--radius-xs);
		--navigation-menu-link-padding: calc(var(--spacing-xs) * 1.5); /* 6px */
		border-radius: var(--radius-sm);
		padding: var(--spacing-xs);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Extra small */
	.navigationMenuContentPanel[data-size="xs"] {
		--navigation-menu-inner-radius: var(--radius-xs);
		--navigation-menu-link-padding: var(--spacing-xs);
		border-radius: var(--radius-xs);
		padding: var(--spacing-xs);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* =============== Rounded =============== */

	/* Overrides the panel radius; must stay after the size rules. Links use one step smaller so the corners nest */
	.navigationMenuContentPanel[data-rounded="xs"] {
		--navigation-menu-inner-radius: var(--radius-xs);
		border-radius: var(--radius-xs);
	}

	.navigationMenuContentPanel[data-rounded="sm"] {
		--navigation-menu-inner-radius: var(--radius-xs);
		border-radius: var(--radius-sm);
	}

	.navigationMenuContentPanel[data-rounded="md"] {
		--navigation-menu-inner-radius: var(--radius-sm);
		border-radius: var(--radius-md);
	}

	.navigationMenuContentPanel[data-rounded="lg"] {
		--navigation-menu-inner-radius: var(--radius-md);
		border-radius: var(--radius-lg);
	}

	.navigationMenuContentPanel[data-rounded="xl"] {
		--navigation-menu-inner-radius: var(--radius-lg);
		border-radius: var(--radius-xl);
	}

	.navigationMenuContentPanel[data-rounded="2xl"] {
		--navigation-menu-inner-radius: var(--radius-xl);
		border-radius: var(--radius-2xl);
	}

	.navigationMenuContentPanel[data-rounded="3xl"] {
		--navigation-menu-inner-radius: var(--radius-2xl);
		border-radius: var(--radius-3xl);
	}

	.navigationMenuContentPanel[data-rounded="4xl"] {
		--navigation-menu-inner-radius: var(--radius-3xl);
		border-radius: var(--radius-4xl);
	}

	/* A true pill; tall content can clip at the corners, so use 3xl or 4xl to stay safe */
	.navigationMenuContentPanel[data-rounded="pill"] {
		--navigation-menu-inner-radius: var(--radius-pill);
		border-radius: var(--radius-pill);
	}
</style>
