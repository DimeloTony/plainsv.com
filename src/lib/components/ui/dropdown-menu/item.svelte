<script lang="ts">
	import MenuItem from "./menu-item.svelte";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { ItemProps } from "./index.js";
	const { disabled = false, variant = "default", inset = false, closeOnSelect = true, onSelect, children, class: className, ...props }: ItemProps = $props();
	const ctx = useCompCtx();

	/** Runs the item's action, then closes the menu unless the item keeps it open. */
	const handleSelect = () => {
		onSelect?.();
		if (closeOnSelect) ctx.close();
	};
</script>

<!-- Item that runs an action. -->
<MenuItem class={className} role="menuitem" {disabled} {variant} {inset} onSelect={handleSelect} {...props}>
	{@render children()}
</MenuItem>
