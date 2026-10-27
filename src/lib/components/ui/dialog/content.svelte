<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	import type { ContentProps } from "./index.js";
	const { children, class: className, ...props }: ContentProps = $props();
	const ctx = useCompCtx();
	// Hand the content to the root, which renders it inside the dialog.
	ctx.content = children;

	// Hand the classes and attributes to the root too, which puts them on the panel.
	$effect.pre(() => {
		ctx.contentClass = className;
		ctx.contentAttrs = props;
	});
</script>
