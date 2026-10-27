<script lang="ts">
	import { tick } from "svelte";
	import { ChevronDownIcon } from "@lucide/svelte";
	import { useCompCtx, useItemCtx } from "./ctx.svelte.js";
	import type { TriggerProps, TriggerAttrs } from "./index.js";
	const { children, trigger, variant, size, rounded, onclick, onkeydown, onpointerenter, class: className, ...props }: TriggerProps = $props();
	const ctx = useCompCtx();
	const itemCtx = useItemCtx();
	// Elements that can take focus with the keyboard, in order.
	const FOCUSABLE_SELECTOR = 'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

	const isOpen = $derived(ctx.value === itemCtx.value);
	const triggerProps: TriggerAttrs = $derived({
		id: ctx.triggerId(itemCtx.value),
		"aria-expanded": isOpen,
		"aria-controls": ctx.contentId(itemCtx.value),
		"data-state": isOpen ? "open" : "closed",
		"data-navigation-menu-top": true,
		onclick: toggleContent,
		onkeydown: openOnArrowDown,
		onpointerenter: openOnHover,
	});

	// Function declarations are hoisted, so the derived props above can reference them.

	/** Opens or closes the content. */
	function toggleContent() {
		if (isOpen) ctx.close();
		else ctx.open(itemCtx.value);
	}

	/** Opens the content and focuses its first control on the down arrow. */
	async function openOnArrowDown(e: KeyboardEvent) {
		// If the key is not the down arrow: leave it alone.
		if (e.key !== "ArrowDown") return;
		e.preventDefault();
		ctx.open(itemCtx.value);
		// Wait for the content to render before focusing inside it.
		await tick();
		document.getElementById(ctx.contentId(itemCtx.value))?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus();
	}

	/** Opens the content after the hover delay when the mouse enters the trigger. */
	function openOnHover(e: PointerEvent) {
		const isDisabled = e.currentTarget instanceof Element && e.currentTarget.matches(":disabled");
		// Touch and pen open with a tap instead, so only the mouse opens on hover.
		if (e.pointerType === "mouse" && !isDisabled) ctx.scheduleOpen(itemCtx.value);
	}

	/** Opens or closes the content, unless a passed click handler prevented the default. */
	function handleClick(e: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
		onclick?.(e);
		// If the passed handler called preventDefault: keep the current state.
		if (e.defaultPrevented) return;
		toggleContent();
	}

	/** Runs a passed key handler, then opens on the down arrow unless it prevented the default. */
	function handleKeydown(e: KeyboardEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
		onkeydown?.(e);
		// If a passed handler prevented the default: leave the key alone.
		if (e.defaultPrevented) return;
		openOnArrowDown(e);
	}

	/** Runs a passed pointer handler, then opens on hover. */
	function handlePointerEnter(e: PointerEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
		onpointerenter?.(e);
		openOnHover(e);
	}
</script>

<!-- Render the custom trigger when given, otherwise a button whose chevron flips while open; its own size and radius override the menu's. -->
{#if trigger}
	{@render trigger({ props: triggerProps })}
{:else}
	<button type="button" class={["navigationMenuTrigger", className]} data-variant={variant ?? ctx.variant} data-size={size} data-rounded={rounded} {...triggerProps} onclick={handleClick} onkeydown={handleKeydown} onpointerenter={handlePointerEnter} {...props}>
		{@render children?.()}
		<ChevronDownIcon aria-hidden="true" />
	</button>
{/if}

<style>
	/* Base trigger */
	.navigationMenuTrigger {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		gap: var(--spacing-xs);
		transition-duration: 150ms;
		transition-property: color, background-color, box-shadow;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		cursor: pointer;
		box-sizing: border-box;
		outline: none;
		border: 0;
		border-radius: var(--navigation-menu-trigger-radius);
		background-color: transparent;
		padding-inline: var(--navigation-menu-padding-inline);
		height: var(--navigation-menu-height);
		color: inherit;
		font: inherit;
		font-weight: 500;
		white-space: nowrap;
	}

	/* Chevron flips while open */
	.navigationMenuTrigger :global(svg) {
		flex-shrink: 0;
		transition: rotate 200ms cubic-bezier(0.4, 0, 0.2, 1);
		width: var(--navigation-menu-icon);
		height: var(--navigation-menu-icon);
		pointer-events: none;
	}

	/* =============== Variants =============== */

	/* Bordered trigger on the page background */
	.navigationMenuTrigger[data-variant="outline"] {
		border: 1px solid var(--border);
		background-color: var(--background);
	}

	:global(.dark) .navigationMenuTrigger[data-variant="outline"] {
		border-color: var(--input);
		background-color: color-mix(in oklab, var(--input) 30%, transparent);
	}

	:global(.dark) .navigationMenuTrigger[data-variant="outline"]:hover,
	:global(.dark) .navigationMenuTrigger[data-variant="outline"][data-state="open"] {
		background-color: var(--accent);
	}

	/* Filled secondary trigger */
	.navigationMenuTrigger[data-variant="secondary"] {
		background-color: var(--secondary);
		color: var(--secondary-foreground);
	}

	.navigationMenuTrigger[data-variant="secondary"]:hover,
	.navigationMenuTrigger[data-variant="secondary"][data-state="open"] {
		background-color: color-mix(in oklab, var(--secondary) 80%, transparent);
		color: var(--secondary-foreground);
	}

	/* Lighter hover and open fill */
	.navigationMenuTrigger[data-variant="ghost"]:hover,
	.navigationMenuTrigger[data-variant="ghost"][data-state="open"] {
		background-color: color-mix(in oklab, var(--accent) 50%, transparent);
	}

	/* =============== States =============== */

	/* Hover and open fill for the default and outline variants */
	.navigationMenuTrigger:hover,
	.navigationMenuTrigger[data-state="open"] {
		background-color: var(--accent);
		color: var(--accent-foreground);
	}

	.navigationMenuTrigger[data-state="open"] :global(svg) {
		rotate: 180deg;
	}

	/* Keyboard focus ring */
	.navigationMenuTrigger:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
	}

	/* Disabled state */
	.navigationMenuTrigger:disabled {
		opacity: 50%;
		cursor: not-allowed;
	}

	/* =============== Sizes =============== */

	/* Overrides the menu size for this trigger only */

	/* Large */
	.navigationMenuTrigger[data-size="lg"] {
		padding-inline: var(--spacing-xl);
		height: var(--control-height-lg);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	.navigationMenuTrigger[data-size="lg"] :global(svg) {
		width: 0.875rem; /* 14px */
		height: 0.875rem; /* 14px */
	}

	/* Medium */
	.navigationMenuTrigger[data-size="md"] {
		padding-inline: var(--spacing-lg);
		height: var(--control-height-md);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	.navigationMenuTrigger[data-size="md"] :global(svg) {
		width: 0.75rem; /* 12px */
		height: 0.75rem; /* 12px */
	}

	/* Small */
	.navigationMenuTrigger[data-size="sm"] {
		padding-inline: var(--spacing-md);
		height: var(--control-height-sm);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	.navigationMenuTrigger[data-size="sm"] :global(svg) {
		width: 0.75rem; /* 12px */
		height: 0.75rem; /* 12px */
	}

	/* Extra small */
	.navigationMenuTrigger[data-size="xs"] {
		padding-inline: var(--spacing-sm);
		height: var(--control-height-xs);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	.navigationMenuTrigger[data-size="xs"] :global(svg) {
		width: 0.625rem; /* 10px */
		height: 0.625rem; /* 10px */
	}

	/* =============== Rounded =============== */

	/* Overrides the inherited radius with this exact value; must stay after the size rules */
	.navigationMenuTrigger[data-rounded="xs"] {
		border-radius: var(--radius-xs);
	}

	.navigationMenuTrigger[data-rounded="sm"] {
		border-radius: var(--radius-sm);
	}

	.navigationMenuTrigger[data-rounded="md"] {
		border-radius: var(--radius-md);
	}

	.navigationMenuTrigger[data-rounded="lg"] {
		border-radius: var(--radius-lg);
	}

	.navigationMenuTrigger[data-rounded="xl"] {
		border-radius: var(--radius-xl);
	}

	.navigationMenuTrigger[data-rounded="2xl"] {
		border-radius: var(--radius-2xl);
	}

	.navigationMenuTrigger[data-rounded="3xl"] {
		border-radius: var(--radius-3xl);
	}

	.navigationMenuTrigger[data-rounded="4xl"] {
		border-radius: var(--radius-4xl);
	}

	.navigationMenuTrigger[data-rounded="pill"] {
		border-radius: var(--radius-pill);
	}

	@media (prefers-reduced-motion: reduce) {
		.navigationMenuTrigger :global(svg) {
			transition: none;
		}
	}
</style>
