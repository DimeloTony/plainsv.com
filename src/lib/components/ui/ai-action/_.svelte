<script lang="ts">
	import { ChevronRightIcon } from "@lucide/svelte";
	import { setCompCtx } from "./ctx.svelte.js";
	import type { Props } from "./index.js";
	let { title, icon: Icon, children, open = $bindable(!!children), onOpenChange, done = false, size = "md", class: className, ...props }: Props = $props();
	const baseId = $props.id();
	const ctx = setCompCtx({ open, baseId, onOpenChange });
	// Only a step with details can be expanded.
	const isExpandable = $derived(!!children);

	// Keep the callback current when the prop changes.
	$effect.pre(() => void (ctx.onOpenChange = onOpenChange));

	// Keep the bindable prop and the shared open state in sync in both directions.
	$effect.pre(() => void (ctx.open = open));
	$effect.pre(() => void (open = ctx.open));
</script>

<!-- Icon and status text, then the details. -->
{#snippet heading()}
	<span class="aiActionIcon"><Icon /></span>
	{#if isExpandable}
		<span class="aiActionChevron" aria-hidden="true"><ChevronRightIcon /></span>
	{/if}
	<span class={["aiActionTitle", !done && "shimmer"]}>{title}</span>
{/snippet}

<div class={["aiAction not-typeset", className]} data-size={size} data-state={isExpandable ? (ctx.open ? "open" : "closed") : undefined} data-done={done || undefined} {...props}>
	{#if isExpandable}
		<!-- A step with details toggles them from its title. -->
		<button type="button" class="aiActionHeading" aria-expanded={ctx.open} aria-controls={ctx.contentId} onclick={() => ctx.toggle()}>
			{@render heading()}
		</button>
		{@render children?.()}
	{:else}
		<div class="aiActionHeading">{@render heading()}</div>
	{/if}
</div>

<style>
	/* Base step; muted, with the sizes the details read */
	.aiAction {
		display: flex;
		flex-direction: column;
		width: 100%;
		color: var(--muted-foreground);
	}

	/* Icon and title in one row */
	.aiActionHeading {
		display: flex;
		align-items: center;
		gap: var(--ai-action-gap);
		outline: none;
		border: 0;
		border-radius: var(--radius-sm);
		background: none;
		padding: 0;
		width: fit-content;
		color: inherit;
		font: inherit;
		font-size: var(--ai-action-title-text);
		line-height: var(--line-height-sm);
		text-align: left;
	}

	button.aiActionHeading {
		cursor: pointer;
	}

	.aiActionIcon,
	.aiActionChevron {
		display: flex;
		flex-shrink: 0;
	}

	.aiActionIcon :global(svg),
	.aiActionChevron :global(svg) {
		width: var(--ai-action-icon);
		height: var(--ai-action-icon);
	}

	/* The chevron takes the icon's place while an expandable step is hovered or focused */
	.aiActionChevron {
		display: none;
	}

	.aiActionChevron :global(svg) {
		transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
	}

	button.aiActionHeading:is(:hover, :focus-visible) .aiActionIcon {
		display: none;
	}

	button.aiActionHeading:is(:hover, :focus-visible) .aiActionChevron {
		display: flex;
	}

	/* The shimmer sweeps the title text, faster than the utility default */
	.aiActionTitle {
		--shimmer-duration: 1s;
	}

	/* =============== States =============== */

	/* The chevron points down while the details are shown */
	.aiAction[data-state="open"] .aiActionChevron :global(svg) {
		transform: rotate(90deg);
	}

	/* Keyboard focus ring */
	button.aiActionHeading:focus-visible {
		box-shadow: 0 0 0 2px color-mix(in oklab, var(--ring) 50%, transparent);
	}

	/* =============== Sizes =============== */

	.aiAction[data-size="xs"] {
		--ai-action-icon: 0.75rem; /* 12px */
		--ai-action-gap: var(--spacing-xs);
		--ai-action-title-text: var(--text-xs);
		--ai-action-content-text: var(--text-xs);
	}

	.aiAction[data-size="sm"] {
		--ai-action-icon: 0.875rem; /* 14px */
		--ai-action-gap: calc(var(--spacing-xs) * 1.5);
		--ai-action-title-text: var(--text-xs);
		--ai-action-content-text: var(--text-xs);
	}

	.aiAction[data-size="md"] {
		--ai-action-icon: 1rem; /* 16px */
		--ai-action-gap: calc(var(--spacing-xs) * 1.5);
		--ai-action-title-text: var(--text-sm);
		--ai-action-content-text: var(--text-xs);
	}

	.aiAction[data-size="lg"] {
		--ai-action-icon: 1.125rem; /* 18px */
		--ai-action-gap: var(--spacing-sm);
		--ai-action-title-text: var(--text-md);
		--ai-action-content-text: var(--text-sm);
	}
</style>
