<script lang="ts">
	import { ChevronDownIcon } from "@lucide/svelte";
	import { useCompCtx, useItemCtx } from "./ctx.svelte.js";
	import type { TriggerProps, TriggerAttrs } from "./index.js";
	const { children, trigger, onclick, onkeydown, class: className, ...props }: TriggerProps = $props();
	const ctx = useCompCtx();
	const itemCtx = useItemCtx();

	const isOpen = $derived(ctx.isOpen(itemCtx.value));
	const triggerProps: TriggerAttrs = $derived({
		id: ctx.triggerId(itemCtx.value),
		"aria-expanded": isOpen,
		"aria-controls": ctx.contentId(itemCtx.value),
		disabled: itemCtx.disabled,
		"data-state": isOpen ? "open" : "closed",
		"data-accordion-trigger": true,
		onclick: () => ctx.toggle(itemCtx.value),
		onkeydown: moveFocus,
	});

	// Function declarations are hoisted, so the derived props above can reference them.

	/** Moves focus between the triggers of this accordion with the arrows, Home, and End. */
	function moveFocus(e: KeyboardEvent) {
		const current = e.currentTarget;
		// If the event has no element target: there is nothing to move from.
		if (!(current instanceof HTMLElement)) return;
		const root = current.closest(".accordion");
		// Enabled triggers of this accordion only, leaving out those of nested accordions.
		const triggers = [...(root?.querySelectorAll<HTMLElement>("[data-accordion-trigger]:not(:disabled)") ?? [])].filter((trigger) => trigger.closest(".accordion") === root);
		const index = triggers.indexOf(current);
		// The arrows wrap around at the ends.
		const keyIndexes: Record<string, number> = { ArrowDown: (index + 1) % triggers.length, ArrowUp: index <= 0 ? triggers.length - 1 : index - 1, Home: 0, End: triggers.length - 1 };
		// If the key does not move focus: leave it alone.
		if (!(e.key in keyIndexes)) return;
		e.preventDefault();
		triggers[keyIndexes[e.key]]?.focus();
	}

	/** Opens or closes the item, unless a passed click handler prevented the default. */
	function handleClick(e: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
		onclick?.(e);
		// If the passed handler called preventDefault: keep the current state.
		if (e.defaultPrevented) return;
		ctx.toggle(itemCtx.value);
	}

	/** Runs a passed key handler, then moves focus unless it prevented the default. */
	function handleKeydown(e: KeyboardEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
		onkeydown?.(e);
		// If a passed handler prevented the default: leave the key alone.
		if (e.defaultPrevented) return;
		moveFocus(e);
	}
</script>

<!-- Heading that wraps the trigger, so the items show up in the page outline. -->
<h3 class="accordionHeader">
	<!-- Render the custom trigger when given, otherwise a button with a chevron. -->
	{#if trigger}
		{@render trigger({ props: triggerProps })}
	{:else}
		<button type="button" class={["accordionTrigger", className]} {...triggerProps} onclick={handleClick} onkeydown={handleKeydown} {...props}>
			{@render children?.()}
			<ChevronDownIcon aria-hidden="true" />
		</button>
	{/if}
</h3>

<style>
	/* Heading resets so the button sets the type */
	.accordionHeader {
		display: flex;
		margin: 0;
		font: inherit;
	}

	/* Base trigger; full-width row with the label and a chevron */
	.accordionTrigger {
		display: flex;
		flex: 1;
		justify-content: space-between;
		align-items: flex-start;
		gap: var(--spacing-lg);
		transition-duration: 150ms;
		transition-property: box-shadow, opacity;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		cursor: pointer;
		outline: none;
		border: none;
		border-radius: var(--accordion-radius);
		background-color: transparent;
		padding-inline: 0;
		padding-block: var(--accordion-padding-block);
		color: inherit;
		font: inherit;
		font-weight: 500;
		text-align: start;
	}

	.accordionTrigger:hover {
		text-decoration: underline;
		text-underline-offset: 0.25rem; /* 4px */
	}

	/* Chevron lines up with the first line of the label and flips while open */
	.accordionTrigger :global(svg) {
		flex-shrink: 0;
		translate: 0 calc((var(--accordion-line-height) - var(--accordion-icon)) / 2);
		transition: rotate 200ms cubic-bezier(0.4, 0, 0.2, 1);
		width: var(--accordion-icon);
		height: var(--accordion-icon);
		pointer-events: none;
		color: var(--muted-foreground);
	}

	/* =============== States =============== */

	.accordionTrigger[data-state="open"] :global(svg) {
		rotate: 180deg;
	}

	/* Keyboard focus ring */
	.accordionTrigger:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
	}

	/* Disabled state */
	.accordionTrigger:disabled {
		opacity: 50%;
		cursor: not-allowed;
		text-decoration: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.accordionTrigger :global(svg) {
			transition: none;
		}
	}
</style>
