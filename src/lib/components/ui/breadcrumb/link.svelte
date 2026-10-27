<script lang="ts">
	import type { LinkProps } from "./index.js";
	const { children, class: className, ...props }: LinkProps = $props();
</script>

<!-- Link to an earlier page; SvelteKit handles it as client-side navigation. -->
<a class={["breadcrumbLink", className]} {...props}>
	{@render children()}
</a>

<style>
	/* Base link; muted until hovered */
	.breadcrumbLink {
		display: inline-flex;
		align-items: center;
		gap: var(--spacing-xs);
		transition-duration: 150ms;
		transition-property: color, box-shadow;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		outline: none;
		border-radius: var(--radius-xs);
		color: inherit;
		text-decoration: none;
	}

	.breadcrumbLink:hover {
		color: var(--foreground);
	}

	.breadcrumbLink :global(svg) {
		flex-shrink: 0;
		width: var(--breadcrumb-icon);
		height: var(--breadcrumb-icon);
	}

	/* =============== States =============== */

	/* Keyboard focus ring */
	.breadcrumbLink:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
	}
</style>
