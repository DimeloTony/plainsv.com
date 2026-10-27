<script lang="ts">
	import { DropdownMenu } from "#lib/components/ui/dropdown-menu/index.js";
	import type { Props } from "./index.js";
	let { open = $bindable(false), onOpenChange, size = "md", rounded, children }: Props = $props();
</script>

<!-- A dropdown menu whose top-left corner opens at the pointer; it flips when there is not enough room. -->
<DropdownMenu bind:open {onOpenChange} side="bottom" align="start" sideOffset={2} {size} {rounded}>
	{@render children()}
</DropdownMenu>
