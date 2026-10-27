<script lang="ts">
	import type { GroupProps } from "./index.js";
	const { children, class: className, ...props }: GroupProps = $props();
</script>

<!-- Stack of fields; responsive fields switch layout based on its width. -->
<div class={["fieldGroup not-typeset", className]} {...props}>
	{@render children()}
</div>

<style>
	/* Base group; a named container so responsive fields measure it instead of the viewport */
	.fieldGroup {
		display: flex;
		flex-direction: column;
		gap: calc(var(--spacing-xl) + var(--spacing-xs)); /* 28px */
		container: fieldGroup / inline-size;
		width: 100%;
	}

	/* Nested groups, such as a list of checkboxes, sit closer */
	.fieldGroup :global(.fieldGroup) {
		gap: var(--spacing-md);
	}
</style>
