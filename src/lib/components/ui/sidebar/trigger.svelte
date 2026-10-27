<script lang="ts">
	import { PanelLeftIcon } from "@lucide/svelte";
	import { Button } from "#lib/components/ui/button/index.js";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { TriggerProps, TriggerAttrs } from "./index.js";
	const { trigger, onclick, ...props }: TriggerProps = $props();
	const ctx = useCompCtx();
	const triggerProps: TriggerAttrs = $derived({
		"aria-label": "Toggle sidebar",
		"aria-expanded": ctx.isMobile ? ctx.openMobile : ctx.open,
		onclick: () => ctx.toggle(),
	});

	/** Toggles the sidebar, unless a passed click handler prevented the default. */
	const handleClick = (e: MouseEvent) => {
		onclick?.(e);
		// If the passed handler called preventDefault: leave the sidebar as it is.
		if (e.defaultPrevented) return;
		ctx.toggle();
	};
</script>

<!-- Render the custom trigger when given, otherwise a ghost icon button that expands and collapses the sidebar, or opens the drawer on mobile. -->
{#if trigger}
	{@render trigger({ props: triggerProps })}
{:else}
	<Button variant="ghost" size="icon-sm" {...triggerProps} {...props} onclick={handleClick}>
		<PanelLeftIcon />
	</Button>
{/if}
