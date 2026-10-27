<script lang="ts">
	import { Button } from "#lib/components/ui/button/index.js";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { ActionProps } from "./index.js";
	const { children, variant = "default", size, rounded, disabled = false, onclick, class: className, ...props }: ActionProps = $props();
	const ctx = useCompCtx();
	const isVisible = $derived(ctx.progress.total > 1 && !ctx.progress.last);

	/** Checks the active question and goes forward, unless the passed handler prevented it. */
	const handleClick = (e: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) => {
		onclick?.(e);
		if (!e.defaultPrevented) ctx.goNext();
	};
</script>

<!-- Checks the answer and goes forward; hidden on the last question. -->
{#if isVisible}
	<Button type="button" {variant} size={size ?? ctx.size} rounded={rounded ?? ctx.rounded} {disabled} class={["questionnaireAction", className]} data-questionnaire-action="next" aria-keyshortcuts={disabled ? undefined : "Enter"} onclick={handleClick} {...props}>
		{#if children}
			{@render children()}
		{:else}
			Next
		{/if}
	</Button>
{/if}
