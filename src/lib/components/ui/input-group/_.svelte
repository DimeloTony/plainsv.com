<script lang="ts">
	import type { Props } from "./index.js";
	const { size = "md", rounded, children, class: className, ...props }: Props = $props();
</script>

<!-- One bordered field around the control and its addons; sets the padding variables its parts read. -->
<div class={["inputGroup not-typeset", className]} role="group" data-size={size} data-rounded={rounded} {...props}>
	{@render children()}
</div>

<style>
	/* Base group; styled like the input */
	.inputGroup {
		display: flex;
		position: relative;
		align-items: center;
		transition-duration: 150ms;
		transition-property: border-color, box-shadow, opacity;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		box-sizing: border-box;
		box-shadow: 0 1px 2px 0 color-mix(in oklab, var(--foreground) 5%, transparent);
		border: 1px solid var(--input);
		width: 100%;
		min-width: 0;
		color: var(--foreground);
	}

	:global(.dark) .inputGroup {
		background-color: color-mix(in oklab, var(--input) 30%, transparent);
	}

	/* Addons above or below the control stack the group, and a textarea sets its own height */
	.inputGroup:has(> :global([data-align="block-start"])),
	.inputGroup:has(> :global([data-align="block-end"])) {
		flex-direction: column;
		align-items: stretch;
	}

	/* A start addon brings the input closer, since the addon already has padding */
	.inputGroup:has(> :global([data-align="inline-start"])) > :global([data-input-group-control]) {
		padding-left: var(--input-group-gap);
	}

	.inputGroup:has(> :global([data-align="inline-end"])) > :global([data-input-group-control]) {
		padding-right: var(--input-group-gap);
	}

	/* =============== States =============== */

	/* Focus ring around the whole group while the control has focus */
	.inputGroup:has(> :global([data-input-group-control]:focus-visible)) {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
		border-color: var(--ring);
	}

	/* Invalid state from aria-invalid on the control */
	.inputGroup:has(> :global([data-input-group-control][aria-invalid="true"])) {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--destructive) 20%, transparent);
		border-color: var(--destructive);
	}

	:global(.dark) .inputGroup:has(> :global([data-input-group-control][aria-invalid="true"])) {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--destructive) 40%, transparent);
	}

	/* Disabled state from the control */
	.inputGroup:has(> :global([data-input-group-control]:disabled)) {
		opacity: 50%;
	}

	/* =============== Sizes =============== */

	/* Large */
	.inputGroup[data-size="lg"] {
		--input-group-padding: var(--spacing-md);
		--input-group-gap: var(--spacing-sm);
		border-radius: var(--radius-lg);
		min-height: var(--control-height-lg);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Medium — default */
	.inputGroup[data-size="md"] {
		--input-group-padding: var(--spacing-md);
		--input-group-gap: var(--spacing-sm);
		border-radius: var(--radius-md);
		min-height: var(--control-height-md);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Small */
	.inputGroup[data-size="sm"] {
		--input-group-padding: var(--spacing-sm);
		--input-group-gap: calc(var(--spacing-xs) * 1.5); /* 6px */
		border-radius: var(--radius-sm);
		min-height: var(--control-height-sm);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Extra small */
	.inputGroup[data-size="xs"] {
		--input-group-padding: var(--spacing-xs);
		--input-group-gap: var(--spacing-xs);
		border-radius: var(--radius-xs);
		min-height: var(--control-height-xs);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius; must stay after the size rules */
	.inputGroup[data-rounded="xs"] {
		border-radius: var(--radius-xs);
	}

	.inputGroup[data-rounded="sm"] {
		border-radius: var(--radius-sm);
	}

	.inputGroup[data-rounded="md"] {
		border-radius: var(--radius-md);
	}

	.inputGroup[data-rounded="lg"] {
		border-radius: var(--radius-lg);
	}

	.inputGroup[data-rounded="xl"] {
		border-radius: var(--radius-xl);
	}

	.inputGroup[data-rounded="2xl"] {
		border-radius: var(--radius-2xl);
	}

	.inputGroup[data-rounded="3xl"] {
		border-radius: var(--radius-3xl);
	}

	.inputGroup[data-rounded="4xl"] {
		border-radius: var(--radius-4xl);
	}

	.inputGroup[data-rounded="pill"] {
		border-radius: var(--radius-pill);
	}
</style>
