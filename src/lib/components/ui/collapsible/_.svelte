<script lang="ts">
	import { setCompCtx } from "./ctx.svelte.js";
	import type { Props } from "./index.js";
	import type { CompCtxProps } from "./ctx.svelte.js";
	let { defaultOpen = false, open = $bindable(defaultOpen), onOpenChange, disabled = false, children, class: className, ...props }: Props = $props();
	const baseId = $props.id();
	const contextData: Omit<CompCtxProps, "open"> = $derived({ disabled, baseId, onOpenChange });
	const ctx = setCompCtx({ ...contextData, open });

	// Keep the shared settings in sync when the props change.
	$effect.pre(() => void Object.assign(ctx, contextData));

	// Keep the bindable prop and the shared open state in sync in both directions.
	$effect.pre(() => void (ctx.open = open));
	$effect.pre(() => void (open = ctx.open));
</script>

<!-- Unstyled wrapper around the trigger and content; style it with a class. -->
<div class={["collapsible not-typeset", className]} data-state={ctx.open ? "open" : "closed"} data-disabled={ctx.disabled || undefined} {...props}>
	{@render children()}
</div>
