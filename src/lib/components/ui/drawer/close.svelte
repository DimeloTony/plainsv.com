<script lang="ts">
	import { Button } from "#lib/components/ui/button/index.js";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { CloseProps } from "./index.js";
	const { children, trigger, variant = "outline", size, rounded, class: className }: CloseProps = $props();
	const ctx = useCompCtx();
	const closeProps = { onclick: () => ctx.setOpen(false) };
</script>

<!-- Render the custom close trigger when given, otherwise a default button. -->
{#if trigger}
	{@render trigger({ props: closeProps })}
{:else}
	<Button {variant} {size} {rounded} class={className} {...closeProps}>{@render children?.()}</Button>
{/if}
