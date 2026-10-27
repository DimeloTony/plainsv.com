<script lang="ts">
	import type { Props } from "./index.js";
	const { children, variant = "default", size = "md", rounded, href, class: className, ...props }: Props = $props();
	const isLink = $derived(href !== undefined);
</script>

<!-- Render a link when `href` is set; link badges get hover styles. -->
<svelte:element this={isLink ? "a" : "span"} class={["badge not-typeset", className]} data-variant={variant} data-size={size} data-rounded={rounded} data-link={isLink || undefined} {href} {...props}>
	{@render children()}
</svelte:element>

<style>
	/* Base badge */
	.badge {
		display: inline-flex;
		flex-shrink: 0;
		justify-content: center;
		align-items: center;
		transition-duration: 150ms;
		transition-property: color, background-color, border-color, box-shadow;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		box-sizing: border-box;
		outline: none;
		border: 1px solid transparent;
		width: fit-content;
		overflow: hidden;
		font-weight: 500;
		text-decoration: none;
		white-space: nowrap;
	}

	.badge :global(svg) {
		flex-shrink: 0;
		pointer-events: none;
	}

	/* =============== Variants =============== */

	/* Default label */
	.badge[data-variant="default"] {
		background-color: var(--primary);
		color: var(--primary-foreground);
	}

	.badge[data-variant="default"][data-link]:hover {
		background-color: color-mix(in oklab, var(--primary) 90%, transparent);
	}

	/* Secondary label */
	.badge[data-variant="secondary"] {
		background-color: var(--secondary);
		color: var(--secondary-foreground);
	}

	.badge[data-variant="secondary"][data-link]:hover {
		background-color: color-mix(in oklab, var(--secondary) 90%, transparent);
	}

	/* Destructive label */
	.badge[data-variant="destructive"] {
		background-color: var(--destructive);
		color: var(--destructive-foreground);
	}

	.badge[data-variant="destructive"][data-link]:hover {
		background-color: color-mix(in oklab, var(--destructive) 90%, transparent);
	}

	:global(.dark) .badge[data-variant="destructive"] {
		background-color: color-mix(in oklab, var(--destructive) 60%, transparent);
	}

	/* Bordered label */
	.badge[data-variant="outline"] {
		border-color: var(--border);
		color: var(--foreground);
	}

	.badge[data-variant="outline"][data-link]:hover {
		background-color: var(--accent);
		color: var(--accent-foreground);
	}

	/* Label without a container until hovered */
	.badge[data-variant="ghost"] {
		color: var(--foreground);
	}

	.badge[data-variant="ghost"][data-link]:hover {
		background-color: var(--accent);
		color: var(--accent-foreground);
	}

	/* Text link label */
	.badge[data-variant="link"] {
		color: var(--primary);
		text-underline-offset: 0.25rem; /* 4px */
	}

	.badge[data-variant="link"][data-link]:hover {
		text-decoration: underline;
	}

	/* =============== States =============== */

	/* Keyboard focus ring on link badges; [data-variant] keeps it above the variant border colors */
	.badge[data-variant]:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
		border-color: var(--ring);
	}

	/* Invalid state from aria-invalid */
	.badge[data-variant][aria-invalid="true"] {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--destructive) 20%, transparent);
		border-color: var(--destructive);
	}

	:global(.dark) .badge[data-variant][aria-invalid="true"] {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--destructive) 40%, transparent);
	}

	/* =============== Sizes =============== */

	/* Large */
	.badge[data-size="lg"] {
		gap: var(--spacing-xs);
		border-radius: var(--radius-lg);
		padding: calc(var(--spacing-xs) / 2) var(--spacing-sm);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	.badge[data-size="lg"] :global(svg) {
		width: var(--text-sm);
		height: var(--text-sm);
	}

	/* Medium — default */
	.badge[data-size="md"] {
		gap: var(--spacing-xs);
		border-radius: var(--radius-md);
		padding: calc(var(--spacing-xs) / 2) var(--spacing-sm);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* Small */
	.badge[data-size="sm"] {
		gap: calc(var(--spacing-xs) / 2);
		border-radius: var(--radius-sm);
		padding: 0 calc(var(--spacing-xs) * 1.5); /* 6px inline */
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* Extra small */
	.badge[data-size="xs"] {
		gap: calc(var(--spacing-xs) / 2);
		border-radius: var(--radius-xs);
		padding: 0 var(--spacing-xs);
		font-size: var(--text-xs);
		line-height: calc(var(--line-height-xs) - 0.125rem); /* 14px */
	}

	.badge[data-size="md"] :global(svg),
	.badge[data-size="sm"] :global(svg),
	.badge[data-size="xs"] :global(svg) {
		width: var(--text-xs);
		height: var(--text-xs);
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius; must stay after the size rules */
	.badge[data-rounded="xs"] {
		border-radius: var(--radius-xs);
	}

	.badge[data-rounded="sm"] {
		border-radius: var(--radius-sm);
	}

	.badge[data-rounded="md"] {
		border-radius: var(--radius-md);
	}

	.badge[data-rounded="lg"] {
		border-radius: var(--radius-lg);
	}

	.badge[data-rounded="xl"] {
		border-radius: var(--radius-xl);
	}

	.badge[data-rounded="2xl"] {
		border-radius: var(--radius-2xl);
	}

	.badge[data-rounded="3xl"] {
		border-radius: var(--radius-3xl);
	}

	.badge[data-rounded="4xl"] {
		border-radius: var(--radius-4xl);
	}

	.badge[data-rounded="pill"] {
		border-radius: var(--radius-pill);
	}
</style>
