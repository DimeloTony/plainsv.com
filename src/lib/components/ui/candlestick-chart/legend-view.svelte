<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	import type { LegendProps } from "./index.js";
	const { position = "top", overflow = "wrap", variant, size, rounded, class: className, ...props }: LegendProps = $props();
	const ctx = useCompCtx();
	// Space in pixels between the overlay legend and the plot's corner.
	const OVERLAY_INSET = 4;
	// Overlay positions float in the plot and get the backdrop unless a variant is set.
	const isOverlay = $derived(position === "overlay" || position === "overlayBottom");

	/** Keeps presses on the overlay legend from starting a drag on the plot, whose pointer capture would swallow the click. */
	const stopPlotGesture = (e: Event) => e.stopPropagation();
</script>

<!-- Legend; each button hides or shows its indicator or group, which keeps its color either way. -->
<!-- The fade class stays on, since its fades only show while a scrolling legend overflows. -->
<!-- The overlay legend sits inside the plot, so it stops the plot's drag, zoom, and reset gestures from starting on it. -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<ul class={["candlestickChartLegend scroll-fade-x", className]} aria-label="Legend" data-position={position} data-overflow={overflow} data-variant={variant ?? (isOverlay ? "card" : "default")} data-size={size} data-rounded={rounded} style:--candlestick-chart-legend-top="{ctx.marginTop + OVERLAY_INSET + ctx.infoHeight}px" style:--candlestick-chart-legend-bottom="{ctx.height - ctx.marginTop - ctx.priceHeight + OVERLAY_INSET}px" style:--candlestick-chart-legend-left="{ctx.marginLeft + OVERLAY_INSET}px" style:--candlestick-chart-legend-width="{Math.max(0, ctx.plotWidth - OVERLAY_INSET * 2)}px" onpointerdown={isOverlay ? stopPlotGesture : undefined} ondblclick={isOverlay ? stopPlotGesture : undefined} onkeydown={isOverlay ? stopPlotGesture : undefined} {...props}>
	{#each ctx.series as item (item.label)}
		{@const isShown = !ctx.hidden.includes(item.label)}
		<li>
			<button type="button" class="candlestickChartLegendButton" aria-pressed={isShown} onclick={() => ctx.toggleIndicator(item.label)}>
				<span class="candlestickChartLegendKey" data-hidden={!isShown || undefined} style:--candlestick-chart-series-color={item.color}></span>
				{item.label}
			</button>
		</li>
	{/each}
	{#if ctx.series.length && ctx.groups.length}
		<li class="candlestickChartLegendDivider" aria-hidden="true"></li>
	{/if}
	{#each ctx.groups as group (group.name)}
		{@const isShown = !ctx.hiddenGroups.includes(group.name)}
		<li>
			<button type="button" class="candlestickChartLegendButton" aria-pressed={isShown} onclick={() => ctx.toggleGroup(group.name)}>
				<span class="candlestickChartLegendKey" data-type={group.type} data-hidden={!isShown || undefined} style:--candlestick-chart-series-color={group.color}></span>
				{group.name}
			</button>
		</li>
	{/each}
</ul>

<style>
	/* Base legend, one left-aligned row */
	.candlestickChartLegend {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--spacing-xs) var(--spacing-md);
		margin: 0;
		border-bottom: 1px solid var(--border);
		padding: 0 0 var(--spacing-sm) 0;
		list-style: none;
	}

	.candlestickChartLegendButton {
		display: inline-flex;
		align-items: center;
		gap: calc(var(--spacing-xs) * 1.5); /* 6px */
		transition-duration: 150ms;
		transition-property: color, background-color, box-shadow;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		cursor: pointer;
		border-radius: var(--candlestick-chart-inner-radius);
		padding: calc(var(--spacing-xs) / 2) var(--spacing-xs);
		color: inherit;
	}

	/* Line key, matching the indicator line */
	.candlestickChartLegendKey {
		flex-shrink: 0;
		border-radius: var(--radius-pill);
		background-color: var(--candlestick-chart-series-color);
		width: 0.875rem; /* 14px */
		height: 2px;
	}

	/* Thin line between the indicators and the groups */
	.candlestickChartLegendDivider {
		align-self: stretch;
		background-color: var(--border);
		width: 1px;
	}

	/* =============== Variants =============== */

	/* Floats in the plot's top-left corner, so it takes no space */
	.candlestickChartLegend:is([data-position="overlay"], [data-position="overlayBottom"]) {
		position: absolute;
		top: var(--candlestick-chart-legend-top);
		left: var(--candlestick-chart-legend-left);
		z-index: 1;
		cursor: default;
		max-width: var(--candlestick-chart-legend-width);
	}

	/* Floats in the price pane's bottom-left corner, above the volume pane */
	.candlestickChartLegend[data-position="overlayBottom"] {
		top: auto;
		bottom: var(--candlestick-chart-legend-bottom);
	}

	/* Below the plot: the divider moves to the top */
	.candlestickChartLegend[data-position="bottom"] {
		border-top: 1px solid var(--border);
		border-bottom: none;
		padding: var(--spacing-sm) 0 0 0;
	}

	/* Soft blurred backdrop in place of the divider, so the candles stay readable under an overlay legend */
	.candlestickChartLegend[data-variant="card"] {
		backdrop-filter: blur(4px);
		border: none;
		border-radius: var(--candlestick-chart-radius);
		background-color: color-mix(in oklab, var(--background) 75%, transparent);
		padding: calc(var(--spacing-xs) / 2);
	}

	/* A plain row floating in the plot drops the divider, since there is nothing under it to divide from */
	.candlestickChartLegend[data-variant="default"]:is([data-position="overlay"], [data-position="overlayBottom"]) {
		border: none;
		padding: 0;
	}

	/* Filled box in the secondary color */
	.candlestickChartLegend[data-variant="secondary"] {
		border: none;
		border-radius: var(--candlestick-chart-radius);
		background-color: var(--secondary);
		padding: calc(var(--spacing-xs) / 2);
		color: var(--secondary-foreground);
	}

	/* Bordered box on the page background, opaque so candles never show through */
	.candlestickChartLegend[data-variant="outline"] {
		border: 1px solid var(--border);
		border-radius: var(--candlestick-chart-radius);
		background-color: var(--background);
		padding: calc(var(--spacing-xs) / 2);
	}

	/* No box and no divider; the buttons fill softly on hover instead */
	.candlestickChartLegend[data-variant="ghost"] {
		border: none;
		padding: 0;
	}

	/* Without the divider's padding, a legend above or below the plot keeps a gap from it */
	.candlestickChartLegend[data-position="top"]:not([data-variant="default"]) {
		margin-bottom: var(--spacing-sm);
	}

	.candlestickChartLegend[data-position="bottom"]:not([data-variant="default"]) {
		margin-top: var(--spacing-sm);
	}

	/* One row that scrolls sideways; the edge fades show there is more, so the scrollbar hides, and the padding keeps focus rings inside the scroll box */
	.candlestickChartLegend[data-overflow="scroll"] {
		flex-wrap: nowrap;
		padding-top: var(--spacing-xs);
		padding-inline: var(--spacing-xs);
		overflow-x: auto;
		overscroll-behavior-x: contain;
		scrollbar-width: none;
	}

	.candlestickChartLegend[data-overflow="scroll"]::-webkit-scrollbar {
		display: none;
	}

	.candlestickChartLegend:is([data-variant="card"], [data-variant="secondary"], [data-variant="outline"])[data-overflow="scroll"] {
		padding-bottom: var(--spacing-xs);
	}

	/* Buttons keep their width and stay on one line, so the row scrolls instead of squeezing them */
	.candlestickChartLegend[data-overflow="scroll"] > li {
		flex-shrink: 0;
	}

	.candlestickChartLegend[data-overflow="scroll"] .candlestickChartLegendButton {
		white-space: nowrap;
	}

	/* Dashed key for a level group, matching the level lines */
	.candlestickChartLegendKey[data-type="level"] {
		border-top: 2px dashed var(--candlestick-chart-series-color);
		border-radius: 0;
		background-color: transparent;
		height: 0;
	}

	/* Dot key for a marker group */
	.candlestickChartLegendKey[data-type="marker"] {
		width: 0.5rem; /* 8px */
		height: 0.5rem; /* 8px */
	}

	/* =============== States =============== */

	.candlestickChartLegendButton:hover {
		color: var(--muted-foreground);
	}

	/* Ghost and outline buttons fill on hover, like their shadcn buttons */
	.candlestickChartLegend:is([data-variant="ghost"], [data-variant="outline"]) .candlestickChartLegendButton:hover {
		background-color: var(--accent);
		color: var(--accent-foreground);
	}

	/* A tint of the text color, since the accent can match the secondary fill */
	.candlestickChartLegend[data-variant="secondary"] .candlestickChartLegendButton:hover {
		background-color: color-mix(in oklab, var(--secondary-foreground) 10%, transparent);
		color: var(--secondary-foreground);
	}

	/* Hidden indicator or group: faded key and muted text */
	.candlestickChartLegendButton[aria-pressed="false"] {
		color: var(--muted-foreground);
	}

	.candlestickChartLegendKey[data-hidden] {
		background-color: color-mix(in oklab, var(--candlestick-chart-series-color) 35%, transparent);
	}

	.candlestickChartLegendKey[data-type="level"][data-hidden] {
		border-top-color: color-mix(in oklab, var(--candlestick-chart-series-color) 35%, transparent);
		background-color: transparent;
	}

	/* Keyboard focus ring */
	.candlestickChartLegendButton:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
	}

	/* =============== Sizes =============== */

	/* Large: the box at the large radius and the buttons one step smaller */
	.candlestickChartLegend[data-size="lg"] {
		gap: var(--spacing-xs) var(--spacing-lg);
		border-radius: var(--radius-lg);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	.candlestickChartLegend[data-size="lg"] .candlestickChartLegendButton {
		border-radius: var(--radius-md);
		padding: var(--spacing-xs) var(--spacing-sm);
	}

	/* Medium */
	.candlestickChartLegend[data-size="md"] {
		gap: var(--spacing-xs) var(--spacing-md);
		border-radius: var(--radius-md);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	.candlestickChartLegend[data-size="md"] .candlestickChartLegendButton {
		border-radius: var(--radius-sm);
		padding: calc(var(--spacing-xs) / 2) var(--spacing-xs);
	}

	/* Small */
	.candlestickChartLegend[data-size="sm"] {
		gap: var(--spacing-xs) var(--spacing-sm);
		border-radius: var(--radius-sm);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	.candlestickChartLegend[data-size="sm"] .candlestickChartLegendButton {
		border-radius: var(--radius-xs);
		padding: calc(var(--spacing-xs) / 2) var(--spacing-xs);
	}

	/* Extra small */
	.candlestickChartLegend[data-size="xs"] {
		gap: calc(var(--spacing-xs) / 2) var(--spacing-xs);
		border-radius: var(--radius-xs);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	.candlestickChartLegend[data-size="xs"] .candlestickChartLegendButton {
		border-radius: var(--radius-xs);
		padding: 0 calc(var(--spacing-xs) / 2);
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius with this exact value, and rounds the buttons one step smaller; must stay after the size rules */
	.candlestickChartLegend[data-rounded="xs"] {
		border-radius: var(--radius-xs);
	}

	.candlestickChartLegend[data-rounded="xs"] .candlestickChartLegendButton {
		border-radius: var(--radius-xs);
	}

	.candlestickChartLegend[data-rounded="sm"] {
		border-radius: var(--radius-sm);
	}

	.candlestickChartLegend[data-rounded="sm"] .candlestickChartLegendButton {
		border-radius: var(--radius-xs);
	}

	.candlestickChartLegend[data-rounded="md"] {
		border-radius: var(--radius-md);
	}

	.candlestickChartLegend[data-rounded="md"] .candlestickChartLegendButton {
		border-radius: var(--radius-sm);
	}

	.candlestickChartLegend[data-rounded="lg"] {
		border-radius: var(--radius-lg);
	}

	.candlestickChartLegend[data-rounded="lg"] .candlestickChartLegendButton {
		border-radius: var(--radius-md);
	}

	.candlestickChartLegend[data-rounded="xl"] {
		border-radius: var(--radius-xl);
	}

	.candlestickChartLegend[data-rounded="xl"] .candlestickChartLegendButton {
		border-radius: var(--radius-lg);
	}

	.candlestickChartLegend[data-rounded="2xl"] {
		border-radius: var(--radius-2xl);
	}

	.candlestickChartLegend[data-rounded="2xl"] .candlestickChartLegendButton {
		border-radius: var(--radius-xl);
	}

	.candlestickChartLegend[data-rounded="3xl"] {
		border-radius: var(--radius-3xl);
	}

	.candlestickChartLegend[data-rounded="3xl"] .candlestickChartLegendButton {
		border-radius: var(--radius-2xl);
	}

	.candlestickChartLegend[data-rounded="4xl"] {
		border-radius: var(--radius-4xl);
	}

	.candlestickChartLegend[data-rounded="4xl"] .candlestickChartLegendButton {
		border-radius: var(--radius-3xl);
	}

	/* A pill legend keeps pill buttons */
	.candlestickChartLegend[data-rounded="pill"],
	.candlestickChartLegend[data-rounded="pill"] .candlestickChartLegendButton {
		border-radius: var(--radius-pill);
	}
</style>
