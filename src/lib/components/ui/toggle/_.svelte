<script lang="ts">
	import type { Props } from "./index.js";
	let { pressed = $bindable(), defaultPressed = false, onPressedChange, variant = "default", size = "md", rounded, children, onclick, class: className, ...props }: Props = $props();
	const isPressed = $derived(pressed ?? defaultPressed);

	/** Flips the pressed state, unless a passed click handler prevented the default. */
	const handleClick = (e: MouseEvent) => {
		onclick?.(e);
		// If the passed handler called preventDefault: keep the current state.
		if (e.defaultPrevented) return;
		pressed = !isPressed;
		onPressedChange?.(pressed);
	};
</script>

<!-- Button that stays pressed until it is clicked again. -->
<button type="button" class={["toggle not-typeset", className]} aria-pressed={isPressed} data-state={isPressed ? "on" : "off"} data-variant={variant} data-size={size} data-rounded={rounded} onclick={handleClick} {...props}>
	{@render children()}
</button>

<style>
	/* Base toggle */
	.toggle {
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
		border: 1px solid transparent;
		background-color: transparent;
		color: var(--foreground);
		font-weight: 500;
		white-space: nowrap;
	}

	.toggle:hover {
		background-color: var(--muted);
		color: var(--muted-foreground);
	}

	.toggle :global(svg) {
		flex-shrink: 0;
		pointer-events: none;
	}

	/* =============== Variants =============== */

	/* Bordered toggle */
	.toggle[data-variant="outline"] {
		box-shadow: 0 1px 2px 0 color-mix(in oklab, var(--foreground) 5%, transparent);
		border-color: var(--input);
	}

	.toggle[data-variant="outline"]:hover {
		background-color: var(--accent);
		color: var(--accent-foreground);
	}

	/* =============== States =============== */

	/* Pressed state */
	.toggle[data-state="on"] {
		background-color: var(--accent);
		color: var(--accent-foreground);
	}

	/* Keyboard focus ring; [data-variant] keeps it above the variant border colors */
	.toggle[data-variant]:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
		border-color: var(--ring);
	}

	/* Invalid state from aria-invalid */
	.toggle[data-variant][aria-invalid="true"] {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--destructive) 20%, transparent);
		border-color: var(--destructive);
	}

	:global(.dark) .toggle[data-variant][aria-invalid="true"] {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--destructive) 40%, transparent);
	}

	/* Disabled state */
	.toggle:disabled {
		opacity: 50%;
		pointer-events: none;
	}

	/* =============== Sizes =============== */

	/* Large */
	.toggle[data-size="lg"] {
		gap: var(--spacing-sm);
		border-radius: var(--radius-lg);
		padding-inline: calc(var(--spacing-xs) * 2.5); /* 10px */
		min-width: var(--control-height-lg);
		height: var(--control-height-lg);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Medium — default */
	.toggle[data-size="md"] {
		gap: var(--spacing-sm);
		border-radius: var(--radius-md);
		padding-inline: var(--spacing-sm);
		min-width: var(--control-height-md);
		height: var(--control-height-md);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	.toggle[data-size="lg"] :global(svg),
	.toggle[data-size="md"] :global(svg) {
		width: 1rem; /* 16px */
		height: 1rem; /* 16px */
	}

	/* Small */
	.toggle[data-size="sm"] {
		gap: var(--spacing-xs);
		border-radius: var(--radius-sm);
		padding-inline: calc(var(--spacing-xs) * 1.5); /* 6px */
		min-width: var(--control-height-sm);
		height: var(--control-height-sm);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	.toggle[data-size="sm"] :global(svg) {
		width: var(--text-sm);
		height: var(--text-sm);
	}

	/* Extra small */
	.toggle[data-size="xs"] {
		gap: var(--spacing-xs);
		border-radius: var(--radius-xs);
		padding-inline: var(--spacing-xs);
		min-width: var(--control-height-xs);
		height: var(--control-height-xs);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	.toggle[data-size="xs"] :global(svg) {
		width: var(--text-xs);
		height: var(--text-xs);
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius; must stay after the size rules */
	.toggle[data-rounded="xs"] {
		border-radius: var(--radius-xs);
	}

	.toggle[data-rounded="sm"] {
		border-radius: var(--radius-sm);
	}

	.toggle[data-rounded="md"] {
		border-radius: var(--radius-md);
	}

	.toggle[data-rounded="lg"] {
		border-radius: var(--radius-lg);
	}

	.toggle[data-rounded="xl"] {
		border-radius: var(--radius-xl);
	}

	.toggle[data-rounded="2xl"] {
		border-radius: var(--radius-2xl);
	}

	.toggle[data-rounded="3xl"] {
		border-radius: var(--radius-3xl);
	}

	.toggle[data-rounded="4xl"] {
		border-radius: var(--radius-4xl);
	}

	.toggle[data-rounded="pill"] {
		border-radius: var(--radius-pill);
	}
</style>
