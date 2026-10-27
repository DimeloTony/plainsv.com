<script lang="ts">
	import { ChevronDownIcon } from "@lucide/svelte";
	import { createAttachmentKey } from "svelte/attachments";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { TriggerProps, TriggerAttrs } from "./index.js";
	const { children, trigger, variant, size, rounded, onclick, onpointerdown, onkeydown, class: className, ...props }: TriggerProps = $props();
	const ctx = useCompCtx();
	// One key for the life of the trigger, so the element is not re-registered on every open.
	const registerKey = createAttachmentKey();
	// Whether the list was open when the current press started.
	let wasOpenOnPress = false;
	const triggerProps: TriggerAttrs = $derived({
		role: "combobox",
		id: ctx.triggerId,
		"aria-haspopup": "listbox",
		"aria-expanded": ctx.open,
		"aria-controls": ctx.contentId,
		disabled: ctx.disabled,
		"data-state": ctx.open ? "open" : "closed",
		onpointerdown: () => (wasOpenOnPress = ctx.open),
		onclick: toggleList,
		onkeydown: openOnArrow,
		[registerKey]: registerTrigger,
	});

	// Function declarations are hoisted, so the derived props above can reference them.

	/** Registers the trigger so the list can be placed against it and return focus to it. */
	function registerTrigger(node: HTMLElement) {
		ctx.triggerEl = node;
		return () => {
			// If another trigger has not taken over: clear the reference.
			if (ctx.triggerEl === node) ctx.triggerEl = undefined;
		};
	}

	/** Toggles the list on click, and on Enter and Space through the native button click. */
	function toggleList(e: MouseEvent) {
		// Keyboard clicks have no press and report a detail of 0, so a stale press is ignored.
		const wasOpen = wasOpenOnPress && e.detail > 0;
		wasOpenOnPress = false;
		// If the press started while open: the browser already closed the list, so keep it closed.
		ctx.setOpen(wasOpen ? false : !ctx.open);
	}

	/** Opens the list with the up and down arrows. */
	function openOnArrow(e: KeyboardEvent) {
		if (e.key === "ArrowDown" || e.key === "ArrowUp") {
			e.preventDefault();
			ctx.setOpen(true);
		}
	}

	/** Records whether the list was open, since pressing outside it closes it before the click. */
	function handlePointerDown(e: PointerEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
		onpointerdown?.(e);
		wasOpenOnPress = ctx.open;
	}

	/** Toggles the list, unless a passed click handler prevented the default. */
	function handleClick(e: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
		onclick?.(e);
		// If a passed handler prevented the default: drop the recorded press and keep the current state.
		if (e.defaultPrevented) wasOpenOnPress = false;
		else toggleList(e);
	}

	/** Runs a passed key handler, then opens the list on the arrows unless it prevented the default. */
	function handleKeydown(e: KeyboardEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
		onkeydown?.(e);
		// If a passed handler prevented the default: leave the key alone.
		if (e.defaultPrevented) return;
		openOnArrow(e);
	}
</script>

<!-- Render the custom trigger when given, otherwise a combobox button that opens and closes the list. -->
{#if trigger}
	{@render trigger({ props: triggerProps })}
{:else}
	<button type="button" class={["selectTrigger not-typeset", className]} {...triggerProps} data-variant={variant ?? ctx.variant} data-size={size ?? ctx.size} data-rounded={rounded ?? ctx.rounded} onpointerdown={handlePointerDown} onclick={handleClick} onkeydown={handleKeydown} {...props}>
		{@render children?.()}
		<ChevronDownIcon aria-hidden="true" />
	</button>
{/if}

<style>
	/* Base trigger; matches the input field */
	.selectTrigger {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--spacing-sm);
		transition-duration: 150ms;
		transition-property: color, background-color, border-color, box-shadow, opacity;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		cursor: pointer;
		box-sizing: border-box;
		outline: none;
		border: 1px solid transparent;
		background-color: transparent;
		width: fit-content;
		color: var(--foreground);
		font: inherit;
		white-space: nowrap;
	}

	/* Chevron after the value */
	.selectTrigger :global(svg) {
		flex-shrink: 0;
		opacity: 50%;
		width: var(--select-icon);
		height: var(--select-icon);
		pointer-events: none;
	}

	/* =============== Variants =============== */

	/* Bordered field, like the input */
	.selectTrigger[data-variant="default"] {
		box-shadow: 0 1px 2px 0 color-mix(in oklab, var(--foreground) 5%, transparent);
		border-color: var(--input);
	}

	:global(.dark) .selectTrigger[data-variant="default"] {
		background-color: color-mix(in oklab, var(--input) 30%, transparent);
	}

	:global(.dark) .selectTrigger[data-variant="default"]:hover {
		background-color: color-mix(in oklab, var(--input) 50%, transparent);
	}

	/* Filled field without a border */
	.selectTrigger[data-variant="secondary"] {
		background-color: var(--secondary);
		color: var(--secondary-foreground);
	}

	.selectTrigger[data-variant="secondary"]:hover {
		background-color: color-mix(in oklab, var(--secondary) 80%, transparent);
	}

	/* No container until hovered or open */
	.selectTrigger[data-variant="ghost"]:hover,
	.selectTrigger[data-variant="ghost"][data-state="open"] {
		background-color: var(--accent);
		color: var(--accent-foreground);
	}

	/* =============== States =============== */

	/* Keyboard focus ring; [data-variant] keeps it above the variant border colors */
	.selectTrigger[data-variant]:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
		border-color: var(--ring);
	}

	/* Invalid state from aria-invalid */
	.selectTrigger[data-variant][aria-invalid="true"] {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--destructive) 20%, transparent);
		border-color: var(--destructive);
	}

	:global(.dark) .selectTrigger[data-variant][aria-invalid="true"] {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--destructive) 40%, transparent);
	}

	/* Disabled state */
	.selectTrigger:disabled {
		opacity: 50%;
		cursor: not-allowed;
	}

	/* =============== Sizes =============== */

	/* Large */
	.selectTrigger[data-size="lg"] {
		--select-icon: 1rem; /* 16px */
		border-radius: var(--radius-lg);
		padding-inline: var(--spacing-md);
		height: var(--control-height-lg);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Medium — default */
	.selectTrigger[data-size="md"] {
		--select-icon: 1rem; /* 16px */
		border-radius: var(--radius-md);
		padding-inline: var(--spacing-md);
		height: var(--control-height-md);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Small */
	.selectTrigger[data-size="sm"] {
		--select-icon: var(--text-sm);
		border-radius: var(--radius-sm);
		padding-inline: var(--spacing-sm);
		height: var(--control-height-sm);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Extra small */
	.selectTrigger[data-size="xs"] {
		--select-icon: var(--text-xs);
		gap: var(--spacing-xs);
		border-radius: var(--radius-xs);
		padding-inline: var(--spacing-xs);
		height: var(--control-height-xs);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius; must stay after the size rules */
	.selectTrigger[data-rounded="xs"] {
		border-radius: var(--radius-xs);
	}

	.selectTrigger[data-rounded="sm"] {
		border-radius: var(--radius-sm);
	}

	.selectTrigger[data-rounded="md"] {
		border-radius: var(--radius-md);
	}

	.selectTrigger[data-rounded="lg"] {
		border-radius: var(--radius-lg);
	}

	.selectTrigger[data-rounded="xl"] {
		border-radius: var(--radius-xl);
	}

	.selectTrigger[data-rounded="2xl"] {
		border-radius: var(--radius-2xl);
	}

	.selectTrigger[data-rounded="3xl"] {
		border-radius: var(--radius-3xl);
	}

	.selectTrigger[data-rounded="4xl"] {
		border-radius: var(--radius-4xl);
	}

	.selectTrigger[data-rounded="pill"] {
		border-radius: var(--radius-pill);
	}
</style>
