<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	import type { TitleProps } from "./index.js";
	const { children, class: className, ...props }: TitleProps = $props();
	const ctx = useCompCtx();
</script>

<!-- Heading that names the drawer through aria-labelledby. -->
<h2 class={["drawerTitle", className]} id={ctx.titleId} {...props}>
	{@render children()}
</h2>

<style>
	/* Base title */
	.drawerTitle {
		margin: 0;
		font-weight: 600;
		font-size: var(--text-md);
		line-height: var(--line-height-md);
	}
</style>
