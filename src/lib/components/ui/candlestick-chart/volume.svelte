<svelte:options namespace="svg" />

<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	const ctx = useCompCtx();
	const bottom = $derived(ctx.volumeTop + ctx.volumeHeight);
</script>

<!-- One volume bar per visible candle, in a lighter step of its direction color. -->
<g class="candlestickChartVolume">
	{#each ctx.visibleIndexes as index (index)}
		{@const candle = ctx.data[index]}
		{#if candle.volume}
			{@const top = ctx.volumeToY(candle.volume)}
			<rect class="candlestickChartVolumeBar" x={ctx.x(index) - ctx.bodyWidth / 2} y={top} width={ctx.bodyWidth} height={Math.max(1, bottom - top)} data-direction={candle.close >= candle.open ? "up" : "down"} data-active={index === ctx.activeIndex || undefined} />
		{/if}
	{/each}
</g>

<style>
	/* =============== Variants =============== */

	/* Recessive bars, so volume stays behind the price story */
	.candlestickChartVolumeBar[data-direction="up"] {
		fill: color-mix(in oklab, var(--candlestick-chart-up, var(--chart-3)) 40%, transparent);
	}

	.candlestickChartVolumeBar[data-direction="down"] {
		fill: color-mix(in oklab, var(--candlestick-chart-down, var(--destructive)) 40%, transparent);
	}

	/* =============== States =============== */

	/* Hovered bar shows at full strength */
	.candlestickChartVolumeBar[data-active][data-direction="up"] {
		fill: var(--candlestick-chart-up, var(--chart-3));
	}

	.candlestickChartVolumeBar[data-active][data-direction="down"] {
		fill: var(--candlestick-chart-down, var(--destructive));
	}
</style>
