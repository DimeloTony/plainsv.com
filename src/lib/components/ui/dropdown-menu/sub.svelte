<script lang="ts">
	import { setSubCtx } from "./ctx.svelte.js";
	import type { SubProps } from "./index.js";
	let { open = $bindable(false), children }: SubProps = $props();
	const baseId = $props.id();
	const ctx = setSubCtx({ open, baseId });

	// Keep the bindable prop and the shared open state in sync in both directions.
	$effect.pre(() => void (ctx.open = open));
	$effect.pre(() => void (open = ctx.open));
</script>

<!-- Sub trigger and sub content parts; the sub content places itself beside the sub trigger. -->
{@render children()}
