<script lang="ts">
	import { onDestroy } from "svelte";
	import { createAttachmentKey } from "svelte/attachments";
	import { useCompCtx as useMenuState } from "#lib/components/ui/dropdown-menu/ctx.svelte.js";
	import { useCompCtx, useMenuCtx } from "./ctx.svelte.js";
	import type { TriggerProps, TriggerAttrs } from "./index.js";
	const { children, trigger, variant, size, rounded, class: className, ...props }: TriggerProps = $props();
	const ctx = useCompCtx();
	const menu = useMenuState();
	const getValue = useMenuCtx();
	// One key for the life of the trigger, so the element is not re-registered on every open.
	const registerKey = createAttachmentKey();
	// Whether the menu was open when the current press started.
	let wasOpenOnPress = false;
	const unregister = ctx.registerMenu(getValue(), { setOpen: (open, initialFocus) => menu.setOpen(open, initialFocus) });
	const triggerProps: TriggerAttrs = $derived({
		role: "menuitem",
		id: menu.triggerId,
		"aria-haspopup": "menu",
		"aria-expanded": menu.open,
		"aria-controls": menu.open ? menu.contentId : undefined,
		tabindex: ctx.tabStopValue === getValue() ? 0 : -1,
		"data-menubar-trigger": true,
		"data-value": getValue(),
		"data-state": menu.open ? "open" : "closed",
		onpointerdown: () => (wasOpenOnPress = menu.open),
		onclick: handleClick,
		onpointerenter: handlePointerEnter,
		onkeydown: handleKeydown,
		onfocus: () => (ctx.focusedValue = getValue()),
		[registerKey]: registerTrigger,
	});

	onDestroy(unregister);

	// Function declarations are hoisted, so the derived props above can reference them.

	/** Registers the trigger element so the menu is placed below it and returns focus to it. */
	function registerTrigger(node: HTMLElement) {
		menu.triggerEl = node;
		return () => {
			// If another trigger has not taken over: clear the reference.
			if (menu.triggerEl === node) menu.triggerEl = undefined;
		};
	}

	/** Toggles the menu on click; a press that started while open already closed it. */
	function handleClick(e: MouseEvent) {
		// Keyboard clicks have no press and report a detail of 0, so a stale press is ignored.
		const wasOpen = wasOpenOnPress && e.detail > 0;
		wasOpenOnPress = false;
		if (wasOpen || menu.open) menu.setOpen(false);
		else menu.setOpen(true, e.detail === 0 ? "first" : "menu");
	}

	/** Switches to this menu when the pointer moves onto it while another menu is open. */
	function handlePointerEnter(e: PointerEvent) {
		// If no menu is open, or this one already is: hovering does nothing.
		if (!ctx.activeValue || ctx.activeValue === getValue() || e.pointerType === "touch") return;
		if (e.currentTarget instanceof HTMLElement) e.currentTarget.focus();
		menu.setOpen(true, "menu");
	}

	/** Moves between triggers with the arrow keys, Home, and End, and opens the menu with the down and up arrows. */
	function handleKeydown(e: KeyboardEvent) {
		const value = getValue();
		const triggerSteps: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };
		if (e.key in triggerSteps) {
			e.preventDefault();
			ctx.moveToAdjacent(value, triggerSteps[e.key], false);
		} else if (e.key === "Home" || e.key === "End") {
			e.preventDefault();
			const first = ctx.values[0];
			const last = ctx.values[ctx.values.length - 1];
			// Step from the far end so the move lands on the first or last trigger.
			ctx.moveToAdjacent(e.key === "Home" ? last : first, e.key === "Home" ? 1 : -1, false);
		} else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
			e.preventDefault();
			menu.setOpen(true, e.key === "ArrowDown" ? "first" : "last");
		}
	}
</script>

<!-- Render the custom trigger when given, otherwise a button announced as a menu item that opens a menu; its own size and radius override the bar's. -->
{#if trigger}
	{@render trigger({ props: triggerProps })}
{:else}
	<button type="button" class={["menubarTrigger", className]} data-variant={variant ?? ctx.variant} data-size={size} data-rounded={rounded} {...triggerProps} {...props}>
		{@render children?.()}
	</button>
{/if}

<style>
	/* Base trigger; the radius and padding come from the size on the bar */
	.menubarTrigger {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		transition-duration: 150ms;
		transition-property: color, background-color;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		cursor: default;
		outline: none;
		border: 0;
		border-radius: var(--menubar-trigger-radius);
		background-color: transparent;
		padding: 0 var(--menubar-trigger-padding);
		height: 100%;
		color: inherit;
		font: inherit;
		font-weight: 500;
		user-select: none;
	}

	/* =============== Variants =============== */

	/* Bordered trigger on the page background */
	.menubarTrigger[data-variant="outline"] {
		border: 1px solid var(--border);
		background-color: var(--background);
	}

	:global(.dark) .menubarTrigger[data-variant="outline"] {
		border-color: var(--input);
		background-color: color-mix(in oklab, var(--input) 30%, transparent);
	}

	:global(.dark) .menubarTrigger[data-variant="outline"]:hover,
	:global(.dark) .menubarTrigger[data-variant="outline"]:focus,
	:global(.dark) .menubarTrigger[data-variant="outline"][data-state="open"] {
		background-color: var(--accent);
	}

	/* Filled secondary trigger */
	.menubarTrigger[data-variant="secondary"] {
		background-color: var(--secondary);
		color: var(--secondary-foreground);
	}

	.menubarTrigger[data-variant="secondary"]:hover,
	.menubarTrigger[data-variant="secondary"]:focus,
	.menubarTrigger[data-variant="secondary"][data-state="open"] {
		background-color: color-mix(in oklab, var(--secondary) 80%, transparent);
		color: var(--secondary-foreground);
	}

	/* Lighter highlight */
	.menubarTrigger[data-variant="ghost"]:hover,
	.menubarTrigger[data-variant="ghost"]:focus,
	.menubarTrigger[data-variant="ghost"][data-state="open"] {
		background-color: color-mix(in oklab, var(--accent) 50%, transparent);
	}

	/* =============== States =============== */

	/* Highlighted while focused, hovered, or open */
	.menubarTrigger:hover,
	.menubarTrigger:focus,
	.menubarTrigger[data-state="open"] {
		background-color: var(--accent);
		color: var(--accent-foreground);
	}

	/* Keyboard focus ring */
	.menubarTrigger:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
	}

	/* Disabled state */
	.menubarTrigger:disabled {
		opacity: 50%;
		pointer-events: none;
	}

	/* =============== Sizes =============== */

	/* Overrides the bar size for this trigger's padding and text; the height still fills the bar */

	/* Large */
	.menubarTrigger[data-size="lg"] {
		padding: 0 var(--spacing-md);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Medium */
	.menubarTrigger[data-size="md"] {
		padding: 0 var(--spacing-sm);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Small */
	.menubarTrigger[data-size="sm"] {
		padding: 0 calc(var(--spacing-xs) * 1.5); /* 6px */
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Extra small */
	.menubarTrigger[data-size="xs"] {
		padding: 0 var(--spacing-xs);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* =============== Rounded =============== */

	/* Overrides the inherited radius with this exact value; must stay after the size rules */
	.menubarTrigger[data-rounded="xs"] {
		border-radius: var(--radius-xs);
	}

	.menubarTrigger[data-rounded="sm"] {
		border-radius: var(--radius-sm);
	}

	.menubarTrigger[data-rounded="md"] {
		border-radius: var(--radius-md);
	}

	.menubarTrigger[data-rounded="lg"] {
		border-radius: var(--radius-lg);
	}

	.menubarTrigger[data-rounded="xl"] {
		border-radius: var(--radius-xl);
	}

	.menubarTrigger[data-rounded="2xl"] {
		border-radius: var(--radius-2xl);
	}

	.menubarTrigger[data-rounded="3xl"] {
		border-radius: var(--radius-3xl);
	}

	.menubarTrigger[data-rounded="4xl"] {
		border-radius: var(--radius-4xl);
	}

	.menubarTrigger[data-rounded="pill"] {
		border-radius: var(--radius-pill);
	}
</style>
