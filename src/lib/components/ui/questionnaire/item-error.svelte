<script lang="ts">
	import { useItemCtx } from "./ctx.svelte.js";
	import type { ErrorProps } from "./index.js";
	const { id, children, class: className, ...props }: ErrorProps = $props();
	const item = useItemCtx();
	const fallbackId = $props.id();
	const errorId = $derived(id ?? fallbackId);

	// Link the message to the question, which reads it only while invalid.
	$effect(() => item.registerError(errorId));
</script>

<!-- Message shown only while the question is invalid. -->
<p id={errorId} class={["questionnaireError", className]} hidden={!item.isInvalid} role={item.isInvalid ? "alert" : undefined} data-invalid={item.isInvalid || undefined} {...props}>
	{#if children}
		{@render children()}
	{:else}
		{item.required ? "Choose an answer to continue." : "Choose an answer or skip this question."}
	{/if}
</p>

<style>
	/* Destructive message */
	.questionnaireError {
		margin: 0;
		color: var(--destructive);
		font-size: var(--text-sm);
	}

	.questionnaireError[hidden] {
		display: none;
	}
</style>
