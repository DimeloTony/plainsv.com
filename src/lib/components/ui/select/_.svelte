<script lang="ts">
	import { setCompCtx } from "./ctx.svelte.js";
	import type { Props } from "./index.js";
	import type { CompCtxProps } from "./ctx.svelte.js";
	let { defaultValue = "", value = $bindable(defaultValue), onValueChange, open = $bindable(false), onOpenChange, disabled = false, name, required = false, variant = "default", size = "md", rounded, children }: Props = $props();
	const baseId = $props.id();
	const contextData: Omit<CompCtxProps, "value" | "open"> = $derived({ baseId, disabled, variant, size, rounded, onValueChange, onOpenChange });
	const ctx = setCompCtx({ ...contextData, value, open });

	// Keep the shared settings in sync when the props change.
	$effect.pre(() => void Object.assign(ctx, contextData));

	// Keep the bindable props and the shared state in sync in both directions.
	$effect.pre(() => void (ctx.value = value));
	$effect.pre(() => void (value = ctx.value));
	$effect.pre(() => void (ctx.open = open));
	$effect.pre(() => void (open = ctx.open));
</script>

<!-- Trigger and content parts. -->
{@render children()}

<!-- Hidden native select so the value submits with forms, autofills, and validates `required`. -->
{#if name}
	<select class="selectNative" {name} {required} disabled={ctx.disabled} value={ctx.value} aria-hidden="true" tabindex="-1" onchange={(e) => ctx.select(e.currentTarget.value)}>
		<option value=""></option>
		{#each ctx.labels as [optionValue, label] (optionValue)}
			<option value={optionValue}>{label}</option>
		{/each}
	</select>
{/if}

<style>
	/* Invisible but still validated and submitted */
	.selectNative {
		position: absolute;
		opacity: 0;
		width: 1px;
		height: 1px;
		pointer-events: none;
	}
</style>
