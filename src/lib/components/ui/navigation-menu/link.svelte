<script lang="ts">
	import { useCompCtx, useContentCtx } from "./ctx.svelte.js";
	import type { LinkProps } from "./index.js";
	const { active = false, variant, size, rounded, onclick, children, class: className, ...props }: LinkProps = $props();
	const ctx = useCompCtx();
	const isInContent = useContentCtx();

	/** Closes the menu after a link inside the content is followed. */
	const handleClick = (e: MouseEvent & { currentTarget: EventTarget & HTMLAnchorElement }) => {
		onclick?.(e);
		// If the link sits in the content and the click was not cancelled: close the menu.
		if (isInContent && !e.defaultPrevented) ctx.close();
	};
</script>

<!-- Link styled as a trigger at the top level, or as a padded row inside content; its own size and radius override the menu's. -->
<a class={["navigationMenuLink", className]} aria-current={active ? "page" : undefined} data-active={active || undefined} data-navigation-menu-top={!isInContent || undefined} data-variant={isInContent ? undefined : (variant ?? ctx.variant)} data-size={size} data-rounded={rounded} onclick={handleClick} {...props}>
	{@render children()}
</a>

<style>
	/* Base link; a padded row that stacks a title and description */
	.navigationMenuLink {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
		transition-duration: 150ms;
		transition-property: color, background-color, box-shadow;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		outline: none;
		border-radius: var(--navigation-menu-inner-radius);
		padding: var(--navigation-menu-link-padding);
		color: inherit;
		text-decoration: none;
	}

	/* Default icon size */
	.navigationMenuLink :global(svg) {
		flex-shrink: 0;
		width: 1rem; /* 16px */
		height: 1rem; /* 16px */
		color: var(--muted-foreground);
	}

	/* Top-level link matches the triggers */
	.navigationMenuLink[data-navigation-menu-top] {
		flex-direction: row;
		align-items: center;
		box-sizing: border-box;
		border-radius: var(--navigation-menu-trigger-radius);
		padding: 0 var(--navigation-menu-padding-inline);
		height: var(--navigation-menu-height);
		font-weight: 500;
		white-space: nowrap;
	}

	/* =============== Variants =============== */

	/* Top-level links only; rows inside content keep the panel style */

	/* Bordered link on the page background */
	.navigationMenuLink[data-variant="outline"] {
		border: 1px solid var(--border);
		background-color: var(--background);
	}

	:global(.dark) .navigationMenuLink[data-variant="outline"] {
		border-color: var(--input);
		background-color: color-mix(in oklab, var(--input) 30%, transparent);
	}

	:global(.dark) .navigationMenuLink[data-variant="outline"]:hover,
	:global(.dark) .navigationMenuLink[data-variant="outline"]:focus {
		background-color: var(--accent);
	}

	/* Filled secondary link */
	.navigationMenuLink[data-variant="secondary"] {
		background-color: var(--secondary);
		color: var(--secondary-foreground);
	}

	.navigationMenuLink[data-variant="secondary"]:hover,
	.navigationMenuLink[data-variant="secondary"]:focus {
		background-color: color-mix(in oklab, var(--secondary) 80%, transparent);
		color: var(--secondary-foreground);
	}

	/* Lighter hover and focus fill */
	.navigationMenuLink[data-variant="ghost"]:hover,
	.navigationMenuLink[data-variant="ghost"]:focus {
		background-color: color-mix(in oklab, var(--accent) 50%, transparent);
	}

	/* =============== States =============== */

	.navigationMenuLink:hover,
	.navigationMenuLink:focus {
		background-color: var(--accent);
		color: var(--accent-foreground);
	}

	/* Current page */
	.navigationMenuLink[data-active] {
		background-color: color-mix(in oklab, var(--accent) 50%, transparent);
	}

	/* Keyboard focus ring */
	.navigationMenuLink:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
	}

	/* =============== Sizes =============== */

	/* Overrides the menu size for this link only; rows inside content change their padding and text */

	/* Large */
	.navigationMenuLink[data-size="lg"] {
		padding: var(--spacing-md);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	.navigationMenuLink[data-navigation-menu-top][data-size="lg"] {
		padding: 0 var(--spacing-xl);
		height: var(--control-height-lg);
	}

	/* Medium */
	.navigationMenuLink[data-size="md"] {
		padding: var(--spacing-sm);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	.navigationMenuLink[data-navigation-menu-top][data-size="md"] {
		padding: 0 var(--spacing-lg);
		height: var(--control-height-md);
	}

	/* Small */
	.navigationMenuLink[data-size="sm"] {
		padding: calc(var(--spacing-xs) * 1.5); /* 6px */
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	.navigationMenuLink[data-navigation-menu-top][data-size="sm"] {
		padding: 0 var(--spacing-md);
		height: var(--control-height-sm);
	}

	/* Extra small */
	.navigationMenuLink[data-size="xs"] {
		padding: var(--spacing-xs);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	.navigationMenuLink[data-navigation-menu-top][data-size="xs"] {
		padding: 0 var(--spacing-sm);
		height: var(--control-height-xs);
	}

	/* =============== Rounded =============== */

	/* Overrides the inherited radius with this exact value; must stay after the size rules */
	.navigationMenuLink[data-rounded="xs"] {
		border-radius: var(--radius-xs);
	}

	.navigationMenuLink[data-rounded="sm"] {
		border-radius: var(--radius-sm);
	}

	.navigationMenuLink[data-rounded="md"] {
		border-radius: var(--radius-md);
	}

	.navigationMenuLink[data-rounded="lg"] {
		border-radius: var(--radius-lg);
	}

	.navigationMenuLink[data-rounded="xl"] {
		border-radius: var(--radius-xl);
	}

	.navigationMenuLink[data-rounded="2xl"] {
		border-radius: var(--radius-2xl);
	}

	.navigationMenuLink[data-rounded="3xl"] {
		border-radius: var(--radius-3xl);
	}

	.navigationMenuLink[data-rounded="4xl"] {
		border-radius: var(--radius-4xl);
	}

	.navigationMenuLink[data-rounded="pill"] {
		border-radius: var(--radius-pill);
	}
</style>
