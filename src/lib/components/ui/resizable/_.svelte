<script lang="ts">
	import { setCompCtx } from "./ctx.svelte.js";
	import type { Props } from "./index.js";
	import type { CompCtxProps } from "./ctx.svelte.js";
	const { direction = "horizontal", onLayoutChange, children, class: className, ...props }: Props = $props();
	const contextData: CompCtxProps = $derived({ direction, onLayoutChange });
	const ctx = setCompCtx({ ...contextData });

	// Keep the shared settings in sync when the props change.
	$effect.pre(() => void Object.assign(ctx, contextData));
</script>

<!-- Panels and handles; fills its container. -->
<div class={["resizablePanelGroup not-typeset", className]} data-direction={ctx.direction} data-dragging={ctx.isDragging || undefined} {...props}>
	{@render children()}
</div>

<style>
	/* Base group; set a height on it, or on its container, for vertical groups */
	.resizablePanelGroup {
		display: flex;
		width: 100%;
		height: 100%;
	}

	.resizablePanelGroup[data-direction="vertical"] {
		flex-direction: column;
	}

	/* Keeps the resize cursor and stops text selection while dragging */
	.resizablePanelGroup[data-dragging][data-direction="horizontal"] {
		cursor: col-resize;
		user-select: none;
	}

	.resizablePanelGroup[data-dragging][data-direction="vertical"] {
		cursor: row-resize;
		user-select: none;
	}
</style>
