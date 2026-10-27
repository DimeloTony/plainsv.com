<script lang="ts">
	import { CommandItem } from "#lib/components/ui/command/index.js";
	import { useCompCtx as usePopoverCtx } from "#lib/components/ui/popover/ctx.svelte.js";
	import { CheckIcon } from "@lucide/svelte";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { Attachment } from "svelte/attachments";
	import type { ItemProps } from "./index.js";
	const { value, label, keywords, disabled = false, children, class: className, ...props }: ItemProps = $props();
	const ctx = useCompCtx();
	const popoverCtx = usePopoverCtx();
	const isSelected = $derived(ctx.value === value);

	/** Stores the item's text for ComboboxValue; kept after the list closes. */
	const registerLabel: Attachment<HTMLDivElement> = (node) => {
		ctx.labels.set(value, label ?? node.textContent?.trim() ?? value);
	};

	/** Selects the item, closes the popover, and returns focus to the trigger. */
	const handleSelect = () => {
		ctx.select(value);
		popoverCtx.triggerEl?.focus({ preventScroll: true });
	};
</script>

<!-- Command item that selects its value, with a check mark at the end while selected. -->
<CommandItem class={["comboboxItem", className]} {value} {keywords} {disabled} onSelect={handleSelect} data-checked={isSelected || undefined} {@attach registerLabel} {...props}>
	{@render children()}
	{#if isSelected}
		<span class="comboboxItemCheck"><CheckIcon aria-hidden="true" /></span>
	{/if}
</CommandItem>

<style>
	/* Check mark pushed to the end of the item */
	.comboboxItemCheck {
		display: flex;
		margin-left: auto;
	}
</style>
