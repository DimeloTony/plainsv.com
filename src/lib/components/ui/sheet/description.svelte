<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	import type { DescriptionProps } from "./index.js";
	const { children, class: className, ...props }: DescriptionProps = $props();
	const ctx = useCompCtx();
</script>

<!-- Muted supporting text; its id describes the sheet. -->
<p class={["sheetDescription", className]} id="{ctx.id}-description" {...props}>
	{@render children()}
</p>

<style>
	/* Base description */
	.sheetDescription {
		margin: 0;
		color: var(--muted-foreground);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}
</style>
