<script lang="ts">
	import type { LabelProps } from "./index.js";
	const { children, class: className, ...props }: LabelProps = $props();
</script>

<!-- Label for the control; wrapping a whole field turns it into a selectable card. -->
<label class={["fieldLabel", className]} {...props}>
	{@render children()}
</label>

<style>
	/* Base label */
	.fieldLabel {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		width: fit-content;
		font-weight: 500;
		line-height: 1.375;
		user-select: none;
	}

	/* A label that wraps a field is a bordered card that fills the row */
	.fieldLabel:has(> :global(.field)) {
		flex-direction: column;
		align-items: stretch;
		transition-duration: 150ms;
		transition-property: border-color, background-color;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		width: 100%;
	}

	.fieldLabel > :global(.field) {
		padding: var(--spacing-lg);
	}

	/* =============== States =============== */

	/* The card highlights while its checkbox, radio, or switch is checked */
	.fieldLabel:has(> :global(.field)):has(:global([aria-checked="true"])) {
		border-color: var(--primary);
		background-color: color-mix(in oklab, var(--primary) 5%, transparent);
	}

	:global(.dark) .fieldLabel:has(> :global(.field)):has(:global([aria-checked="true"])) {
		background-color: color-mix(in oklab, var(--primary) 10%, transparent);
	}

	/* Disabled state from the control inside */
	.fieldLabel:has(:global(:disabled)) {
		opacity: 50%;
		cursor: not-allowed;
	}
</style>
