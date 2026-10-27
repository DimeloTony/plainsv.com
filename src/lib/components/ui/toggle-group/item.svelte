<script lang="ts">
	import { Toggle } from "#lib/components/ui/toggle/index.js";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { ItemProps } from "./index.js";
	const { value, variant, size, rounded, disabled, children, onclick, onfocus, ...props }: ItemProps = $props();
	const ctx = useCompCtx();
	const isPressed = $derived(ctx.values.includes(value));
	const isSingle = $derived(ctx.type === "single");
	// Only the tab stop is in the tab order; when there is none, every item stays reachable.
	const tabIndex = $derived(!ctx.tabStopValue || ctx.tabStopValue === value ? 0 : -1);

	/** Presses or releases this item through the group, unless a passed click handler prevented the default. */
	const handleClick = (e: MouseEvent) => {
		onclick?.(e);
		// If the passed handler called preventDefault: keep the current state.
		if (e.defaultPrevented) return;
		ctx.toggle(value);
		// The group owns the state, so stop the toggle from flipping its own.
		e.preventDefault();
	};

	/** Makes this item the tab stop once it has focus. */
	const handleFocus = (e: FocusEvent) => {
		onfocus?.(e);
		ctx.focusedValue = value;
	};
</script>

<!-- Toggle styled by the group unless the item sets its own style; single selection items are announced as radios. -->
<Toggle pressed={isPressed} variant={variant ?? ctx.variant} size={size ?? ctx.size} rounded={rounded ?? ctx.rounded} disabled={ctx.disabled || disabled} tabindex={tabIndex} role={isSingle ? "radio" : undefined} aria-checked={isSingle ? isPressed : undefined} aria-pressed={isSingle ? undefined : isPressed} data-toggle-group-item onclick={handleClick} onfocus={handleFocus} {...props}>
	{@render children()}
</Toggle>
