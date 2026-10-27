<script lang="ts">
	import { createAttachmentKey } from "svelte/attachments";
	import { PlusIcon } from "@lucide/svelte";
	import { Button } from "#lib/components/ui/button/index.js";
	import { Tooltip, TooltipTrigger, TooltipContent } from "#lib/components/ui/tooltip/index.js";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { FilesButtonProps, PromptInputTriggerAttrs } from "./index.js";
	let { element = $bindable(), tooltip = "Add images", trigger: customTrigger, variant = "ghost", size, rounded, disabled = false, children, onclick, ...props }: FilesButtonProps = $props();
	const ctx = useCompCtx();
	// Created once, so the element binding does not re-attach each time the props change.
	const attachmentKey = createAttachmentKey();
	// Props for the default button or a custom trigger.
	const triggerProps: PromptInputTriggerAttrs = $derived({ type: "button", disabled: disabled || ctx.sending || ctx.files.length >= ctx.maxFiles, "aria-label": tooltip, onclick: handleClick, [attachmentKey]: bindElement });

	/** Shares the trigger element through `bind:element`. */
	function bindElement(node: HTMLElement) {
		element = node;
		return () => (element = undefined);
	}

	/** Opens the file picker, unless the passed handler prevented it. */
	function handleClick(e: MouseEvent & { currentTarget: EventTarget & HTMLElement }) {
		onclick?.(e);
		if (!e.defaultPrevented) ctx.fileInputEl?.click();
	}
</script>

<!-- Button that opens the file picker, named by its tooltip; a custom trigger keeps the tooltip. -->
<Tooltip side="bottom" align="start" arrow={false} delay={100}>
	<TooltipTrigger>
		{#snippet trigger({ props: tooltipProps })}
			{#if customTrigger}
				{@render customTrigger({ props: { ...tooltipProps, ...triggerProps } })}
			{:else}
				<Button {variant} size={size ?? `icon-${ctx.controlSize}`} rounded={rounded ?? ctx.controlRounded} {...tooltipProps} {...props} {...triggerProps}>
					{#if children}
						{@render children()}
					{:else}
						<PlusIcon style="width: 1.5rem;height: 1.5rem;" />
					{/if}
				</Button>
			{/if}
		{/snippet}
	</TooltipTrigger>
	<TooltipContent>{tooltip}</TooltipContent>
</Tooltip>
