<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	import type { TitleProps } from "./index.js";
	const { children, class: className, ...props }: TitleProps = $props();
	const ctx = useCompCtx();
</script>

<!-- Sheet heading; its id labels the sheet. -->
<h2 class={["sheetTitle", className]} id="{ctx.id}-title" {...props}>
	{@render children()}
</h2>

<style>
	/* Base title */
	.sheetTitle {
		margin: 0;
		color: var(--foreground);
		font-weight: 600;
		font-size: var(--text-md);
		line-height: var(--line-height-md);
	}
</style>
