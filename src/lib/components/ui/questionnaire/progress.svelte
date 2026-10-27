<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	import type { ProgressProps } from "./index.js";
	const { children, class: className, ...props }: ProgressProps = $props();
	const ctx = useCompCtx();
	const label = $derived(ctx.progress.total ? `Question ${ctx.progress.current} of ${ctx.progress.total}` : undefined);
</script>

<!-- Position of the active question, announced as a progress bar. -->
<div class={["questionnaireProgress", className]} role="progressbar" aria-label="Questionnaire progress" aria-live="polite" aria-valuemin={ctx.progress.total ? 1 : undefined} aria-valuemax={ctx.progress.total || undefined} aria-valuenow={ctx.progress.total ? ctx.progress.current : undefined} aria-valuetext={label} data-current={ctx.progress.current} data-total={ctx.progress.total} {...props}>
	{#if children}
		{@render children(ctx.progress)}
	{:else}
		{label}
	{/if}
</div>

<style>
	/* Small muted label; tabular numbers keep its width steady */
	.questionnaireProgress {
		min-width: 14ch;
		min-height: 1lh;
		color: var(--muted-foreground);
		font-weight: 500;
		font-size: var(--text-xs);
		font-variant-numeric: tabular-nums;
	}
</style>
