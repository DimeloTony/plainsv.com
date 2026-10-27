<script lang="ts">
	import { createAttachmentKey } from "svelte/attachments";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { TriggerProps, TriggerAttrs } from "./index.js";
	const { children, href, trigger }: TriggerProps = $props();
	const ctx = useCompCtx();
	// One key for the life of the trigger, so the element is not re-registered on every open.
	const registerKey = createAttachmentKey();
	const triggerProps: TriggerAttrs = $derived({
		onpointerenter: handlePointerEnter,
		onpointerleave: () => ctx.scheduleClose(),
		onfocus: handleFocus,
		onblur: () => ctx.scheduleClose(),
		[registerKey]: registerTrigger,
	});

	// Function declarations are hoisted, so the derived props above can reference them.

	/** Registers the trigger element so the card can be placed against it. */
	function registerTrigger(node: HTMLElement) {
		ctx.triggerEl = node;
		return () => {
			// If another trigger has not taken over: clear the reference.
			if (ctx.triggerEl === node) ctx.triggerEl = undefined;
		};
	}

	/** Opens the card after the delay for a mouse or pen. */
	function handlePointerEnter(e: PointerEvent) {
		// If this is a touch: skip, since the tap follows the link instead.
		if (e.pointerType === "touch") return;
		ctx.scheduleOpen();
	}

	/** Opens the card when the trigger gets keyboard focus. */
	function handleFocus(e: FocusEvent) {
		// If focus came from a click rather than the keyboard: leave it closed.
		if (e.currentTarget instanceof Element && e.currentTarget.matches(":focus-visible")) ctx.scheduleOpen();
	}
</script>

<!-- Render the custom trigger when given, otherwise a link. -->
{#if trigger}
	{@render trigger({ props: triggerProps })}
{:else}
	<a class="hoverCardTrigger" {href} {...triggerProps}>{@render children?.()}</a>
{/if}

<style>
	/* Default link trigger */
	.hoverCardTrigger {
		color: inherit;
		font-weight: 500;
		text-decoration: underline;
		text-underline-offset: 0.25rem; /* 4px */
	}
</style>
