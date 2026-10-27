<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	import type { Attachment } from "svelte/attachments";
	import type { TitleProps } from "./index.js";
	const { children, class: className, ...props }: TitleProps = $props();
	const ctx = useCompCtx();

	/** Marks the title as mounted so the content is named by it instead of the trigger. */
	const registerTitle: Attachment<HTMLHeadingElement> = () => {
		ctx.hasTitle = true;
		return () => (ctx.hasTitle = false);
	};
</script>

<!-- Popover heading; its id names the content. -->
<h2 class={["popoverTitle", className]} id={ctx.titleId} {@attach registerTitle} {...props}>
	{@render children()}
</h2>

<style>
	/* Base title; same size as the body text */
	.popoverTitle {
		margin: 0;
		font-weight: 500;
		font-size: inherit;
		line-height: inherit;
	}
</style>
