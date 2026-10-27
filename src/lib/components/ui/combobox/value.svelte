<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	import type { ValueProps } from "./index.js";
	const { placeholder = "", label, class: className, ...props }: ValueProps = $props();
	const ctx = useCompCtx();
	// Prefer the passed label, then the text the item registered, then the raw value.
	const text = $derived(ctx.value ? (label ?? ctx.labels.get(ctx.value) ?? ctx.value) : placeholder);
</script>

<!-- Selected item's text, or the muted placeholder when nothing is selected. -->
<span class={["comboboxValue", className]} data-placeholder={!ctx.value || undefined} {...props}>{text}</span>

<style>
	/* Placeholder state */
	.comboboxValue[data-placeholder] {
		color: var(--muted-foreground);
	}
</style>
