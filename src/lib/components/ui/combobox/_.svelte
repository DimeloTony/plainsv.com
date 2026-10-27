<script lang="ts">
	import { Popover } from "#lib/components/ui/popover/index.js";
	import { setCompCtx } from "./ctx.svelte.js";
	import type { Props } from "./index.js";
	import type { CompCtxProps } from "./ctx.svelte.js";
	let { defaultValue = "", value = $bindable(defaultValue), onValueChange, open = $bindable(false), onOpenChange, disabled = false, name, size = "md", rounded, children }: Props = $props();
	const contextData: Omit<CompCtxProps, "value" | "open"> = $derived({ disabled, size, rounded, onValueChange, onOpenChange });
	const ctx = setCompCtx({ ...contextData, value, open });

	// Keep the shared settings in sync when the props change.
	$effect.pre(() => void Object.assign(ctx, contextData));

	// Keep the bindable props and the shared state in sync in both directions.
	$effect.pre(() => void (ctx.value = value));
	$effect.pre(() => void (value = ctx.value));
	$effect.pre(() => void (ctx.open = open));
	$effect.pre(() => void (open = ctx.open));
</script>

<!-- Popover that holds the trigger and the searchable list, aligned to the trigger's start edge. -->
<Popover bind:open={ctx.open} {onOpenChange} align="start" {size} {rounded}>
	{@render children()}
</Popover>

<!-- Hidden input so the value submits with forms. -->
{#if name}
	<input type="hidden" {name} value={ctx.value} />
{/if}
