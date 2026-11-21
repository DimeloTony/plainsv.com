<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	import type { LegendProps } from "./index.js";
	const props: LegendProps = $props();
	const ctx = useCompCtx();
	// Hand the settings to the chart during setup, so its first render, on the server too, already includes this part.
	ctx.legendPart = props;

	// Remove the part once it leaves the chart's children.
	$effect(() => () => {
		if (ctx.legendPart === props) ctx.legendPart = null;
	});
</script>

<!-- Settings only: the chart draws the legend above, below, or over the plot, wherever `position` puts it. -->
