<script lang="ts">
	import { setCompCtx } from "./ctx.svelte.js";
	import type { Props } from "./index.js";
	import type { CompCtxProps } from "./ctx.svelte.js";
	let { defaultValue = "", value = $bindable(defaultValue), onValueChange, orientation = "horizontal", activationMode = "automatic", variant = "default", size = "md", rounded = "lg", children, class: className, ...props }: Props = $props();
	const baseId = $props.id();
	const contextData: Omit<CompCtxProps, "value"> = $derived({ baseId, orientation, activationMode, variant, size, rounded, onValueChange });
	const ctx = setCompCtx({ ...contextData, value });

	// Keep the shared settings in sync when the props change.
	$effect.pre(() => void Object.assign(ctx, contextData));

	// Keep the bindable prop and the shared value in sync in both directions.
	$effect.pre(() => void (ctx.value = value));
	$effect.pre(() => void (value = ctx.value));
</script>

<!-- Holds the list and panels; a vertical orientation places the list beside the panels. -->
<div class={["tabs not-typeset", className]} data-orientation={ctx.orientation} data-variant={ctx.variant} data-size={ctx.size} data-rounded={ctx.rounded} {...props}>
	{@render children()}
</div>

<style>
	/* Base tabs; the list sits above the panel */
	.tabs {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	/* The list sits to the left of the panel */
	.tabs[data-orientation="vertical"] {
		flex-direction: row;
	}
</style>
