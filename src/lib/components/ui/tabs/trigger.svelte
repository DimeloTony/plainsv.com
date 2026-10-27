<script lang="ts">
	import { useCompCtx, useListCtx } from "./ctx.svelte.js";
	import type { TriggerProps, TriggerAttrs } from "./index.js";
	const { value, children, trigger, variant, size, rounded, onclick, class: className, ...props }: TriggerProps = $props();
	const ctx = useCompCtx();
	const listCtx = useListCtx();

	const isActive = $derived(ctx.value === value);
	const triggerProps: TriggerAttrs = $derived({
		role: "tab",
		id: ctx.triggerId(value),
		"aria-selected": isActive,
		"aria-controls": ctx.contentId(value),
		// Only the active trigger is in the tab order; when none is active, every trigger stays reachable.
		tabindex: isActive || !ctx.value ? 0 : -1,
		"data-state": isActive ? "active" : "inactive",
		"data-orientation": ctx.orientation,
		onclick: () => ctx.select(value),
	});

	/** Opens this tab, unless a passed click handler prevented the default. */
	const handleClick = (e: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) => {
		onclick?.(e);
		// If the passed handler called preventDefault: keep the current tab.
		if (e.defaultPrevented) return;
		ctx.select(value);
	};
</script>

<!-- Render the custom trigger when given, otherwise a tab button linked to its panel by id; its own style, size, and radius override the list's. -->
{#if trigger}
	{@render trigger({ props: triggerProps })}
{:else}
	<button type="button" class={["tabsTrigger", className]} {...triggerProps} data-variant={variant ?? listCtx?.variant ?? ctx.variant} data-size={size} data-rounded={rounded} onclick={handleClick} {...props}>
		{@render children?.()}
	</button>
{/if}

<style>
	/* Base trigger; sizes come from variables the list sets */
	.tabsTrigger {
		display: inline-flex;
		position: relative;
		flex: 1;
		justify-content: center;
		align-items: center;
		gap: var(--spacing-xs);
		transition-duration: 150ms;
		transition-property: color, background-color, border-color, box-shadow;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		cursor: pointer;
		box-sizing: border-box;
		outline: none;
		border: 1px solid transparent;
		border-radius: var(--tabs-trigger-radius);
		background-color: transparent;
		padding-inline: var(--tabs-padding-inline);
		height: var(--tabs-trigger-height);
		color: inherit;
		font-weight: 500;
		font-size: var(--tabs-text);
		line-height: var(--tabs-line-height);
		white-space: nowrap;
	}

	.tabsTrigger:hover {
		color: var(--foreground);
	}

	/* Vertical triggers fill the list width and align their labels to the start */
	.tabsTrigger[data-orientation="vertical"] {
		flex: none;
		justify-content: flex-start;
		width: 100%;
	}

	.tabsTrigger :global(svg) {
		flex-shrink: 0;
		width: var(--tabs-icon);
		height: var(--tabs-icon);
		pointer-events: none;
	}

	/* =============== Variants =============== */

	/* Raised active segment */
	.tabsTrigger[data-variant="default"][data-state="active"] {
		box-shadow: 0 1px 3px 0 color-mix(in oklab, var(--foreground) 10%, transparent);
		background-color: var(--background);
		color: var(--foreground);
	}

	:global(.dark) .tabsTrigger[data-variant="default"][data-state="active"] {
		border-color: var(--input);
		background-color: color-mix(in oklab, var(--input) 30%, transparent);
	}

	/* Filled active segment inside the bordered list */
	.tabsTrigger[data-variant="outline"][data-state="active"] {
		background-color: var(--accent);
		color: var(--accent-foreground);
	}

	/* Hover and active fills without a container */
	.tabsTrigger[data-variant="ghost"]:hover {
		background-color: color-mix(in oklab, var(--accent) 50%, transparent);
	}

	.tabsTrigger[data-variant="ghost"][data-state="active"] {
		background-color: var(--accent);
		color: var(--accent-foreground);
	}

	/* Indicator that covers the list's rule under or beside the active trigger */
	.tabsTrigger[data-variant="line"]::after {
		position: absolute;
		transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1);
		background-color: transparent;
		content: "";
	}

	.tabsTrigger[data-variant="line"][data-orientation="horizontal"]::after {
		right: 0;
		bottom: -2px; /* past the trigger and list borders */
		left: 0;
		height: 2px;
	}

	.tabsTrigger[data-variant="line"][data-orientation="vertical"]::after {
		top: 0;
		right: -2px; /* past the trigger and list borders */
		bottom: 0;
		width: 2px;
	}

	.tabsTrigger[data-variant="line"][data-state="active"] {
		color: var(--foreground);
	}

	.tabsTrigger[data-variant="line"][data-state="active"]::after {
		background-color: var(--foreground);
	}

	/* =============== States =============== */

	/* Keyboard focus ring; [data-variant] keeps it above the variant styles */
	.tabsTrigger[data-variant]:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
		border-color: var(--ring);
	}

	/* Disabled state */
	.tabsTrigger:disabled {
		opacity: 50%;
		pointer-events: none;
	}

	/* =============== Sizes =============== */

	/* Overrides the list size for this trigger; the inset keeps it inside the list's padding and border */

	/* Large */
	.tabsTrigger[data-size="lg"] {
		padding-inline: var(--spacing-md);
		height: calc(var(--control-height-lg) - var(--tabs-trigger-inset));
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	.tabsTrigger[data-size="lg"] :global(svg) {
		width: 1rem; /* 16px */
		height: 1rem; /* 16px */
	}

	/* Medium */
	.tabsTrigger[data-size="md"] {
		padding-inline: var(--spacing-sm);
		height: calc(var(--control-height-md) - var(--tabs-trigger-inset));
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	.tabsTrigger[data-size="md"] :global(svg) {
		width: 1rem; /* 16px */
		height: 1rem; /* 16px */
	}

	/* Small */
	.tabsTrigger[data-size="sm"] {
		padding-inline: var(--spacing-sm);
		height: calc(var(--control-height-sm) - var(--tabs-trigger-inset));
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	.tabsTrigger[data-size="sm"] :global(svg) {
		width: var(--text-sm);
		height: var(--text-sm);
	}

	/* Extra small */
	.tabsTrigger[data-size="xs"] {
		padding-inline: var(--spacing-xs);
		height: calc(var(--control-height-xs) - var(--tabs-trigger-inset));
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	.tabsTrigger[data-size="xs"] :global(svg) {
		width: var(--text-xs);
		height: var(--text-xs);
	}

	/* =============== Rounded =============== */

	/* Overrides the inherited radius with this exact value; must stay after the size rules */
	.tabsTrigger[data-rounded="xs"] {
		border-radius: var(--radius-xs);
	}

	.tabsTrigger[data-rounded="sm"] {
		border-radius: var(--radius-sm);
	}

	.tabsTrigger[data-rounded="md"] {
		border-radius: var(--radius-md);
	}

	.tabsTrigger[data-rounded="lg"] {
		border-radius: var(--radius-lg);
	}

	.tabsTrigger[data-rounded="xl"] {
		border-radius: var(--radius-xl);
	}

	.tabsTrigger[data-rounded="2xl"] {
		border-radius: var(--radius-2xl);
	}

	.tabsTrigger[data-rounded="3xl"] {
		border-radius: var(--radius-3xl);
	}

	.tabsTrigger[data-rounded="4xl"] {
		border-radius: var(--radius-4xl);
	}

	.tabsTrigger[data-rounded="pill"] {
		border-radius: var(--radius-pill);
	}
</style>
