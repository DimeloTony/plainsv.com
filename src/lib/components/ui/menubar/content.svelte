<script lang="ts">
	import { DropdownMenuContent } from "#lib/components/ui/dropdown-menu/index.js";
	import { useCompCtx, useMenuCtx } from "./ctx.svelte.js";
	import type { ContentProps } from "./index.js";
	const { children, onkeydown, ...props }: ContentProps = $props();
	const ctx = useCompCtx();
	const getValue = useMenuCtx();

	/** Moves to the menu beside this one with the left and right arrows. */
	const handleKeydown = (e: KeyboardEvent) => {
		onkeydown?.(e);
		// If a submenu or item already handled the key, such as the right arrow on a sub trigger: leave it alone.
		if (e.defaultPrevented) return;
		const steps: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };
		// If the key does not move between menus: let the menu handle it.
		if (!(e.key in steps)) return;
		e.preventDefault();
		ctx.moveToAdjacent(getValue(), steps[e.key], true);
	};
</script>

<!-- The dropdown menu panel; the left and right arrows switch to the neighboring menus. -->
<DropdownMenuContent onkeydown={handleKeydown} {...props}>
	{@render children()}
</DropdownMenuContent>
