<script lang="ts">
	import type { Props } from "./index.js";
	const { children, rounded = "md", variant = "default", size = "md", href, disabled, class: className, ...props }: Props = $props();
	const isLink = $derived(href !== undefined);
</script>

<!-- Render a link when `href` is set; a disabled link drops its href and leaves the tab order. -->
<svelte:element this={isLink ? "a" : "button"} class={["button not-typeset", className]} data-variant={variant} data-size={size} data-rounded={rounded} href={isLink && !disabled ? href : undefined} disabled={isLink ? undefined : disabled} aria-disabled={isLink && disabled ? true : undefined} role={isLink && disabled ? "link" : undefined} tabindex={isLink && disabled ? -1 : undefined} {...props}>
	{@render children()}
</svelte:element>

<style>
	/* Base button */
	.button {
		display: inline-flex;
		flex-shrink: 0;
		justify-content: center;
		align-items: center;
		gap: var(--spacing-sm);
		transition-duration: 150ms;
		transition-property: color, background-color, border-color, box-shadow, opacity;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		cursor: pointer;
		box-sizing: border-box;
		outline: none;
		border: 1px solid transparent;
		font-weight: 500;
		user-select: none;
		text-decoration: none;
		white-space: nowrap;
	}

	/* =============== Variants =============== */

	/* Default action */
	.button[data-variant="default"] {
		background-color: var(--primary);
		color: var(--primary-foreground);
	}

	.button[data-variant="default"]:hover {
		background-color: color-mix(in oklab, var(--primary) 90%, transparent);
	}

	/* Bordered neutral action */
	.button[data-variant="outline"] {
		border-color: var(--border);
		background-color: var(--background);
		color: var(--foreground);
	}

	.button[data-variant="outline"]:hover {
		background-color: var(--accent);
		color: var(--accent-foreground);
	}

	:global(.dark) .button[data-variant="outline"] {
		border-color: var(--input);
		background-color: color-mix(in oklab, var(--input) 30%, transparent);
	}

	:global(.dark) .button[data-variant="outline"]:hover {
		background-color: color-mix(in oklab, var(--input) 50%, transparent);
	}

	/* Secondary action */
	.button[data-variant="secondary"] {
		background-color: var(--secondary);
		color: var(--secondary-foreground);
	}

	.button[data-variant="secondary"]:hover {
		background-color: color-mix(in oklab, var(--secondary) 80%, transparent);
	}

	/* Destructive action */
	.button[data-variant="destructive"] {
		background-color: var(--destructive);
		color: var(--destructive-foreground);
	}

	.button[data-variant="destructive"]:hover {
		background-color: color-mix(in oklab, var(--destructive) 90%, transparent);
	}

	:global(.dark) .button[data-variant="destructive"] {
		background-color: color-mix(in oklab, var(--destructive) 60%, transparent);
	}

	/* Minimal action without a visible container */
	.button[data-variant="ghost"] {
		background-color: transparent;
		color: var(--foreground);
	}

	.button[data-variant="ghost"]:hover {
		background-color: var(--accent);
		color: var(--accent-foreground);
	}

	:global(.dark) .button[data-variant="ghost"]:hover {
		background-color: color-mix(in oklab, var(--accent) 50%, transparent);
	}

	/* Text link action */
	.button[data-variant="link"] {
		background-color: transparent;
		color: var(--primary);
		text-underline-offset: 0.25rem; /* 4px */
	}

	.button[data-variant="link"]:hover {
		text-decoration: underline;
	}

	/* Content-only action with no background, border, or padding; takes the surrounding text color */
	.button[data-variant="bare"] {
		border-width: 0;
		background-color: transparent;
		color: inherit;
	}

	/* `currentColor` in `color` is the inherited color, so hover dims whatever color the parent sets */
	.button[data-variant="bare"]:hover {
		color: color-mix(in oklab, currentColor 70%, transparent);
	}

	/* =============== States =============== */

	/* Keyboard focus ring; [data-variant] keeps it above the variant border colors */
	.button[data-variant]:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
		border-color: var(--ring);
	}

	.button[data-variant="destructive"]:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--destructive) 20%, transparent);
	}

	:global(.dark) .button[data-variant="destructive"]:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--destructive) 40%, transparent);
	}

	/* Bare buttons swap the large ring for a hairline outline that follows the radius */
	.button[data-variant="bare"]:focus-visible {
		outline: 1px solid var(--ring);
		outline-offset: 2px;
		box-shadow: none;
	}

	/* Invalid state from aria-invalid */
	.button[data-variant][aria-invalid="true"] {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--destructive) 20%, transparent);
		border-color: var(--destructive);
	}

	:global(.dark) .button[data-variant][aria-invalid="true"] {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--destructive) 40%, transparent);
	}

	/* Disabled state for buttons and links */
	.button:disabled,
	.button[aria-disabled="true"] {
		opacity: 50%;
		pointer-events: none;
	}

	/* =============== Sizes =============== */

	/* Large */
	.button[data-size="lg"] {
		gap: var(--spacing-sm);
		border-radius: var(--radius-lg);
		padding-inline: var(--spacing-xl);
		height: var(--control-height-lg);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Medium — default */
	.button[data-size="md"] {
		gap: var(--spacing-sm);
		border-radius: var(--radius-md);
		padding-inline: var(--spacing-lg);
		height: var(--control-height-md);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Small */
	.button[data-size="sm"] {
		gap: var(--spacing-xs);
		border-radius: var(--radius-sm);
		padding-inline: var(--spacing-md);
		height: var(--control-height-sm);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Extra small */
	.button[data-size="xs"] {
		gap: var(--spacing-xs);
		border-radius: var(--radius-xs);
		padding-inline: var(--spacing-sm);
		height: var(--control-height-xs);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* Tighter padding when the button holds an icon */
	.button[data-size="lg"]:has(> :global(svg)) {
		padding-inline: var(--spacing-lg);
	}

	.button[data-size="md"]:has(> :global(svg)) {
		padding-inline: var(--spacing-md);
	}

	.button[data-size="sm"]:has(> :global(svg)) {
		padding-inline: var(--spacing-sm);
	}

	/* Bare buttons drop all padding and fit their content; beats the size and icon padding rules */
	.button[data-variant="bare"][data-size] {
		padding: 0;
		height: auto;
	}

	/* =============== Icon sizes =============== */

	/* Large square icon button */
	.button[data-size="icon-lg"] {
		border-radius: var(--radius-lg);
		padding: 0;
		width: var(--control-height-lg);
		height: var(--control-height-lg);
	}

	/* Medium square icon button */
	.button[data-size="icon-md"] {
		border-radius: var(--radius-md);
		padding: 0;
		width: var(--control-height-md);
		height: var(--control-height-md);
	}

	/* Small square icon button */
	.button[data-size="icon-sm"] {
		border-radius: var(--radius-sm);
		padding: 0;
		width: var(--control-height-sm);
		height: var(--control-height-sm);
	}

	/* Extra small square icon button */
	.button[data-size="icon-xs"] {
		border-radius: var(--radius-xs);
		padding: 0;
		width: var(--control-height-xs);
		height: var(--control-height-xs);
	}

	/* Bare icon buttons shrink one spacing step below the control height for inline action icons: 16, 24, 28, and 32px */
	.button[data-variant="bare"][data-size="icon-lg"] {
		width: calc(var(--control-height-lg) - var(--spacing-sm));
		height: calc(var(--control-height-lg) - var(--spacing-sm));
	}

	.button[data-variant="bare"][data-size="icon-md"] {
		width: calc(var(--control-height-md) - var(--spacing-sm));
		height: calc(var(--control-height-md) - var(--spacing-sm));
	}

	.button[data-variant="bare"][data-size="icon-sm"] {
		width: calc(var(--control-height-sm) - var(--spacing-sm));
		height: calc(var(--control-height-sm) - var(--spacing-sm));
	}

	.button[data-variant="bare"][data-size="icon-xs"] {
		width: calc(var(--control-height-xs) - var(--spacing-sm));
		height: calc(var(--control-height-xs) - var(--spacing-sm));
	}

	/* Default icon size */
	.button :global(svg) {
		flex-shrink: 0;
		width: 1rem; /* 16px */
		height: 1rem; /* 16px */
		pointer-events: none;
	}

	/* Smaller icons for compact buttons */
	.button[data-size="sm"] :global(svg),
	.button[data-size="icon-sm"] :global(svg) {
		width: var(--text-sm);
		height: var(--text-sm);
	}

	.button[data-size="xs"] :global(svg),
	.button[data-size="icon-xs"] :global(svg) {
		width: var(--text-xs);
		height: var(--text-xs);
	}

	/* Bare icon buttons let the icon fill the square box */
	.button[data-variant="bare"][data-size^="icon-"] :global(svg) {
		width: 100%;
		height: 100%;
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius; must stay after the size rules */
	.button[data-rounded="xs"] {
		border-radius: var(--radius-xs);
	}

	.button[data-rounded="sm"] {
		border-radius: var(--radius-sm);
	}

	.button[data-rounded="md"] {
		border-radius: var(--radius-md);
	}

	.button[data-rounded="lg"] {
		border-radius: var(--radius-lg);
	}

	.button[data-rounded="xl"] {
		border-radius: var(--radius-xl);
	}

	.button[data-rounded="2xl"] {
		border-radius: var(--radius-2xl);
	}

	.button[data-rounded="3xl"] {
		border-radius: var(--radius-3xl);
	}

	.button[data-rounded="4xl"] {
		border-radius: var(--radius-4xl);
	}

	.button[data-rounded="pill"] {
		border-radius: var(--radius-pill);
	}
</style>
