<script lang="ts">
	import { setCompCtx } from "./ctx.svelte.js";
	import type { Props } from "./index.js";
	import type { CompCtxProps } from "./ctx.svelte.js";
	let { defaultValue = "", value = $bindable(defaultValue), onValueChange, name, disabled = false, orientation = "vertical", size = "md", children, onkeydown, class: className, ...props }: Props = $props();
	const contextData: Omit<CompCtxProps, "value"> = $derived({ disabled, size, onValueChange });
	const ctx = setCompCtx({ ...contextData, value });

	// Keep the shared settings in sync when the props change.
	$effect.pre(() => void Object.assign(ctx, contextData));

	// Keep the bindable prop and the shared value in sync in both directions.
	$effect.pre(() => void (ctx.value = value));
	$effect.pre(() => void (value = ctx.value));

	/** Moves focus to the previous or next item with the arrow keys and checks it, like native radio buttons. */
	const handleKeydown = (e: KeyboardEvent & { currentTarget: HTMLDivElement }) => {
		onkeydown?.(e);
		// If a passed handler prevented the default: leave the key alone.
		if (e.defaultPrevented) return;
		const items = [...e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]:not(:disabled)')];
		const currentIndex = items.findIndex((item) => item === document.activeElement);
		// If focus is not on an enabled item: leave the key alone.
		if (currentIndex === -1) return;
		// Both arrow axes move, and wrap around at the ends.
		const keyIndexes: Record<string, number> = {
			ArrowUp: (currentIndex - 1 + items.length) % items.length,
			ArrowLeft: (currentIndex - 1 + items.length) % items.length,
			ArrowDown: (currentIndex + 1) % items.length,
			ArrowRight: (currentIndex + 1) % items.length,
		};
		const nextItem = items[keyIndexes[e.key]];
		// If the key does not move between items: let it through.
		if (!nextItem) return;
		e.preventDefault();
		nextItem.focus();
		nextItem.click();
	};
</script>

<!-- Radio group; only the checked item is in the tab order. -->
<div class={["radioGroup not-typeset", className]} role="radiogroup" aria-orientation={orientation} aria-disabled={disabled || undefined} data-orientation={orientation} data-size={size} onkeydown={handleKeydown} {...props}>
	{@render children()}
</div>

<!-- Submit the checked value like a native radio group. -->
{#if name && ctx.value}
	<input type="hidden" {name} value={ctx.value} />
{/if}

<style>
	/* Base group; items stack */
	.radioGroup {
		display: flex;
		flex-direction: column;
	}

	/* Items sit in a row and wrap */
	.radioGroup[data-orientation="horizontal"] {
		flex-direction: row;
		flex-wrap: wrap;
	}

	/* =============== Sizes =============== */

	/* Large */
	.radioGroup[data-size="lg"] {
		gap: var(--spacing-md);
	}

	/* Medium — default */
	.radioGroup[data-size="md"] {
		gap: var(--spacing-md);
	}

	/* Small */
	.radioGroup[data-size="sm"] {
		gap: var(--spacing-sm);
	}

	/* Extra small */
	.radioGroup[data-size="xs"] {
		gap: var(--spacing-sm);
	}
</style>
