<script lang="ts">
	import { Button } from "#lib/components/ui/button/index.js";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { TriggerProps, TriggerAttrs } from "./index.js";
	const { children, trigger, variant = "outline", size, rounded, class: className }: TriggerProps = $props();
	const ctx = useCompCtx();
	const triggerProps: TriggerAttrs = { "aria-haspopup": "dialog", onclick: () => ctx.setOpen(true) };
</script>

<!-- Render the custom trigger when given, otherwise a default button. -->
{#if trigger}
	{@render trigger({ props: triggerProps })}
{:else}
	<Button {variant} {size} {rounded} class={className} {...triggerProps}>{@render children?.()}</Button>
{/if}
