<script lang="ts">
	import type { Props } from "./index.js";
	let { value = $bindable(), files = $bindable(), type, size = "md", rounded, class: className, ...props }: Props = $props();
</script>

<!-- File inputs bind `files`; every other type binds `value`. -->
{#if type === "file"}
	<input type="file" class={["input not-typeset", className]} data-size={size} data-rounded={rounded} bind:files {...props} />
{:else}
	<input {type} class={["input not-typeset", className]} data-size={size} data-rounded={rounded} bind:value {...props} />
{/if}

<style>
	/* Base input */
	.input {
		display: flex;
		transition-duration: 150ms;
		transition-property: color, border-color, box-shadow, opacity;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		box-sizing: border-box;
		outline: none;
		box-shadow: 0 1px 2px 0 color-mix(in oklab, var(--foreground) 5%, transparent);
		border: 1px solid var(--input);
		background-color: transparent;
		padding-block: var(--spacing-xs);
		width: 100%;
		min-width: 0;
		color: var(--foreground);
		font: inherit;
	}

	:global(.dark) .input {
		background-color: color-mix(in oklab, var(--input) 30%, transparent);
	}

	.input::placeholder {
		color: var(--muted-foreground);
	}

	.input::selection {
		background-color: var(--primary);
		color: var(--primary-foreground);
	}

	/* File picker button inside file inputs */
	.input::file-selector-button {
		display: inline-flex;
		margin-inline-end: var(--spacing-sm);
		border: 0;
		background-color: transparent;
		padding: 0;
		height: 100%;
		color: var(--foreground);
		font: inherit;
		font-weight: 500;
	}

	/* =============== States =============== */

	/* Keyboard and pointer focus ring */
	.input:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
		border-color: var(--ring);
	}

	/* Invalid state from aria-invalid */
	.input[aria-invalid="true"] {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--destructive) 20%, transparent);
		border-color: var(--destructive);
	}

	:global(.dark) .input[aria-invalid="true"] {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--destructive) 40%, transparent);
	}

	/* Disabled state */
	.input:disabled {
		opacity: 50%;
		cursor: not-allowed;
		pointer-events: none;
	}

	/* =============== Sizes =============== */

	/* Large */
	.input[data-size="lg"] {
		border-radius: var(--radius-lg);
		padding-inline: var(--spacing-md);
		height: var(--control-height-lg);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Medium — default */
	.input[data-size="md"] {
		border-radius: var(--radius-md);
		padding-inline: var(--spacing-md);
		height: var(--control-height-md);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Small */
	.input[data-size="sm"] {
		border-radius: var(--radius-sm);
		padding-inline: var(--spacing-sm);
		height: var(--control-height-sm);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Extra small */
	.input[data-size="xs"] {
		border-radius: var(--radius-xs);
		padding-inline: var(--spacing-xs);
		height: var(--control-height-xs);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius; must stay after the size rules */
	.input[data-rounded="xs"] {
		border-radius: var(--radius-xs);
	}

	.input[data-rounded="sm"] {
		border-radius: var(--radius-sm);
	}

	.input[data-rounded="md"] {
		border-radius: var(--radius-md);
	}

	.input[data-rounded="lg"] {
		border-radius: var(--radius-lg);
	}

	.input[data-rounded="xl"] {
		border-radius: var(--radius-xl);
	}

	.input[data-rounded="2xl"] {
		border-radius: var(--radius-2xl);
	}

	.input[data-rounded="3xl"] {
		border-radius: var(--radius-3xl);
	}

	.input[data-rounded="4xl"] {
		border-radius: var(--radius-4xl);
	}

	.input[data-rounded="pill"] {
		border-radius: var(--radius-pill);
	}
</style>
