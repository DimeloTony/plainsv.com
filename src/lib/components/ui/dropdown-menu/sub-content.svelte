<script lang="ts">
	import Menu from "./menu.svelte";
	import { useSubCtx } from "./ctx.svelte.js";
	import type { Attachment } from "svelte/attachments";
	import type { SubContentProps } from "./index.js";
	const { children, class: className, ...props }: SubContentProps = $props();
	const sub = useSubCtx();
	// Gap in pixels past the sub trigger, which clears the parent menu's padding and border.
	const SIDE_OFFSET = 8;
	// Shift in pixels that lines the first item up with the sub trigger, past the padding and border.
	const ALIGN_OFFSET = -5;

	/** Keeps the submenu open once the pointer reaches it, even if it crossed another item on the way. */
	const keepOpenOnEnter: Attachment<HTMLElement> = (node) => {
		const keepOpen = () => sub.cancelClose();
		node.addEventListener("pointerenter", keepOpen);
		return () => node.removeEventListener("pointerenter", keepOpen);
	};

	/** Closes the submenu and returns focus to its sub trigger. */
	const closeToTrigger = () => {
		sub.setOpen(false);
		sub.triggerEl?.focus({ preventScroll: true });
	};
</script>

<!-- Submenu, placed beside its sub trigger while open. -->
<Menu class={className} id={sub.contentId} aria-labelledby={sub.triggerId} open={sub.open} anchor={sub.triggerEl} side="right" align="start" sideOffset={SIDE_OFFSET} alignOffset={ALIGN_OFFSET} initialFocus={sub.initialFocus} onDismiss={() => sub.setOpen(false)} onArrowLeft={closeToTrigger} {@attach keepOpenOnEnter} {...props}>
	{@render children()}
</Menu>
