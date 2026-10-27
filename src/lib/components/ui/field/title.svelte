<script lang="ts">
	import type { TitleProps } from "./index.js";
	const { children, class: className, ...props }: TitleProps = $props();
</script>

<!-- Title styled like the label. -->
<div class={["fieldTitle", className]} {...props}>
	{@render children()}
</div>

<style>
	/* Base title */
	.fieldTitle {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		width: fit-content;
		font-weight: 500;
		line-height: 1.375;
	}
</style>
