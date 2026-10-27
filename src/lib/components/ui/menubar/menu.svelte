<script lang="ts">
	import { DropdownMenu } from "#lib/components/ui/dropdown-menu/index.js";
	import { useCompCtx, setMenuCtx } from "./ctx.svelte.js";
	import type { MenuProps } from "./index.js";
	const { value, children }: MenuProps = $props();
	const ctx = useCompCtx();
	const generatedValue = $props.id();
	const menuValue = $derived(value ?? generatedValue);
	setMenuCtx(() => menuValue);
</script>

<!-- A dropdown menu whose open state is the bar's active menu, so opening one closes the others. -->
<DropdownMenu bind:open={() => ctx.activeValue === menuValue, (open) => ctx.setActive(menuValue, open)} side="bottom" align="start" sideOffset={8} size={ctx.size} rounded={ctx.rounded}>
	{@render children()}
</DropdownMenu>
