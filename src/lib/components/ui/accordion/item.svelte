<script lang="ts">
	import { useCompCtx, setItemCtx } from "./ctx.svelte.js";
	import type { ItemProps } from "./index.js";
	import type { ItemCtxProps } from "./ctx.svelte.js";
	const { value, disabled = false, children, class: className, ...props }: ItemProps = $props();
	const ctx = useCompCtx();
	const itemData: ItemCtxProps = $derived({ value, disabled: disabled || ctx.disabled });
	const itemCtx = setItemCtx(itemData);

	const isOpen = $derived(ctx.isOpen(value));

	// Keep the item settings in sync when the props or the accordion's disabled state change.
	$effect.pre(() => void Object.assign(itemCtx, itemData));
</script>

<!-- Section with a trigger and its content, divided from the next item by a border. -->
<div class={["accordionItem", className]} data-state={isOpen ? "open" : "closed"} data-disabled={itemCtx.disabled || undefined} {...props}>
	{@render children()}
</div>

<style>
	/* Base item; a border divides it from the next item */
	.accordionItem {
		border-bottom: 1px solid var(--border);
	}

	.accordionItem:last-child {
		border-bottom: none;
	}
</style>
