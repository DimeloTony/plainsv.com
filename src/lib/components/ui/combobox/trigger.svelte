<script lang="ts">
	import { Button } from "#lib/components/ui/button/index.js";
	import { PopoverTrigger } from "#lib/components/ui/popover/index.js";
	import { ChevronsUpDownIcon } from "@lucide/svelte";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { TriggerProps } from "./index.js";
	const { children, trigger: customTrigger, variant = "outline", size, rounded, class: className, ...props }: TriggerProps = $props();
	const ctx = useCompCtx();
</script>

<!-- Render the custom trigger when given, otherwise an outline button with the selected value and a chevron; the popover places itself against it. -->
<PopoverTrigger>
	{#snippet trigger({ props: triggerProps })}
		{#if customTrigger}
			{@render customTrigger({ props: { ...triggerProps, disabled: ctx.disabled } })}
		{:else}
			<Button {variant} size={size ?? ctx.size} rounded={rounded ?? ctx.rounded} disabled={ctx.disabled} class={["comboboxTrigger", className]} {...props} {...triggerProps}>
				<span class="comboboxTriggerValue">{@render children?.()}</span>
				<ChevronsUpDownIcon aria-hidden="true" />
			</Button>
		{/if}
	{/snippet}
</PopoverTrigger>

<style>
	/* Fills the button so the chevron sits at the end; long values are cut off with an ellipsis */
	.comboboxTriggerValue {
		flex: 1;
		overflow: hidden;
		font-weight: 400;
		text-align: start;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.comboboxTriggerValue + :global(svg) {
		opacity: 50%;
	}
</style>
