<script lang="ts">
	import type { ActionProps } from "./index.js";
	const { children, class: className, ...props }: ActionProps = $props();
</script>

<!-- Trailing content placed in the alert's last column. -->
<div class={["alertAction", className]} {...props}>
	{@render children()}
</div>

<style>
	/* Base action */
	.alertAction {
		display: flex;
		grid-row: 1;
		grid-column: -2;
		align-items: center;
		align-self: center;
		justify-self: end;
		gap: var(--spacing-xs);
	}
</style>
