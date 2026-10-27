<script lang="ts">
	import { Button } from "#lib/components/ui/button/index.js";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { Attachment } from "svelte/attachments";
	import type { ButtonActionProps } from "./index.js";
	let { element = $bindable(), variant = "outline", size, rounded, disabled = false, children, ...props }: ButtonActionProps = $props();
	const ctx = useCompCtx();

	/** Shares the button element through `bind:element`. */
	const bindElement: Attachment<HTMLButtonElement> = (node) => {
		element = node;
		return () => (element = undefined);
	};
</script>

<!-- Pill action button; disabled while the prompt is sending. -->
<Button type="button" {variant} size={size ?? ctx.controlSize} rounded={rounded ?? ctx.controlRounded} disabled={disabled || ctx.sending} {@attach bindElement} {...props}>
	{@render children?.()}
</Button>
