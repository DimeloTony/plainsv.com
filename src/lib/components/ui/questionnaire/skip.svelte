<script lang="ts">
	import { Button } from "#lib/components/ui/button/index.js";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { ActionProps } from "./index.js";
	const { children, variant = "outline", size, rounded, disabled = false, onclick, class: className, ...props }: ActionProps = $props();
	const ctx = useCompCtx();
	const isVisible = $derived(ctx.activeItem !== undefined && !ctx.activeItem.required);

	/** Skips the active question, unless the passed handler prevented it. */
	const handleClick = (e: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) => {
		onclick?.(e);
		if (!e.defaultPrevented) ctx.skipCurrent();
	};
</script>

<!-- Skips the active question; shown only for optional questions. -->
{#if isVisible}
	<Button type="button" {variant} size={size ?? ctx.size} rounded={rounded ?? ctx.rounded} {disabled} class={["questionnaireAction", className]} data-questionnaire-action="skip" onclick={handleClick} {...props}>
		{#if children}
			{@render children()}
		{:else}
			Skip
		{/if}
	</Button>
{/if}
