<script lang="ts">
	import { Button } from "#lib/components/ui/button/index.js";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { ActionProps } from "./index.js";
	const { children, variant = "default", size, rounded, disabled = false, class: className, ...props }: ActionProps = $props();
	const ctx = useCompCtx();
	const isVisible = $derived(ctx.progress.total > 0 && ctx.progress.last);
</script>

<!-- Submits the form; shown only on the last question. -->
{#if isVisible}
	<Button type="submit" {variant} size={size ?? ctx.size} rounded={rounded ?? ctx.rounded} {disabled} class={["questionnaireAction", className]} data-questionnaire-action="submit" aria-keyshortcuts={disabled ? undefined : "Enter"} {...props}>
		{#if children}
			{@render children()}
		{:else}
			Submit
		{/if}
	</Button>
{/if}
