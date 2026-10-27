<script lang="ts">
	import type { Props } from "./index.js";
	let { checked = $bindable(), defaultChecked = false, onCheckedChange, name, value = "on", variant = "default", size = "md", rounded = "pill", onclick, class: className, ...props }: Props = $props();
	const isChecked = $derived(checked ?? defaultChecked);
	const state = $derived(isChecked ? "checked" : "unchecked");

	/** Toggles the switch, unless a passed click handler prevented the default. */
	const handleClick = (e: MouseEvent) => {
		onclick?.(e);
		// If the passed handler called preventDefault: keep the current state.
		if (e.defaultPrevented) return;
		checked = !isChecked;
		onCheckedChange?.(checked);
	};
</script>

<!-- Toggle button with a thumb that slides to the end while on. -->
<button type="button" class={["switch not-typeset", className]} role="switch" aria-checked={isChecked} data-state={state} data-variant={variant} data-size={size} data-rounded={rounded} onclick={handleClick} {...props}>
	<span class="switchThumb" data-state={state}></span>
</button>

<!-- Submit the value like a checkbox: only while the switch is on. -->
{#if name && isChecked}
	<input type="hidden" {name} {value} />
{/if}

<style>
	/* Base switch; the thumb travels the track width minus its own size */
	.switch {
		display: inline-flex;
		flex-shrink: 0;
		align-items: center;
		transition-duration: 150ms;
		transition-property: background-color, border-color, box-shadow;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		cursor: pointer;
		box-sizing: border-box;
		outline: none;
		border: 1px solid transparent;
		border-radius: var(--switch-radius);
		padding: 0;
		width: var(--switch-width);
		height: var(--switch-height);
	}

	/* Fills the track height inside the border */
	.switchThumb {
		display: block;
		transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
		border-radius: var(--switch-radius);
		background-color: var(--background);
		width: calc(var(--switch-height) - 2px);
		height: calc(var(--switch-height) - 2px);
		pointer-events: none;
	}

	.switchThumb[data-state="checked"] {
		transform: translateX(calc(var(--switch-width) - var(--switch-height)));
	}

	/* =============== Variants =============== */

	/* Off track; shared by every variant */
	.switch[data-state="unchecked"] {
		background-color: var(--input);
	}

	:global(.dark) .switch[data-state="unchecked"] {
		background-color: color-mix(in oklab, var(--input) 80%, transparent);
	}

	/* A light thumb would vanish on the dark off track */
	:global(.dark) .switchThumb[data-state="unchecked"] {
		background-color: var(--foreground);
	}

	.switch[data-variant="default"][data-state="checked"] {
		background-color: var(--primary);
	}

	:global(.dark) .switch[data-variant="default"] .switchThumb[data-state="checked"] {
		background-color: var(--primary-foreground);
	}

	.switch[data-variant="destructive"][data-state="checked"] {
		background-color: var(--destructive);
	}

	/* =============== States =============== */

	/* Keyboard focus ring */
	.switch[data-variant]:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
		border-color: var(--ring);
	}

	.switch[data-variant="destructive"]:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--destructive) 20%, transparent);
	}

	:global(.dark) .switch[data-variant="destructive"]:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--destructive) 40%, transparent);
	}

	/* Invalid state from aria-invalid */
	.switch[data-variant][aria-invalid="true"] {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--destructive) 20%, transparent);
		border-color: var(--destructive);
	}

	:global(.dark) .switch[data-variant][aria-invalid="true"] {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--destructive) 40%, transparent);
	}

	/* Disabled state */
	.switch:disabled {
		opacity: 50%;
		cursor: not-allowed;
	}

	/* =============== Sizes =============== */

	/* Large */
	.switch[data-size="lg"] {
		--switch-width: 2.5rem; /* 40px */
		--switch-height: 1.375rem; /* 22px */
		--switch-radius: var(--radius-lg);
	}

	/* Medium — default */
	.switch[data-size="md"] {
		--switch-width: 2rem; /* 32px */
		--switch-height: 1.125rem; /* 18px */
		--switch-radius: var(--radius-md);
	}

	/* Small */
	.switch[data-size="sm"] {
		--switch-width: 1.75rem; /* 28px */
		--switch-height: 1rem; /* 16px */
		--switch-radius: var(--radius-sm);
	}

	/* Extra small */
	.switch[data-size="xs"] {
		--switch-width: 1.5rem; /* 24px */
		--switch-height: 0.875rem; /* 14px */
		--switch-radius: var(--radius-xs);
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius; must stay after the size rules */
	.switch[data-rounded="xs"] {
		--switch-radius: var(--radius-xs);
	}

	.switch[data-rounded="sm"] {
		--switch-radius: var(--radius-sm);
	}

	.switch[data-rounded="md"] {
		--switch-radius: var(--radius-md);
	}

	.switch[data-rounded="lg"] {
		--switch-radius: var(--radius-lg);
	}

	.switch[data-rounded="xl"] {
		--switch-radius: var(--radius-xl);
	}

	.switch[data-rounded="2xl"] {
		--switch-radius: var(--radius-2xl);
	}

	.switch[data-rounded="3xl"] {
		--switch-radius: var(--radius-3xl);
	}

	.switch[data-rounded="4xl"] {
		--switch-radius: var(--radius-4xl);
	}

	.switch[data-rounded="pill"] {
		--switch-radius: var(--radius-pill);
	}
</style>
