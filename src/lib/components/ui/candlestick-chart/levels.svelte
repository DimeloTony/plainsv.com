<svelte:options namespace="svg" />

<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	const ctx = useCompCtx();
	// Space in pixels around a tag's text, and between a label and its line.
	const TAG_PADDING = 5;
	const LABEL_OFFSET = 4;
	const plotRight = $derived(ctx.marginLeft + ctx.plotWidth);
	const tagHeight = $derived(ctx.tagHeight);
</script>

<!-- Dashed lines mark levels, since they are thresholds rather than data; each gets a price tag on the axis. -->
<g class="candlestickChartLevels">
	{#each ctx.levelTags as level (level.position)}
		<g style:--candlestick-chart-series-color={level.color}>
			{#if level.placement === "inside"}
				<line class="candlestickChartLevelLine" x1={ctx.marginLeft} x2={plotRight} y1={level.lineY} y2={level.lineY} data-last={level.isLast || undefined} />
				{#if level.label}
					<text class="candlestickChartLevelLabel" x={ctx.marginLeft + LABEL_OFFSET} y={level.lineY - LABEL_OFFSET}>{level.label}</text>
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
