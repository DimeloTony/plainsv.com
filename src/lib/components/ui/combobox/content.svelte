<script lang="ts">
	import { Command } from "#lib/components/ui/command/index.js";
	import { PopoverContent } from "#lib/components/ui/popover/index.js";
	import { useCompCtx as usePopoverCtx } from "#lib/components/ui/popover/ctx.svelte.js";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { ContentProps } from "./index.js";
	const { size, rounded, children, class: className, style, ...props }: ContentProps = $props();
	const ctx = useCompCtx();
	const popoverCtx = usePopoverCtx();
	// Measured each time the popover opens, since the content mounts on open.
	const triggerWidth = $derived(popoverCtx.triggerEl?.offsetWidth ?? 0);
</script>

<!-- Popover as wide as the trigger, holding a command that starts on the selected item. -->
<PopoverContent class={["comboboxContent", className]} style="--combobox-trigger-width: {triggerWidth}px; {style ?? ''}" {size} {rounded} {...props}>
	<Command class="comboboxCommand" value={ctx.value} size={size ?? ctx.size} rounded={rounded ?? ctx.rounded}>
		{@render children()}
	</Command>
</PopoverContent>

<style>
	/* Lets the command fill the popover edge to edge, at least as wide as the trigger; the extra attributes outrank the popover's size rules */
	:global(.popoverContent.comboboxContent[data-size][data-side]) {
		padding: 0;
		width: max(var(--combobox-trigger-width), 12.5rem); /* 200px minimum */
	}

	/* The popover already draws the border and radius */
	:global(.command.comboboxCommand[data-size]) {
		border: 0;
		border-radius: 0;
	}
</style>
