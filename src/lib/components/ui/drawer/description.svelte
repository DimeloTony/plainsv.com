<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	import type { DescriptionProps } from "./index.js";
	const { children, class: className, ...props }: DescriptionProps = $props();
	const ctx = useCompCtx();
</script>

<!-- Supporting text that describes the drawer through aria-describedby. -->
<p class={["drawerDescription", className]} id={ctx.descriptionId} {...props}>
	{@render children()}
</p>

<style>
	/* Base description; the text size comes from the drawer */
	.drawerDescription {
		margin: 0;
		color: var(--muted-foreground);
	}
</style>
