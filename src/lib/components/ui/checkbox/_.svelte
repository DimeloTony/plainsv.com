<script lang="ts">
	import { CheckIcon, MinusIcon } from "@lucide/svelte";
	import type { Props } from "./index.js";
	let { checked = $bindable(), defaultChecked = false, indeterminate = $bindable(false), onCheckedChange, name, value = "on", variant = "default", size = "md", rounded, onclick, class: className, ...props }: Props = $props();
	const isChecked = $derived(checked ?? defaultChecked);
	const state = $derived(indeterminate ? "indeterminate" : isChecked ? "checked" : "unchecked");

	/** Toggles the checkbox, unless a passed click handler prevented the default. */
	const handleClick = (e: MouseEvent) => {
		onclick?.(e);
		// If the passed handler called preventDefault: keep the current state.
		if (e.defaultPrevented) return;
		// If the checkbox was mixed: checking it settles the group, like a native checkbox.
		checked = indeterminate || !isChecked;
		indeterminate = false;
		onCheckedChange?.(checked);
	};
</script>

<!-- Toggle button that shows a check while checked and a dash while mixed. -->
<button type="button" class={["checkbox not-typeset", className]} role="checkbox" aria-checked={indeterminate ? "mixed" : isChecked} data-state={state} data-variant={variant} data-size={size} data-rounded={rounded} onclick={handleClick} {...props}>
	{#if indeterminate}
		<MinusIcon aria-hidden="true" />
	{:else if isChecked}
		<CheckIcon aria-hidden="true" />
	{/if}
</button>

<!-- Submit the value like a native checkbox: only while checked. -->
{#if name && isChecked}
	<input type="hidden" {name} {value} />
{/if}

<style>
	/* Base checkbox */
	.checkbox {
		display: inline-flex;
		flex-shrink: 0;
		justify-content: center;
		align-items: center;
		transition-duration: 150ms;
		transition-property: color, background-color, border-color, box-shadow;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		cursor: pointer;
		box-sizing: border-box;
		outline: none;
		box-shadow: 0 1px 2px 0 color-mix(in oklab, var(--foreground) 5%, transparent);
		border: 1px solid var(--input);
		background-color: transparent;
		padding: 0;
	}

	:global(.dark) .checkbox {
		background-color: color-mix(in oklab, var(--input) 30%, transparent);
	}

	/* Check and dash icons fill most of the box */
	.checkbox :global(svg) {
		flex-shrink: 0;
		width: var(--checkbox-icon);
		height: var(--checkbox-icon);
		pointer-events: none;
	}

	/* =============== Variants =============== */

	.checkbox[data-variant="default"]:is([data-state="checked"], [data-state="indeterminate"]) {
		border-color: var(--primary);
		background-color: var(--primary);
		color: var(--primary-foreground);
	}

	.checkbox[data-variant="destructive"]:is([data-state="checked"], [data-state="indeterminate"]) {
		border-color: var(--destructive);
		background-color: var(--destructive);
		color: var(--destructive-foreground);
	}

	/* =============== States =============== */

	/* Keyboard focus ring */
	.checkbox[data-variant]:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
		border-color: var(--ring);
	}

	.checkbox[data-variant="destructive"]:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--destructive) 20%, transparent);
	}

	:global(.dark) .checkbox[data-variant="destructive"]:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--destructive) 40%, transparent);
	}

	/* Invalid state from aria-invalid */
	.checkbox[data-variant][aria-invalid="true"] {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--destructive) 20%, transparent);
		border-color: var(--destructive);
	}

	:global(.dark) .checkbox[data-variant][aria-invalid="true"] {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--destructive) 40%, transparent);
	}

	/* Disabled state */
	.checkbox:disabled {
		opacity: 50%;
		cursor: not-allowed;
	}

	/* =============== Sizes =============== */

	/* Large */
	.checkbox[data-size="lg"] {
		--checkbox-icon: 1rem; /* 16px */
		border-radius: var(--radius-sm);
		width: 1.25rem; /* 20px */
		height: 1.25rem; /* 20px */
	}

	/* Medium — default */
	.checkbox[data-size="md"] {
		--checkbox-icon: 0.875rem; /* 14px */
		border-radius: var(--radius-xs);
		width: 1rem; /* 16px */
		height: 1rem; /* 16px */
	}

	/* Small */
	.checkbox[data-size="sm"] {
		--checkbox-icon: 0.75rem; /* 12px */
		border-radius: var(--radius-xs);
		width: 0.875rem; /* 14px */
		height: 0.875rem; /* 14px */
	}

	/* Extra small */
	.checkbox[data-size="xs"] {
		--checkbox-icon: 0.625rem; /* 10px */
		border-radius: var(--radius-xs);
		width: 0.75rem; /* 12px */
		height: 0.75rem; /* 12px */
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius; must stay after the size rules */
	.checkbox[data-rounded="xs"] {
		border-radius: var(--radius-xs);
	}

	.checkbox[data-rounded="sm"] {
		border-radius: var(--radius-sm);
	}

	.checkbox[data-rounded="md"] {
		border-radius: var(--radius-md);
	}

	.checkbox[data-rounded="lg"] {
		border-radius: var(--radius-lg);
	}

	.checkbox[data-rounded="xl"] {
		border-radius: var(--radius-xl);
	}

	.checkbox[data-rounded="2xl"] {
		border-radius: var(--radius-2xl);
	}

	.checkbox[data-rounded="3xl"] {
		border-radius: var(--radius-3xl);
	}

	.checkbox[data-rounded="4xl"] {
		border-radius: var(--radius-4xl);
	}

	.checkbox[data-rounded="pill"] {
		border-radius: var(--radius-pill);
	}
</style>
