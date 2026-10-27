<script lang="ts">
	import type { Props } from "./index.js";
	const { children, size = "lg", rounded, href, disabled, class: className, ...props }: Props = $props();
	const isLink = $derived(href !== undefined);
</script>

<!-- Render a link when `href` is set; a disabled link drops its href and leaves the tab order. -->
<svelte:element this={isLink ? "a" : "div"} class={["card not-typeset", className]} data-size={size} data-rounded={rounded} data-link={isLink || undefined} data-disabled={disabled || undefined} href={isLink && !disabled ? href : undefined} aria-disabled={isLink && disabled ? true : undefined} role={isLink && disabled ? "link" : undefined} tabindex={isLink && disabled ? -1 : undefined} {...props}>
	{@render children()}
</svelte:element>

<style>
	/* Base card */
	.card {
		display: flex;
		flex-direction: column;
		transition-duration: 150ms;
		transition-property: color, background-color, border-color, box-shadow, opacity;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		box-sizing: border-box;
		outline: none;
		border: 1px solid var(--border);
		background-color: var(--card);
		color: var(--card-foreground);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
		text-decoration: none;
	}

	/* =============== States =============== */

	/* Hover highlight for link cards */
	.card[data-link]:hover {
		background-color: var(--accent);
		color: var(--accent-foreground);
	}

	/* Keyboard focus ring */
	.card:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
		border-color: var(--ring);
	}

	/* Disabled state for cards and links */
	.card[data-disabled] {
		opacity: 50%;
		pointer-events: none;
	}

	/* =============== Sizes =============== */

	/* Large — default */
	/* The large card uses the extra large radius, like shadcn's rounded-xl */
	.card[data-size="lg"] {
		gap: var(--spacing-xl);
		border-radius: var(--radius-xl);
		padding: var(--spacing-xl);
	}

	/* Medium */
	.card[data-size="md"] {
		gap: var(--spacing-lg);
		border-radius: var(--radius-md);
		padding: var(--spacing-lg);
	}

	/* Small */
	.card[data-size="sm"] {
		gap: var(--spacing-md);
		border-radius: var(--radius-sm);
		padding: var(--spacing-md);
	}

	/* Extra small */
	.card[data-size="xs"] {
		gap: var(--spacing-sm);
		border-radius: var(--radius-xs);
		padding: var(--spacing-sm);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius; must stay after the size rules */
	.card[data-rounded="xs"] {
		border-radius: var(--radius-xs);
	}

	.card[data-rounded="sm"] {
		border-radius: var(--radius-sm);
	}

	.card[data-rounded="md"] {
		border-radius: var(--radius-md);
	}

	.card[data-rounded="lg"] {
		border-radius: var(--radius-lg);
	}

	.card[data-rounded="xl"] {
		border-radius: var(--radius-xl);
	}

	.card[data-rounded="2xl"] {
		border-radius: var(--radius-2xl);
	}

	.card[data-rounded="3xl"] {
		border-radius: var(--radius-3xl);
	}

	.card[data-rounded="4xl"] {
		border-radius: var(--radius-4xl);
	}

	/* A true pill; tall content can clip at the corners, so use 3xl or 4xl to stay safe */
	.card[data-rounded="pill"] {
		border-radius: var(--radius-pill);
	}
</style>
