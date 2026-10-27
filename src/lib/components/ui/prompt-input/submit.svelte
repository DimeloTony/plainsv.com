<script lang="ts">
	import { createAttachmentKey } from "svelte/attachments";
	import { ArrowUpIcon, LoaderCircleIcon } from "@lucide/svelte";
	import { Button } from "#lib/components/ui/button/index.js";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { PromptInputTriggerAttrs, SubmitProps } from "./index.js";
	let { element = $bindable(), trigger, variant = "default", size, rounded, disabled = false, "aria-label": ariaLabel, children, class: className, ...props }: SubmitProps = $props();
	const ctx = useCompCtx();
	// Created once, so the element binding does not re-attach each time the props change.
	const attachmentKey = createAttachmentKey();
	// Props for the default button or a custom trigger.
	const triggerProps: PromptInputTriggerAttrs = $derived({ type: "submit", disabled: disabled || !ctx.isReady, "aria-label": ariaLabel ?? (ctx.sending ? "Sending" : "Send prompt"), [attachmentKey]: bindElement });

	/** Shares the trigger element through `bind:element`. */
	function bindElement(node: HTMLElement) {
		element = node;
		return () => (element = undefined);
	}
</script>

<!-- Send button at the end of the actions; a custom trigger gets the sending and ready states for its own look. -->
{#if trigger}
	{@render trigger({ props: triggerProps, sending: ctx.sending, ready: ctx.isReady })}
{:else}
	<Button {variant} size={size ?? `icon-${ctx.controlSize}`} rounded={rounded ?? ctx.controlRounded} class={["promptInputSubmit", className]} {...props} {...triggerProps}>
		{#if ctx.sending}
			<LoaderCircleIcon class="promptInputSpin" />
		{:else if children}
			{@render children()}
		{:else}
			<ArrowUpIcon />
		{/if}
	</Button>
{/if}

<style>
	/* Pushed to the end of the actions row */
	:global(.promptInputSubmit) {
		margin-left: auto;
	}

	:global(.promptInputSpin) {
		animation: promptInputSpin 1s linear infinite;
	}

	@keyframes promptInputSpin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
