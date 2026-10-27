<script lang="ts">
	import { setCompCtx } from "./ctx.svelte.js";
	import type { Props } from "./index.js";
	import type { CompCtxProps } from "./ctx.svelte.js";
	let { open = $bindable(false), onOpenChange, size = "md", rounded = "2xl", children }: Props = $props();
	const baseId = $props.id();
	const contextData: Pick<CompCtxProps, "size" | "rounded" | "onOpenChange"> = $derived({ size, rounded, onOpenChange });
	const ctx = setCompCtx({ ...contextData, open, baseId });

	// Keep the shared settings in sync when the props change.
	$effect.pre(() => void Object.assign(ctx, contextData));

	// Keep the bindable prop and the shared open state in sync in both directions.
	$effect.pre(() => void (ctx.open = open));
	$effect.pre(() => void (open = ctx.open));
</script>

<!-- Trigger and content parts; the content renders the modal while open. -->
{@render children()}
