<script lang="ts">
	import { useGroupCtx } from "./ctx.svelte.js";
	import type { LabelProps } from "./index.js";
	const { inset = false, children, class: className, ...props }: LabelProps = $props();
	const groupCtx = useGroupCtx();
</script>

<!-- Group heading; its id names the surrounding DropdownMenuGroup. -->
<div class={["dropdownMenuLabel", className]} id={groupCtx?.labelId} data-inset={inset || undefined} {...props}>
	{@render children()}
</div>

<style>
	/* Base label; muted and smaller than the items, with the same padding */
	.dropdownMenuLabel {
		padding: var(--menu-item-padding) var(--menu-item-padding-inline);
		color: var(--muted-foreground);
		font-weight: 500;
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* Lines up with checkbox and radio item text */
	.dropdownMenuLabel[data-inset] {
		padding-left: calc(var(--menu-item-padding-inline) + var(--menu-icon) + var(--menu-item-gap));
	}
</style>
