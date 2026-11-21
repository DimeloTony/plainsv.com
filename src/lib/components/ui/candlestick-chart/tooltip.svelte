<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	import type { TooltipProps } from "./index.js";
	const props: TooltipProps = $props();
	const ctx = useCompCtx();
	// Hand the settings to the chart during setup, so its first render, on the server too, already includes this part.
	ctx.tooltipPart = props;

	// Remove the part once it leaves the chart's children.
	$effect(() => () => {
		if (ctx.tooltipPart === props) ctx.tooltipPart = null;
	});
</script>

<!-- Settings only: the chart draws the tooltip in its own layer, so it can sit over the plot and follow the candles. -->
