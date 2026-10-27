<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	import type { ContentProps } from "./index.js";
	const { children }: ContentProps = $props();
	const ctx = useCompCtx();
	// Hand the content to the root, which renders it inside the sheet panel.
	ctx.content = children;
</script>
