<script lang="ts" generics="T extends ToggleGroupType = 'single'">
	import { setCompCtx } from "./ctx.svelte.js";
	import type { Props, ToggleGroupType, ToggleGroupValue } from "./index.js";
	import type { CompCtxProps } from "./ctx.svelte.js";
	let { type: typeProp, value = $bindable(), onValueChange, disabled = false, orientation = "horizontal", spacing = "none", variant = "default", size = "md", rounded, children, onkeydown, class: className, ...props }: Props<T> = $props();
	// `single` is the default selection type.
	const type = $derived(typeProp ?? "single");
	const values = $derived(toValues(value));
	const contextData: Omit<CompCtxProps, "onValuesChange"> = $derived({ values, type, disabled, variant, size, rounded });
	const ctx = setCompCtx({ ...contextData, onValuesChange: handleValuesChange });

	// Keep the shared settings and pressed values in sync when the props change.
	$effect.pre(() => void Object.assign(ctx, contextData));

	// Function declarations are hoisted, so the context above can reference them.

	/** Lists the pressed values for both selection types; a single value becomes a list of one. */
	function toValues(current: string | string[] | undefined) {
		// If several items can be pressed: the value is already a list.
		if (Array.isArray(current)) return current;
		return current ? [current] : [];
	}

	/** Writes the pressed values back to `value` in the shape of the selection type, and reports the change. */
	function handleValuesChange(nextValues: string[]) {
		// The value shape follows the generic `type`, which a runtime check cannot narrow, so it is cast once here.
		const nextValue = (type === "multiple" ? nextValues : (nextValues[0] ?? "")) as ToggleGroupValue<T>;
		value = nextValue;
		onValueChange?.(nextValue);
	}

	/** Moves focus between items with the arrow keys, Home, and End. */
	function handleKeydown(e: KeyboardEvent & { currentTarget: HTMLDivElement }) {
		onkeydown?.(e);
		// If a passed handler prevented the default: leave the key alone.
		if (e.defaultPrevented) return;
		const items = [...e.currentTarget.querySelectorAll<HTMLButtonElement>("[data-toggle-group-item]:not(:disabled)")];
		const currentIndex = items.findIndex((item) => item === document.activeElement);
		// If focus is not on an enabled item: leave the key alone.
		if (currentIndex === -1) return;
		// Arrow keys follow the orientation and wrap around at the ends.
		const isVertical = orientation === "vertical";
		const keyIndexes: Record<string, number> = {
			[isVertical ? "ArrowUp" : "ArrowLeft"]: (currentIndex - 1 + items.length) % items.length,
			[isVertical ? "ArrowDown" : "ArrowRight"]: (currentIndex + 1) % items.length,
			Home: 0,
			End: items.length - 1,
		};
		const nextItem = items[keyIndexes[e.key]];
		// If the key does not move between items: let it through, so Space and Enter press the item.
		if (!nextItem) return;
		e.preventDefault();
		nextItem.focus();
	}
</script>

<!-- Group of toggles; single selection is announced as a radio group. -->
<div class={["toggleGroup not-typeset", className]} role={type === "single" ? "radiogroup" : "group"} aria-orientation={orientation} data-orientation={orientation} data-spacing={spacing} data-variant={variant} data-size={size} data-rounded={rounded} onkeydown={handleKeydown} {...props}>
	{@render children()}
</div>

<style>
	/* Base group */
	.toggleGroup {
		display: inline-flex;
		align-items: center;
		width: fit-content;
	}

	/* Items stack and stretch to the widest one */
	.toggleGroup[data-orientation="vertical"] {
		flex-direction: column;
		align-items: stretch;
	}

	/* Focused items rise above their neighbors so the ring is not covered */
	.toggleGroup > :global(.toggle:focus-visible) {
		position: relative;
		z-index: 1;
	}

	/* =============== Variants =============== */

	/* Joined items: square inner corners; [data-orientation] keeps these above the toggle's own radius */
	.toggleGroup[data-spacing="none"][data-orientation] > :global(.toggle) {
		border-radius: 0;
	}

	.toggleGroup[data-spacing="none"][data-orientation="horizontal"] > :global(.toggle:first-child) {
		border-top-left-radius: var(--toggle-group-radius);
		border-bottom-left-radius: var(--toggle-group-radius);
	}

	.toggleGroup[data-spacing="none"][data-orientation="horizontal"] > :global(.toggle:last-child) {
		border-top-right-radius: var(--toggle-group-radius);
		border-bottom-right-radius: var(--toggle-group-radius);
	}

	.toggleGroup[data-spacing="none"][data-orientation="vertical"] > :global(.toggle:first-child) {
		border-top-right-radius: var(--toggle-group-radius);
		border-top-left-radius: var(--toggle-group-radius);
	}

	.toggleGroup[data-spacing="none"][data-orientation="vertical"] > :global(.toggle:last-child) {
		border-bottom-right-radius: var(--toggle-group-radius);
		border-bottom-left-radius: var(--toggle-group-radius);
	}

	/* Joined outline items share one border between neighbors, and the group draws one shadow */
	.toggleGroup[data-spacing="none"][data-variant="outline"] {
		box-shadow: 0 1px 2px 0 color-mix(in oklab, var(--foreground) 5%, transparent);
		border-radius: var(--toggle-group-radius);
	}

	.toggleGroup[data-spacing="none"][data-variant="outline"] > :global(.toggle:not(:focus-visible)) {
		box-shadow: none;
	}

	.toggleGroup[data-spacing="none"][data-variant="outline"][data-orientation="horizontal"] > :global(.toggle:not(:first-child)) {
		border-left-width: 0;
	}

	.toggleGroup[data-spacing="none"][data-variant="outline"][data-orientation="vertical"] > :global(.toggle:not(:first-child)) {
		border-top-width: 0;
	}

	/* =============== Sizes =============== */

	/* Large */
	.toggleGroup[data-size="lg"] {
		--toggle-group-radius: var(--radius-lg);
	}

	/* Medium — default */
	.toggleGroup[data-size="md"] {
		--toggle-group-radius: var(--radius-md);
	}

	/* Small */
	.toggleGroup[data-size="sm"] {
		--toggle-group-radius: var(--radius-sm);
	}

	/* Extra small */
	.toggleGroup[data-size="xs"] {
		--toggle-group-radius: var(--radius-xs);
	}

	/* Gap between spaced items */
	.toggleGroup[data-spacing="xs"] {
		gap: var(--spacing-xs);
	}

	.toggleGroup[data-spacing="sm"] {
		gap: var(--spacing-sm);
	}

	.toggleGroup[data-spacing="md"] {
		gap: var(--spacing-md);
	}

	.toggleGroup[data-spacing="lg"] {
		gap: var(--spacing-lg);
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius of the joined group; must stay after the size rules */
	.toggleGroup[data-rounded="xs"] {
		--toggle-group-radius: var(--radius-xs);
	}

	.toggleGroup[data-rounded="sm"] {
		--toggle-group-radius: var(--radius-sm);
	}

	.toggleGroup[data-rounded="md"] {
		--toggle-group-radius: var(--radius-md);
	}

	.toggleGroup[data-rounded="lg"] {
		--toggle-group-radius: var(--radius-lg);
	}

	.toggleGroup[data-rounded="xl"] {
		--toggle-group-radius: var(--radius-xl);
	}

	.toggleGroup[data-rounded="2xl"] {
		--toggle-group-radius: var(--radius-2xl);
	}

	.toggleGroup[data-rounded="3xl"] {
		--toggle-group-radius: var(--radius-3xl);
	}

	.toggleGroup[data-rounded="4xl"] {
		--toggle-group-radius: var(--radius-4xl);
	}

	.toggleGroup[data-rounded="pill"] {
		--toggle-group-radius: var(--radius-pill);
	}
</style>
