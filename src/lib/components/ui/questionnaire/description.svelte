<script lang="ts">
	import { useItemCtx } from "./ctx.svelte.js";
	import type { DescriptionProps } from "./index.js";
	const { id, children, class: className, ...props }: DescriptionProps = $props();
	const item = useItemCtx();
	const fallbackId = $props.id();
	const descriptionId = $derived(id ?? fallbackId);

	// Link the description to the question while it is mounted.
	$effect(() => item.registerDescription(descriptionId));
</script>

<!-- Hint under the title, read with the question. -->
<p id={descriptionId} class={["questionnaireDescription", className]} {...props}>
	{@render children()}
</p>

<style>
	/* Muted hint */
	.questionnaireDescription {
		margin: 0;
		color: var(--muted-foreground);
		font-size: var(--text-sm);
		text-wrap: pretty;
	}
</style>
