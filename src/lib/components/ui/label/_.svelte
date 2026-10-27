<script lang="ts">
	import type { Props } from "./index.js";
	const { children, size = "md", class: className, ...props }: Props = $props();
</script>

<!-- Caption for a form control; link it with `for` or wrap the control. -->
<label class={["label not-typeset", className]} data-size={size} {...props}>
	{@render children()}
</label>

<style>
	/* Base label */
	.label {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		color: var(--foreground);
		font-weight: 500;
		line-height: 1;
		user-select: none;
	}

	/* Default icon size */
	.label :global(svg) {
		flex-shrink: 0;
		width: 1em;
		height: 1em;
	}

	/* =============== States =============== */

	/* Dims when it wraps a disabled control, follows one, or sits in a disabled group */
	.label:has(:global(:disabled)),
	:global(:disabled) ~ .label,
	:global([data-disabled="true"]) .label {
		opacity: 50%;
		cursor: not-allowed;
	}

	/* =============== Sizes =============== */

	/* Large, medium, and small */
	.label[data-size="lg"],
	.label[data-size="md"],
	.label[data-size="sm"] {
		font-size: var(--text-sm);
	}

	/* Extra small */
	.label[data-size="xs"] {
		gap: var(--spacing-xs);
		font-size: var(--text-xs);
	}
</style>
