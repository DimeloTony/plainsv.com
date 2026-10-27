<script lang="ts">
	import { Button } from "#lib/components/ui/button/index.js";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { TriggerProps, TriggerAttrs } from "./index.js";
	const { children, trigger, variant = "outline", size, rounded, onclick, class: className, ...props }: TriggerProps = $props();
	const ctx = useCompCtx();
	const triggerProps: TriggerAttrs = $derived({
		id: ctx.triggerId,
		"aria-expanded": ctx.open,
		"aria-controls": ctx.contentId,
		"data-state": ctx.open ? "open" : "closed",
		disabled: ctx.disabled,
		onclick: () => ctx.toggle(),
	});

	/** Toggles the content, unless a passed click handler prevented the default. */
	const handleClick = (e: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) => {
		onclick?.(e);
		// If the passed handler called preventDefault: keep the current state.
		if (e.defaultPrevented) return;
		ctx.toggle();
	};
</script>

<!-- Render the custom trigger when given, otherwise a button. -->
{#if trigger}
	{@render trigger({ props: triggerProps })}
{:else}
	<Button {variant} {size} {rounded} class={className} {...props} {...triggerProps} onclick={handleClick}>{@render children?.()}</Button>
{/if}
