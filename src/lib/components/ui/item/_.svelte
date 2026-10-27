<script lang="ts">
	import { getContext } from "svelte";
	import type { Props } from "./index.js";
	const { variant = "default", size = "md", rounded, href, children, class: className, ...props }: Props = $props();
	// Items inside an `ItemGroup` are announced as list items.
	const isInGroup = getContext<boolean | undefined>("item-group") ?? false;
	const isLink = $derived(href !== undefined);
</script>

<!-- Render a link when `href` is set; link items get a hover fill. -->
<svelte:element this={isLink ? "a" : "div"} class={["item not-typeset", className]} role={isInGroup ? "listitem" : undefined} data-variant={variant} data-size={size} data-rounded={rounded} data-link={isLink || undefined} {href} {...props}>
	{@render children()}
</svelte:element>

<style>
	/* Base item; wraps so a header or footer can take a full row */
	.item {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		transition-duration: 150ms;
		transition-property: color, background-color, border-color, box-shadow;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		box-sizing: border-box;
		outline: none;
		border: 1px solid transparent;
		color: var(--foreground);
		text-decoration: none;
	}

	.item[data-link]:hover {
		background-color: color-mix(in oklab, var(--accent) 50%, transparent);
	}

	/* =============== Variants =============== */

	.item[data-variant="outline"] {
		border-color: var(--border);
	}

	.item[data-variant="muted"] {
		background-color: color-mix(in oklab, var(--muted) 50%, transparent);
	}

	/* =============== States =============== */

	/* Keyboard focus ring on link items */
	.item:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
		border-color: var(--ring);
	}

	/* =============== Sizes =============== */

	/* Large */
	.item[data-size="lg"] {
		gap: var(--spacing-lg);
		border-radius: var(--radius-lg);
		padding: var(--spacing-lg) var(--spacing-xl);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Medium — default */
	.item[data-size="md"] {
		gap: var(--spacing-lg);
		border-radius: var(--radius-md);
		padding: var(--spacing-lg);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Small */
	.item[data-size="sm"] {
		gap: calc(var(--spacing-xs) * 2.5); /* 10px */
		border-radius: var(--radius-sm);
		padding: var(--spacing-md) var(--spacing-lg);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Extra small */
	.item[data-size="xs"] {
		gap: var(--spacing-sm);
		border-radius: var(--radius-xs);
		padding: var(--spacing-sm) var(--spacing-md);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius; must stay after the size rules */
	.item[data-rounded="xs"] {
		border-radius: var(--radius-xs);
	}

	.item[data-rounded="sm"] {
		border-radius: var(--radius-sm);
	}

	.item[data-rounded="md"] {
		border-radius: var(--radius-md);
	}

	.item[data-rounded="lg"] {
		border-radius: var(--radius-lg);
	}

	.item[data-rounded="xl"] {
		border-radius: var(--radius-xl);
	}

	.item[data-rounded="2xl"] {
		border-radius: var(--radius-2xl);
	}

	.item[data-rounded="3xl"] {
		border-radius: var(--radius-3xl);
	}

	.item[data-rounded="4xl"] {
		border-radius: var(--radius-4xl);
	}

	/* A true pill; tall content can clip at the corners, so use 3xl or 4xl to stay safe */
	.item[data-rounded="pill"] {
		border-radius: var(--radius-pill);
	}
</style>
