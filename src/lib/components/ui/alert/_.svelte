<script lang="ts">
	import type { Props } from "./index.js";
	const { children, variant = "default", size = "lg", rounded, class: className, ...props }: Props = $props();
</script>

<!-- Callout with an optional leading icon, a title, a description, and a trailing action. -->
<div class={["alert not-typeset", className]} role="alert" data-variant={variant} data-size={size} data-rounded={rounded} {...props}>
	{@render children()}
</div>

<style>
	/* Base alert; grid lets the icon and action sit beside both the title and description without a wrapper */
	.alert {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		row-gap: calc(var(--spacing-xs) / 2); /* 2px */
		align-items: start;
		box-sizing: border-box;
		border: 1px solid var(--border);
		width: 100%;
	}

	/* Adds a leading icon column when the alert starts with an icon */
	.alert:has(> :global(svg)) {
		grid-template-columns: var(--alert-icon) minmax(0, 1fr);
	}

	/* Adds a trailing column when the alert holds an action */
	.alert:has(> :global(.alertAction)) {
		grid-template-columns: minmax(0, 1fr) auto;
	}

	.alert:has(> :global(svg)):has(> :global(.alertAction)) {
		grid-template-columns: var(--alert-icon) minmax(0, 1fr) auto;
	}

	/* Leading icon sits in the first column, nudged to the title's baseline */
	.alert > :global(svg) {
		grid-row: 1;
		grid-column: 1;
		flex-shrink: 0;
		transform: translateY(0.125rem); /* 2px */
		width: var(--alert-icon);
		height: var(--alert-icon);
		color: currentColor;
	}

	/* Title and description follow the icon column when there is one */
	.alert > :global(:not(svg, .alertAction)) {
		grid-column: 1;
	}

	.alert:has(> :global(svg)) > :global(:not(svg, .alertAction)) {
		grid-column: 2;
	}

	/* The action spans both rows when a description is present */
	.alert:has(> :global(.alertDescription)) > :global(.alertAction) {
		grid-row: 1 / span 2;
	}

	/* =============== Variants =============== */

	.alert[data-variant="default"] {
		background-color: var(--card);
		color: var(--card-foreground);
	}

	.alert[data-variant="destructive"] {
		background-color: var(--card);
		color: var(--destructive);
	}

	/* Destructive descriptions use a softer tint of the destructive color */
	.alert[data-variant="destructive"] > :global(.alertDescription) {
		color: color-mix(in oklab, var(--destructive) 90%, transparent);
	}

	/* =============== Sizes =============== */

	/* Large — default */
	.alert[data-size="lg"] {
		--alert-icon: 1rem; /* 16px */
		column-gap: var(--spacing-md);
		border-radius: var(--radius-lg);
		padding: var(--spacing-md);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Medium */
	.alert[data-size="md"] {
		--alert-icon: 1rem; /* 16px */
		column-gap: var(--spacing-sm);
		border-radius: var(--radius-md);
		padding: var(--spacing-sm) var(--spacing-md);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Small */
	.alert[data-size="sm"] {
		--alert-icon: 1rem; /* 16px */
		column-gap: var(--spacing-sm);
		border-radius: var(--radius-sm);
		padding: var(--spacing-sm);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Extra small */
	.alert[data-size="xs"] {
		--alert-icon: var(--text-xs);
		column-gap: var(--spacing-sm);
		border-radius: var(--radius-xs);
		padding: var(--spacing-xs) var(--spacing-sm);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius; must stay after the size rules */
	.alert[data-rounded="xs"] {
		border-radius: var(--radius-xs);
	}

	.alert[data-rounded="sm"] {
		border-radius: var(--radius-sm);
	}

	.alert[data-rounded="md"] {
		border-radius: var(--radius-md);
	}

	.alert[data-rounded="lg"] {
		border-radius: var(--radius-lg);
	}

	.alert[data-rounded="xl"] {
		border-radius: var(--radius-xl);
	}

	.alert[data-rounded="2xl"] {
		border-radius: var(--radius-2xl);
	}

	.alert[data-rounded="3xl"] {
		border-radius: var(--radius-3xl);
	}

	.alert[data-rounded="4xl"] {
		border-radius: var(--radius-4xl);
	}

	/* A true pill; tall content can clip at the corners, so use 3xl or 4xl to stay safe */
	.alert[data-rounded="pill"] {
		border-radius: var(--radius-pill);
	}
</style>
