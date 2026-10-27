<script lang="ts">
	import Menu from "./menu.svelte";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { ContentProps } from "./index.js";
	const { children, class: className, ...props }: ContentProps = $props();
	const ctx = useCompCtx();
</script>

<!-- Top-level menu, placed beside the trigger while open. -->
<Menu class={className} id={ctx.contentId} aria-labelledby={ctx.triggerId} open={ctx.open} anchor={ctx.triggerEl} side={ctx.side} align={ctx.align} sideOffset={ctx.sideOffset} initialFocus={ctx.initialFocus} onDismiss={() => ctx.setOpen(false)} {...props}>
	{@render children()}
</Menu>
