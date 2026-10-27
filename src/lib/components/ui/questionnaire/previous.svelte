<script lang="ts">
	import { Button } from "#lib/components/ui/button/index.js";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { ActionProps } from "./index.js";
	const { children, variant = "outline", size, rounded, disabled = false, onclick, class: className, ...props }: ActionProps = $props();
	const ctx = useCompCtx();
	const isVisible = $derived(ctx.progress.total > 1 && !ctx.progress.first);

	/** Goes back one question, unless the passed handler prevented it. */
	const handleClick = (e: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) => {
		onclick?.(e);
		if (!e.defaultPrevented) ctx.goPrevious();
	};
</script>

<!-- Goes back one question; hidden on the first question. -->
{#if isVisible}
	<Button type="button" {variant} size={size ?? ctx.size} rounded={rounded ?? ctx.rounded} {disabled} class={["questionnaireAction", className]} data-questionnaire-action="previous" onclick={handleClick} {...props}>
		{#if children}
			{@render children()}
		{:else}
			Previous
		{/if}
	</Button>
{/if}
