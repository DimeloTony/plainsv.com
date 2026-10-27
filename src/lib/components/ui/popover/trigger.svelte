<script lang="ts">
	import { Button } from "#lib/components/ui/button/index.js";
	import { createAttachmentKey } from "svelte/attachments";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { TriggerProps, TriggerAttrs } from "./index.js";
	const { children, trigger, variant = "outline", size, rounded, class: className }: TriggerProps = $props();
	const ctx = useCompCtx();
	// One key for the life of the trigger, so the element is not re-registered on every open.
	const registerKey = createAttachmentKey();
	// Whether the popover was open when the current press started.
	let wasOpenOnPress = false;
	const triggerProps: TriggerAttrs = $derived({
		id: ctx.triggerId,
		"aria-haspopup": "dialog",
		"aria-expanded": ctx.open,
		"aria-controls": ctx.open ? ctx.contentId : undefined,
		"data-state": ctx.open ? "open" : "closed",
		onpointerdown: () => (wasOpenOnPress = ctx.open),
		onclick: handleClick,
		[registerKey]: registerTrigger,
	});

	// Function declarations are hoisted, so the derived props above can reference them.

	/** Registers the trigger element so the content can be placed against it and return focus to it. */
	function registerTrigger(node: HTMLElement) {
		ctx.triggerEl = node;
		return () => {
			// If another trigger has not taken over: clear the reference.
			if (ctx.triggerEl === node) ctx.triggerEl = undefined;
		};
	}

	/** Toggles the popover on click, and on Enter and Space through the native button click. */
	function handleClick(e: MouseEvent) {
		// Keyboard clicks have no press and report a detail of 0, so a stale press is ignored.
		const wasOpen = wasOpenOnPress && e.detail > 0;
		wasOpenOnPress = false;
		// If the press started while open: the browser already closed the popover, so keep it closed.
		ctx.setOpen(wasOpen ? false : !ctx.open);
	}
</script>

<!-- Render the custom trigger when given, otherwise an outline button. -->
{#if trigger}
	{@render trigger({ props: triggerProps })}
{:else}
	<Button {variant} size={size ?? ctx.size} {rounded} class={className} {...triggerProps}>{@render children?.()}</Button>
{/if}
