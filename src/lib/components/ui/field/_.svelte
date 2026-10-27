<script lang="ts">
	import type { Props } from "./index.js";
	const { orientation = "vertical", invalid = false, disabled = false, children, class: className, ...props }: Props = $props();
</script>

<!-- One control with its label, description, and error. -->
<div class={["field not-typeset", className]} role="group" data-orientation={orientation} data-invalid={invalid || undefined} data-disabled={disabled || undefined} {...props}>
	{@render children()}
</div>

<style>
	/* Base field; the label sits above the control */
	.field {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
		width: 100%;
		color: var(--foreground);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* The control sits beside its label, such as a checkbox or switch */
	.field[data-orientation="horizontal"] {
		flex-direction: row;
		align-items: center;
	}

	/* With a description, the control lines up with the first line of the label */
	.field[data-orientation="horizontal"]:has(> :global(.fieldContent)) {
		align-items: flex-start;
	}

	/* Responsive fields switch to a row once the field group is 28rem wide */
	@container fieldGroup (min-width: 28rem) {
		.field[data-orientation="responsive"] {
			flex-direction: row;
			align-items: center;
		}

		.field[data-orientation="responsive"] > :global(*) {
			flex: 1;
		}
	}

	/* =============== States =============== */

	/* Invalid labels and titles turn destructive */
	.field[data-invalid] {
		color: var(--destructive);
	}

	/* Disabled labels and descriptions dim */
	.field[data-disabled] :global(.fieldLabel),
	.field[data-disabled] :global(.fieldDescription) {
		opacity: 50%;
	}
</style>
