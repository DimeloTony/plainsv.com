<script lang="ts">
	import type { SetProps } from "./index.js";
	const { children, class: className, ...props }: SetProps = $props();
</script>

<!-- Related fields under one legend. -->
<fieldset class={["fieldSet not-typeset", className]} {...props}>
	{@render children()}
</fieldset>

<style>
	/* Base fieldset; resets the native border and padding */
	.fieldSet {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xl);
		margin: 0;
		border: 0;
		padding: 0;
		min-width: 0;
	}

	/* Checkbox and radio lists sit closer to their legend */
	.fieldSet:has(> :global(.radioGroup)),
	.fieldSet:has(> :global(.fieldGroup .checkbox)) {
		gap: var(--spacing-md);
	}
</style>
