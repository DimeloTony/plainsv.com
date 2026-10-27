<script lang="ts">
	import { Button } from "#lib/components/ui/button/index.js";
	import { createAttachmentKey } from "svelte/attachments";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { TriggerProps, TriggerAttrs } from "./index.js";
	const { children, trigger, variant = "outline", size, rounded, class: className }: TriggerProps = $props();
	const ctx = useCompCtx();
	// One key for the life of the trigger, so the element is not re-registered on every open.
	const registerKey = createAttachmentKey();
	const triggerProps: TriggerAttrs = $derived({
		"aria-describedby": ctx.open ? ctx.contentId : undefined,
		onpointerenter: handlePointerEnter,
		onpointerleave: () => ctx.scheduleClose(),
		onpointerdown: () => ctx.close(),
		onfocus: handleFocus,
		onblur: () => ctx.close(),
		[registerKey]: registerTrigger,
	});

	// Function declarations are hoisted, so the derived props above can reference them.

	/** Registers the trigger element so the content can be placed against it. */
	function registerTrigger(node: HTMLElement) {
		ctx.triggerEl = node;
		return () => {
			// If another trigger has not taken over: clear the reference.
			if (ctx.triggerEl === node) ctx.triggerEl = undefined;
		};
	}

	/** Opens the tooltip after the delay for a mouse or pen. */
	function handlePointerEnter(e: PointerEvent) {
		// If this is a touch: skip, since a tap would open and close it at once.
		if (e.pointerType === "touch") return;
		ctx.scheduleOpen();
	}

	/** Opens the tooltip when the trigger gets keyboard focus. */
	function handleFocus(e: FocusEvent) {
		// If focus came from a click rather than the keyboard: leave it closed.
		if (e.currentTarget instanceof Element && e.currentTarget.matches(":focus-visible")) ctx.open = true;
	}
</script>

<!-- Render the custom trigger when given, otherwise an outline button. -->
{#if trigger}
	{@render trigger({ props: triggerProps })}
{:else}
	<Button {variant} {size} {rounded} class={className} {...triggerProps}>{@render children?.()}</Button>
{/if}
