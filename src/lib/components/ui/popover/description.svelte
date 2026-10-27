<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	import type { Attachment } from "svelte/attachments";
	import type { DescriptionProps } from "./index.js";
	const { children, class: className, ...props }: DescriptionProps = $props();
	const ctx = useCompCtx();

	/** Marks the description as mounted so the content is described by it. */
	const registerDescription: Attachment<HTMLParagraphElement> = () => {
		ctx.hasDescription = true;
		return () => (ctx.hasDescription = false);
	};
</script>

<!-- Muted supporting text; its id describes the content. -->
<p class={["popoverDescription", className]} id={ctx.descriptionId} {@attach registerDescription} {...props}>
	{@render children()}
</p>

<style>
	/* Base description */
	.popoverDescription {
		margin: 0;
		color: var(--muted-foreground);
	}
</style>
