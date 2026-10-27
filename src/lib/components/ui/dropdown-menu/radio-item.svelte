<script lang="ts">
	import { CircleIcon } from "@lucide/svelte";
	import MenuItem from "./menu-item.svelte";
	import { useCompCtx, useRadioGroupCtx } from "./ctx.svelte.js";
	import type { RadioItemProps } from "./index.js";
	const { value, disabled = false, closeOnSelect = false, children, class: className, ...props }: RadioItemProps = $props();
	const ctx = useCompCtx();
	const radioGroup = useRadioGroupCtx();

	const isChecked = $derived(radioGroup.value === value);

	/** Checks the item in its group, then closes the menu if the item asks to. */
	const handleSelect = () => {
		radioGroup.select(value);
		if (closeOnSelect) ctx.close();
	};
</script>

<!-- Radio item with a dot while checked. -->
<MenuItem class={className} role="menuitemradio" aria-checked={isChecked} data-state={isChecked ? "checked" : "unchecked"} {disabled} onSelect={handleSelect} {...props}>
	{#snippet indicator()}
		{#if isChecked}
			<CircleIcon />
		{/if}
	{/snippet}
	{@render children()}
</MenuItem>
