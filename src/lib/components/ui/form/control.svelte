<script lang="ts">
	import { useFieldCtx } from "./ctx.svelte.js";
	import type { ControlProps, ControlAttrs } from "./index.js";
	const { children }: ControlProps = $props();
	const ctx = useFieldCtx();
	const controlProps: ControlAttrs = $derived({
		id: ctx.controlId,
		name: ctx.name,
		"aria-invalid": ctx.errors.length > 0 || undefined,
		"aria-describedby": ctx.describedBy,
		onblur: () => ctx.touch(),
	});
</script>

<!-- Hands the id, name, and aria attributes to the control rendered by the child. -->
{@render children({ props: controlProps })}
