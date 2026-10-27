<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	import type { ItemProps } from "./index.js";
	const { value, size, disabled, onclick, class: className, ...props }: ItemProps = $props();
	const ctx = useCompCtx();
	const isChecked = $derived(ctx.value === value);
	const isDisabled = $derived(ctx.disabled || !!disabled);
	// Only the checked item is in the tab order; when none is checked, every item stays reachable.
	const tabIndex = $derived(isChecked || !ctx.value ? 0 : -1);

	/** Checks this item, unless a passed click handler prevented the default. */
	const handleClick = (e: MouseEvent) => {
		onclick?.(e);
		// If the passed handler called preventDefault: keep the current item.
		if (e.defaultPrevented) return;
		ctx.select(value);
	};
</script>

<!-- Circle that shows a dot while checked. -->
<button type="button" class={["radioGroupItem", className]} role="radio" aria-checked={isChecked} tabindex={tabIndex} disabled={isDisabled} data-state={isChecked ? "checked" : "unchecked"} data-size={size ?? ctx.size} onclick={handleClick} {...props}>
	{#if isChecked}
		<span class="radioGroupIndicator" aria-hidden="true"></span>
	{/if}
</button>

<style>
	/* Base item; always a circle */
	.radioGroupItem {
		display: inline-flex;
		flex-shrink: 0;
		justify-content: center;
		align-items: center;
		transition-duration: 150ms;
		transition-property: color, border-color, box-shadow;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		cursor: pointer;
		box-sizing: border-box;
		outline: none;
		box-shadow: 0 1px 2px 0 color-mix(in oklab, var(--foreground) 5%, transparent);
		border: 1px solid var(--input);
		border-radius: var(--radius-pill);
		background-color: transparent;
		padding: 0;
	}

	:global(.dark) .radioGroupItem {
		background-color: color-mix(in oklab, var(--input) 30%, transparent);
	}

	/* Filled dot in the center */
	.radioGroupIndicator {
		border-radius: var(--radius-pill);
		background-color: var(--primary);
	}

	/* =============== States =============== */

	/* Keyboard focus ring */
	.radioGroupItem:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
		border-color: var(--ring);
	}

	/* Invalid state from aria-invalid */
	.radioGroupItem[aria-invalid="true"] {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--destructive) 20%, transparent);
		border-color: var(--destructive);
	}

	:global(.dark) .radioGroupItem[aria-invalid="true"] {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--destructive) 40%, transparent);
	}

	/* Disabled state */
	.radioGroupItem:disabled {
		opacity: 50%;
		cursor: not-allowed;
	}

	/* =============== Sizes =============== */

	/* Large */
	.radioGroupItem[data-size="lg"] {
		width: 1.25rem; /* 20px */
		height: 1.25rem; /* 20px */
	}

	.radioGroupItem[data-size="lg"] .radioGroupIndicator {
		width: 0.625rem; /* 10px */
		height: 0.625rem; /* 10px */
	}

	/* Medium — default */
	.radioGroupItem[data-size="md"] {
		width: 1rem; /* 16px */
		height: 1rem; /* 16px */
	}

	.radioGroupItem[data-size="md"] .radioGroupIndicator {
		width: 0.5rem; /* 8px */
		height: 0.5rem; /* 8px */
	}

	/* Small */
	.radioGroupItem[data-size="sm"] {
		width: 0.875rem; /* 14px */
		height: 0.875rem; /* 14px */
	}

	.radioGroupItem[data-size="sm"] .radioGroupIndicator {
		width: 0.375rem; /* 6px */
		height: 0.375rem; /* 6px */
	}

	/* Extra small */
	.radioGroupItem[data-size="xs"] {
		width: 0.75rem; /* 12px */
		height: 0.75rem; /* 12px */
	}

	.radioGroupItem[data-size="xs"] .radioGroupIndicator {
		width: 0.375rem; /* 6px */
		height: 0.375rem; /* 6px */
	}
</style>
