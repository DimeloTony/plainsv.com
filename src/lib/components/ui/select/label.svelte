<script lang="ts">
	import { useGroupCtx } from "./ctx.svelte.js";
	import type { LabelProps } from "./index.js";
	const { children, class: className, ...props }: LabelProps = $props();
	const groupCtx = useGroupCtx();
</script>

<!-- Group heading; its id names the surrounding SelectGroup. -->
<div class={["selectLabel", className]} id={groupCtx?.labelId} {...props}>
	{@render children()}
</div>

<style>
	/* Base label; muted and smaller than the items */
	.selectLabel {
		padding: var(--select-item-padding) var(--spacing-sm);
		color: var(--muted-foreground);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}
</style>
