<script lang="ts">
	import { ChevronRightIcon } from "@lucide/svelte";
	import MenuItem from "./menu-item.svelte";
	import { useLevelCtx, useSubCtx } from "./ctx.svelte.js";
	import type { Attachment } from "svelte/attachments";
	import type { SubTriggerProps, MenuFocus } from "./index.js";
	const { disabled = false, inset = false, children, class: className, ...props }: SubTriggerProps = $props();
	const level = useLevelCtx();
	const sub = useSubCtx();

	/** Opens this submenu and closes any other submenu open at the same level. */
	const openSub = (initialFocus: MenuFocus) => {
		// If a sibling submenu is open: close it first so only one shows.
		if (level.activeSub && level.activeSub !== sub) level.activeSub.setOpen(false);
		level.activeSub = sub;
		sub.setOpen(true, initialFocus);
	};

	/** Registers the sub trigger for placement and focus, and opens the submenu on hover and keys. */
	const registerTrigger: Attachment<HTMLDivElement> = (node) => {
		sub.triggerEl = node;

		/** Opens the submenu when a mouse or pen rests on the sub trigger. */
		const handlePointerMove = (e: PointerEvent) => {
			// If this is a touch or the item is disabled: wait for a tap instead.
			if (e.pointerType === "touch" || disabled) return;
			openSub("none");
		};
		/** Opens the submenu and focuses its first item with the right arrow, Enter, or Space. */
		const handleKeydown = (e: KeyboardEvent) => {
			// If the item is disabled or the key does not open: leave it to the parent menu.
			if (disabled || !["ArrowRight", "Enter", " "].includes(e.key)) return;
			// Mark the key as handled so the parent menu does not also select the item.
			e.preventDefault();
			// If the submenu is already open from hovering: move focus into it.
			if (sub.open) sub.focusFirstItem();
			else openSub("first");
		};

		// Listen on the item itself so these run before the parent menu's key handling, and before delegated prop handlers.
		node.addEventListener("pointermove", handlePointerMove);
		node.addEventListener("keydown", handleKeydown);
		return () => {
			node.removeEventListener("pointermove", handlePointerMove);
			node.removeEventListener("keydown", handleKeydown);
			// If another sub trigger has not taken over: clear the reference.
			if (sub.triggerEl === node) sub.triggerEl = undefined;
		};
	};
</script>

<!-- Item that opens a submenu, with a chevron pointing toward it. -->
<MenuItem class={className} role="menuitem" id={sub.triggerId} aria-haspopup="menu" aria-expanded={sub.open} aria-controls={sub.open ? sub.contentId : undefined} data-state={sub.open ? "open" : "closed"} {disabled} {inset} keepHighlight={sub.open} onSelect={() => openSub("none")} {@attach registerTrigger} {...props}>
	{@render children()}
	{#snippet trailing()}
		<ChevronRightIcon aria-hidden="true" />
	{/snippet}
</MenuItem>
