<svelte:options namespace="svg" />

<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	const ctx = useCompCtx();
	// Space in pixels around a tag's text, and between a label and its line.
	const TAG_PADDING = 5;
	const LABEL_OFFSET = 4;
	// Pixels a band grows for each step of `size` past 1, so `size: 2` is 6px tall and `size: 4` is 18px.
	const BAND_STEP = 6;
	const plotRight = $derived(ctx.marginLeft + ctx.plotWidth);
	const priceBottom = $derived(ctx.marginTop + ctx.priceHeight);
	const tagHeight = $derived(ctx.tagHeight);

	/** Top and bottom of a level's band, centered on its line and kept inside the price pane; flat for a plain line. */
	function getBand(lineY: number, size: number | undefined) {
		const half = (Math.max(1, size ?? 1) - 1) * (BAND_STEP / 2);
		return { top: Math.max(ctx.marginTop, lineY - half), bottom: Math.min(priceBottom, lineY + half) };
	}
</script>

<!-- Dashed lines mark levels, since they are thresholds rather than data; each gets a price tag on the axis. -->
<g class="candlestickChartLevels">
	{#each ctx.levelTags as level (level.position)}
		<g style:--candlestick-chart-series-color={level.color}>
			<!-- Position lines only borrow the tag; the positions part draws their lines across their zones. -->
			{#if level.placement === "inside" && !level.isPosition}
				{@const band = getBand(level.lineY, level.size)}
				<!-- A level bigger than 1 shades a band around its line, so a stronger level reads heavier at any zoom. -->
				{#if band.bottom > band.top}
					<rect class="candlestickChartLevelBand" x={ctx.marginLeft} y={band.top} width={ctx.plotWidth} height={band.bottom - band.top} />
				{/if}
				<line class="candlestickChartLevelLine" x1={ctx.marginLeft} x2={plotRight} y1={level.lineY} y2={level.lineY} data-last={level.isLast || undefined} />
				{#if level.label}
					<text class="candlestickChartLevelLabel" x={ctx.marginLeft + LABEL_OFFSET} y={band.top - LABEL_OFFSET}>{level.label}</text>
				{/if}
			{/if}
			<rect class="candlestickChartLevelTag" x={plotRight + 1} y={level.tagY - tagHeight / 2} width={ctx.measureText([level.text]) + TAG_PADDING * 2} height={tagHeight} />
			<text class="candlestickChartLevelText" x={plotRight + 1 + TAG_PADDING} y={level.tagY} dominant-baseline="middle">{level.text}</text>
		</g>
	{/each}
</g>

<style>
	/* Dashed threshold line in the level color */
	.candlestickChartLevelLine {
		shape-rendering: crispEdges;
		stroke: var(--candlestick-chart-series-color);
		stroke-dasharray: 4 3;
		stroke-width: 1px;
	}

	/* The latest close uses a dotted line, apart from the dashed levels */
	.candlestickChartLevelLine[data-last] {
		stroke-dasharray: 1 3;
	}

	/* Soft band in the level color around a level bigger than 1 */
	.candlestickChartLevelBand {
		fill: color-mix(in oklab, var(--candlestick-chart-series-color) 22%, transparent);
	}

	/* Level name; text stays in text colors */
	.candlestickChartLevelLabel {
		fill: var(--muted-foreground);
		font-size: inherit;
	}

	/* Axis tag outlined in the level color */
	.candlestickChartLevelTag {
		fill: var(--popover);
		rx: var(--radius-xs);
		stroke: var(--candlestick-chart-series-color);
		stroke-width: 1px;
	}

	.candlestickChartLevelText {
		fill: var(--popover-foreground);
		font-size: inherit;
	}
</style>
