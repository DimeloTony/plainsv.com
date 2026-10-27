<script lang="ts">
	import { CheckIcon } from "@lucide/svelte";
	import MenuItem from "./menu-item.svelte";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { CheckboxItemProps } from "./index.js";
	let { checked = $bindable(false), onCheckedChange, disabled = false, closeOnSelect = false, children, class: className, ...props }: CheckboxItemProps = $props();
	const ctx = useCompCtx();

	/** Toggles the item and reports the change, then closes the menu if the item asks to. */
	const handleSelect = () => {
		checked = !checked;
		onCheckedChange?.(checked);
		if (closeOnSelect) ctx.close();
	};
</script>

<!-- Checkbox item with a check mark while checked. -->
<MenuItem class={className} role="menuitemcheckbox" aria-checked={checked} data-state={checked ? "checked" : "unchecked"} {disabled} onSelect={handleSelect} {...props}>
	{#snippet indicator()}
		{#if checked}
			<CheckIcon />
		{/if}
	{/snippet}
	{@render children()}
</MenuItem>
