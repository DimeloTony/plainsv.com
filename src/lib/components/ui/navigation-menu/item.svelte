<script lang="ts">
	import { useCompCtx, setItemCtx } from "./ctx.svelte.js";
	import type { Attachment } from "svelte/attachments";
	import type { ItemProps } from "./index.js";
	import type { ItemCtxProps } from "./ctx.svelte.js";
	const { value, children, class: className, ...props }: ItemProps = $props();
	const ctx = useCompCtx();
	const generatedValue = $props.id();
	const itemData: ItemCtxProps = $derived({ value: value ?? generatedValue });
	const itemCtx = setItemCtx(itemData);

	const isOpen = $derived(ctx.value === itemCtx.value);

	// Keep the item value in sync when the prop changes.
	$effect.pre(() => void Object.assign(itemCtx, itemData));

	/** Keeps the content open while the mouse is over the item, and closes it shortly after the mouse leaves. */
	const trackPointer: Attachment<HTMLLIElement> = (node) => {
		/** Cancels a pending close when the mouse comes back to the open item. */
		const handlePointerEnter = (e: PointerEvent) => {
			if (e.pointerType === "mouse" && ctx.value === itemCtx.value) clearTimeout(ctx.closeTimer);
		};
		/** Starts closing when the mouse leaves the item and its content. */
		const handlePointerLeave = (e: PointerEvent) => {
			// Touch and pen leave on every lift, so only the mouse closes on leave.
			if (e.pointerType === "mouse" && ctx.value) ctx.scheduleClose();
			// If a hover open is pending for this item: cancel it.
			else clearTimeout(ctx.openTimer);
		};

		// Listen directly so handlers passed through props still run.
		node.addEventListener("pointerenter", handlePointerEnter);
		node.addEventListener("pointerleave", handlePointerLeave);
		return () => {
			node.removeEventListener("pointerenter", handlePointerEnter);
			node.removeEventListener("pointerleave", handlePointerLeave);
		};
	};
</script>

<!-- Top-level item; the content is placed against it. -->
<li class={["navigationMenuItem", className]} data-state={isOpen ? "open" : "closed"} {@attach trackPointer} {...props}>
	{@render children()}
</li>

<style>
	/* Base item; anchors its content */
	.navigationMenuItem {
		position: relative;
	}
</style>
