<script lang="ts">
	import { ChevronDownIcon } from "@lucide/svelte";
	import type { Props } from "./index.js";
	let { value = $bindable(), size = "md", rounded, children, class: className, ...props }: Props = $props();
</script>

<!-- Native select with the browser arrow replaced by a chevron; the native picker opens on click. -->
<div class={["nativeSelect not-typeset", className]} data-size={size} data-rounded={rounded}>
	<select class="nativeSelectControl" bind:value {...props}>
		{@render children()}
	</select>
	<ChevronDownIcon aria-hidden="true" />
</div>

<style>
	/* Wrapper that places the chevron over the select */
	.nativeSelect {
		display: inline-flex;
		position: relative;
		align-items: center;
		width: fit-content;
		min-width: 0;
	}

	/* Base select; styled like the input */
	.nativeSelectControl {
		appearance: none;
		transition-duration: 150ms;
		transition-property: color, border-color, box-shadow, opacity;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		cursor: pointer;
		box-sizing: border-box;
		outline: none;
		box-shadow: 0 1px 2px 0 color-mix(in oklab, var(--foreground) 5%, transparent);
		border: 1px solid var(--input);
		border-radius: inherit;
		background-color: transparent;
		width: 100%;
		min-width: 0;
		color: var(--foreground);
		font: inherit;
	}

	:global(.dark) .nativeSelectControl {
		background-color: color-mix(in oklab, var(--input) 30%, transparent);
	}

	/* The open list uses the popover colors in both themes */
	.nativeSelectControl :global(option),
	.nativeSelectControl :global(optgroup) {
		background-color: var(--popover);
		color: var(--popover-foreground);
	}

	/* Chevron in the end padding; clicks pass through to the select */
	.nativeSelect :global(svg) {
		position: absolute;
		right: var(--spacing-md);
		width: 1rem; /* 16px */
		height: 1rem; /* 16px */
		pointer-events: none;
		color: var(--muted-foreground);
	}

	/* =============== States =============== */

	/* Keyboard and pointer focus ring */
	.nativeSelectControl:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
		border-color: var(--ring);
	}

	/* Invalid state from aria-invalid */
	.nativeSelectControl[aria-invalid="true"] {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--destructive) 20%, transparent);
		border-color: var(--destructive);
	}

	:global(.dark) .nativeSelectControl[aria-invalid="true"] {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--destructive) 40%, transparent);
	}

	/* Disabled state */
	.nativeSelectControl:disabled {
		opacity: 50%;
		cursor: not-allowed;
	}

	/* =============== Sizes =============== */

	/* Large */
	.nativeSelect[data-size="lg"] {
		border-radius: var(--radius-lg);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	.nativeSelect[data-size="lg"] .nativeSelectControl {
		padding-right: calc(var(--spacing-md) * 2 + 1rem); /* room for the 16px chevron */
		padding-left: var(--spacing-md);
		height: var(--control-height-lg);
	}

	/* Medium — default */
	.nativeSelect[data-size="md"] {
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	.nativeSelect[data-size="md"] .nativeSelectControl {
		padding-right: calc(var(--spacing-md) * 2 + 1rem); /* room for the 16px chevron */
		padding-left: var(--spacing-md);
		height: var(--control-height-md);
	}

	/* Small */
	.nativeSelect[data-size="sm"] {
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	.nativeSelect[data-size="sm"] .nativeSelectControl {
		padding-right: calc(var(--spacing-sm) * 2 + var(--text-sm)); /* room for the chevron */
		padding-left: var(--spacing-sm);
		height: var(--control-height-sm);
	}

	.nativeSelect[data-size="sm"] :global(svg) {
		right: var(--spacing-sm);
		width: var(--text-sm);
		height: var(--text-sm);
	}

	/* Extra small */
	.nativeSelect[data-size="xs"] {
		border-radius: var(--radius-xs);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	.nativeSelect[data-size="xs"] .nativeSelectControl {
		padding-right: calc(var(--spacing-xs) * 2 + var(--text-xs)); /* room for the chevron */
		padding-left: var(--spacing-xs);
		height: var(--control-height-xs);
	}

	.nativeSelect[data-size="xs"] :global(svg) {
		right: var(--spacing-xs);
		width: var(--text-xs);
		height: var(--text-xs);
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius; the select inherits it from the wrapper. Must stay after the size rules */
	.nativeSelect[data-rounded="xs"] {
		border-radius: var(--radius-xs);
	}

	.nativeSelect[data-rounded="sm"] {
		border-radius: var(--radius-sm);
	}

	.nativeSelect[data-rounded="md"] {
		border-radius: var(--radius-md);
	}

	.nativeSelect[data-rounded="lg"] {
		border-radius: var(--radius-lg);
	}

	.nativeSelect[data-rounded="xl"] {
		border-radius: var(--radius-xl);
	}

	.nativeSelect[data-rounded="2xl"] {
		border-radius: var(--radius-2xl);
	}

	.nativeSelect[data-rounded="3xl"] {
		border-radius: var(--radius-3xl);
	}

	.nativeSelect[data-rounded="4xl"] {
		border-radius: var(--radius-4xl);
	}

	.nativeSelect[data-rounded="pill"] {
		border-radius: var(--radius-pill);
	}
</style>
