<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	import type { InfoProps } from "./index.js";
	const props: InfoProps = $props();
	const ctx = useCompCtx();
	// Hand the settings to the chart during setup, so its first render, on the server too, already includes this part.
	ctx.infoPart = props;

	// Remove the part once it leaves the chart's children.
	$effect(() => () => {
		if (ctx.infoPart === props) ctx.infoPart = null;
	});
</script>

<!-- Settings only: the chart draws the info in its own layer, in the plot's top-left corner. -->
