<script lang="ts">
	import type { TitleProps } from "./index.js";
	const { children, class: className, ...props }: TitleProps = $props();
</script>

<!-- Item heading. -->
<div class={["itemTitle", className]} {...props}>
	{@render children()}
</div>

<style>
	/* Base title */
	.itemTitle {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		width: fit-content;
		font-weight: 500;
	}
</style>
