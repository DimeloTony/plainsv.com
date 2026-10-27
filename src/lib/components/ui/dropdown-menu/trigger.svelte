<script lang="ts">
	import { Button } from "#lib/components/ui/button/index.js";
	import { createAttachmentKey } from "svelte/attachments";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { TriggerProps, TriggerAttrs } from "./index.js";
	const { children, trigger, variant = "outline", size, rounded, class: className }: TriggerProps = $props();
	const ctx = useCompCtx();
	// One key for the life of the trigger, so the element is not re-registered on every open.
	const registerKey = createAttachmentKey();
	// Whether the menu was open when the current press started.
	let wasOpenOnPress = false;
	const triggerProps: TriggerAttrs = $derived({
		id: ctx.triggerId,
		"aria-haspopup": "menu",
		"aria-expanded": ctx.open,
		"aria-controls": ctx.open ? ctx.contentId : undefined,
		"data-state": ctx.open ? "open" : "closed",
		onpointerdown: () => (wasOpenOnPress = ctx.open),
		onclick: handleClick,
		onkeydown: handleKeydown,
		[registerKey]: registerTrigger,
	});

	// Function declarations are hoisted, so the derived props above can reference them.

	/** Registers the trigger element so the menu can be placed against it and return focus to it. */
	function registerTrigger(node: HTMLElement) {
		ctx.triggerEl = node;
		return () => {
			// If another trigger has not taken over: clear the reference.
			if (ctx.triggerEl === node) ctx.triggerEl = undefined;
		};
	}

	/** Toggles the menu on click, and on Enter and Space through the native button click. */
	function handleClick(e: MouseEvent) {
		// Keyboard clicks have no press and report a detail of 0, so a stale press is ignored.
		const isKeyboard = e.detail === 0;
		const wasOpen = wasOpenOnPress && !isKeyboard;
		wasOpenOnPress = false;
		// If the press started while open: the browser already closed the menu, so keep it closed.
		if (wasOpen || ctx.open) return ctx.setOpen(false);
		// Keyboard opens focus the first item; pointer opens focus the menu so the arrows still work.
		ctx.setOpen(true, isKeyboard ? "first" : "menu");
	}

	/** Opens the menu with the down arrow on the first item, or the up arrow on the last. */
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "ArrowDown" || e.key === "ArrowUp") {
			e.preventDefault();
			ctx.setOpen(true, e.key === "ArrowDown" ? "first" : "last");
		}
	}
</script>

<!-- Render the custom trigger when given, otherwise an outline button that follows the menu size. -->
{#if trigger}
	{@render trigger({ props: triggerProps })}
{:else}
	<Button {variant} size={size ?? ctx.size} {rounded} class={className} {...triggerProps}>{@render children?.()}</Button>
{/if}
