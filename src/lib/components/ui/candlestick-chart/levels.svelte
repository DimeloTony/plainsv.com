<svelte:options namespace="svg" />

<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	const ctx = useCompCtx();
	// Space in pixels around a tag's text, and between a label and its line.
	const TAG_PADDING = 5;
	const LABEL_OFFSET = 4;
	const plotRight = $derived(ctx.marginLeft + ctx.plotWidth);
	const priceBottom = $derived(ctx.marginTop + ctx.priceHeight);
	const tagHeight = $derived(ctx.tagHeight);

	/** Top and bottom of a level's band, centered on its line and kept inside the price pane; flat for a plain line. */
	function getBand(lineY: number, size: number | undefined) {
		const half = ctx.levelBandHeight(size) / 2;
		return { top: Math.max(ctx.marginTop, lineY - half), bottom: Math.min(priceBottom, lineY + half) };
	}
</script>

<!-- Dashed lines mark levels, since they are thresholds rather than data; each running level gets a price tag on the axis. -->
<g class="candlestickChartLevels">
	<!-- User levels across their span, unless a `level` snippet draws them. -->
	{#if !ctx.level}
		{#each ctx.levelLines as item (item.position)}
			{@const band = getBand(item.lineY, item.level.size)}
			{@const left = Math.max(ctx.marginLeft, item.left)}
			{@const width = Math.min(plotRight, item.right) - left}
			<g style:--candlestick-chart-series-color={item.color}>
				<!-- A level bigger than 1 shades a band around its line, so a stronger level reads heavier at any zoom. -->
				{#if band.bottom > band.top}
					<rect class="candlestickChartLevelBand" x={left} y={band.top} {width} height={band.bottom - band.top} />
				{/if}
				<line class="candlestickChartLevelLine" x1={left} x2={left + width} y1={item.lineY} y2={item.lineY} data-style={item.level.style} />
				{#if item.level.label}
					<text class="candlestickChartLevelLabel" x={left + LABEL_OFFSET} y={band.top - LABEL_OFFSET}>{item.level.label}</text>
				{/if}
			</g>
		{/each}
	{/if}
	<!-- Tags for running levels, position lines, and the last price; position lines only borrow the tag, since the positions part draws their lines across their zones. -->
	{#each ctx.levelTags as level (level.position)}
		<g style:--candlestick-chart-series-color={level.color}>
			{#if level.isLast && level.placement === "inside"}
				<line class="candlestickChartLevelLine" x1={ctx.marginLeft} x2={plotRight} y1={level.lineY} y2={level.lineY} data-last />
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

	.candlestickChartLevelLine[data-style="dotted"] {
		stroke-dasharray: 1 3;
	}

	.candlestickChartLevelLine[data-style="solid"] {
		stroke-dasharray: none;
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
