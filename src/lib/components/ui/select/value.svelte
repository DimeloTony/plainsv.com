<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	import type { ValueProps } from "./index.js";
	const { placeholder = "", label: initialLabel, class: className, ...props }: ValueProps = $props();
	const ctx = useCompCtx();
	// Items register their text once mounted, so the passed label covers server rendering and hydration.
	const label = $derived(ctx.labels.get(ctx.value) ?? initialLabel ?? "");
</script>

<!-- Selected item's text, or the muted placeholder. -->
<span class={["selectValue", className]} data-placeholder={label ? undefined : ""} {...props}>
	{label || placeholder}
</span>

<style>
	/* Base value; truncates long text */
	.selectValue {
		overflow: hidden;
		text-align: start;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.selectValue[data-placeholder] {
		color: var(--muted-foreground);
	}
</style>
