<script lang="ts">
	import type { Props } from "./index.js";
	let { value = $bindable(), size = "md", rounded, class: className, ...props }: Props = $props();
</script>

<!-- Multi-line field; grows with its content where `field-sizing` is supported. -->
<textarea class={["textarea not-typeset", className]} data-size={size} data-rounded={rounded} bind:value {...props}></textarea>

<style>
	/* Base textarea */
	.textarea {
		display: flex;
		transition-duration: 150ms;
		transition-property: color, border-color, box-shadow, opacity;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		box-sizing: border-box;
		outline: none;
		box-shadow: 0 1px 2px 0 color-mix(in oklab, var(--foreground) 5%, transparent);
		border: 1px solid var(--input);
		background-color: transparent;
		width: 100%;
		min-width: 0;
		field-sizing: content;
		resize: vertical;
		color: var(--foreground);
		font: inherit;
	}

	:global(.dark) .textarea {
		background-color: color-mix(in oklab, var(--input) 30%, transparent);
	}

	.textarea::placeholder {
		color: var(--muted-foreground);
	}

	.textarea::selection {
		background-color: var(--primary);
		color: var(--primary-foreground);
	}

	/* =============== States =============== */

	/* Keyboard and pointer focus ring */
	.textarea:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
		border-color: var(--ring);
	}

	/* Invalid state from aria-invalid */
	.textarea[aria-invalid="true"] {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--destructive) 20%, transparent);
		border-color: var(--destructive);
	}

	:global(.dark) .textarea[aria-invalid="true"] {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--destructive) 40%, transparent);
	}

	/* Disabled state */
	.textarea:disabled {
		opacity: 50%;
		cursor: not-allowed;
		pointer-events: none;
	}

	/* =============== Sizes =============== */

	/* Large */
	.textarea[data-size="lg"] {
		border-radius: var(--radius-lg);
		padding: var(--spacing-sm) var(--spacing-md);
		min-height: 4.5rem; /* 72px */
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Medium — default */
	.textarea[data-size="md"] {
		border-radius: var(--radius-md);
		padding: var(--spacing-sm) var(--spacing-md);
		min-height: 4rem; /* 64px */
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Small */
	.textarea[data-size="sm"] {
		border-radius: var(--radius-sm);
		padding: calc(var(--spacing-xs) * 1.5) var(--spacing-sm); /* 6px block */
		min-height: 3.5rem; /* 56px */
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Extra small */
	.textarea[data-size="xs"] {
		border-radius: var(--radius-xs);
		padding: var(--spacing-xs);
		min-height: 3rem; /* 48px */
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius; must stay after the size rules */
	.textarea[data-rounded="xs"] {
		border-radius: var(--radius-xs);
	}

	.textarea[data-rounded="sm"] {
		border-radius: var(--radius-sm);
	}

	.textarea[data-rounded="md"] {
		border-radius: var(--radius-md);
	}

	.textarea[data-rounded="lg"] {
		border-radius: var(--radius-lg);
	}

	.textarea[data-rounded="xl"] {
		border-radius: var(--radius-xl);
	}

	.textarea[data-rounded="2xl"] {
		border-radius: var(--radius-2xl);
	}

	.textarea[data-rounded="3xl"] {
		border-radius: var(--radius-3xl);
	}

	.textarea[data-rounded="4xl"] {
		border-radius: var(--radius-4xl);
	}

	/* A true pill; tall content can clip at the corners, so use 3xl or 4xl to stay safe */
	.textarea[data-rounded="pill"] {
		border-radius: var(--radius-pill);
	}
</style>
