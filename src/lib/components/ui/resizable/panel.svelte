<script lang="ts">
	import { onDestroy } from "svelte";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { PanelProps } from "./index.js";
	const { defaultSize, minSize = 0, maxSize = 100, children, class: className, ...props }: PanelProps = $props();
	const ctx = useCompCtx();
	const panelId = $props.id();
	// Getters keep the limits in step with the props after registration.
	const unregister = ctx.registerPanel({
		id: panelId,
		get defaultSize() {
			return defaultSize;
		},
		get minSize() {
			return minSize;
		},
		get maxSize() {
			return maxSize;
		},
	});
	// The size is the panel's share of the free space, so the panels always fill the group.
	const size = $derived(ctx.sizes[panelId] ?? 0);

	onDestroy(unregister);
</script>

<!-- One panel; its flex grow is its size in percent. -->
<div class={["resizablePanel", className]} id={panelId} data-resizable-panel={panelId} style:flex="{size} 1 0px" {...props}>
	{@render children()}
</div>

<style>
	/* Base panel; content that does not fit is clipped */
	.resizablePanel {
		min-width: 0;
		min-height: 0;
		overflow: hidden;
	}
</style>
