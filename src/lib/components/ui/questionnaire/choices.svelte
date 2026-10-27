<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	import type { ChoicesProps } from "./index.js";
	const { children, class: className, ...props }: ChoicesProps = $props();
	const ctx = useCompCtx();
</script>

<!-- Column of choices for the question. -->
<div class={["questionnaireChoices", className]} data-shortcuts={ctx.shortcuts ?? undefined} {...props}>
	{@render children()}
</div>

<style>
	/* Base column */
	.questionnaireChoices {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		min-width: 0;
	}
</style>
