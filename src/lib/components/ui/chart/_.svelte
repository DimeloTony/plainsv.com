<script lang="ts" generics="T extends object">
	import Axes from "./axes.svelte";
	import Bars from "./bars.svelte";
	import Lines from "./lines.svelte";
	import Pie from "./pie.svelte";
	import Radar from "./radar.svelte";
	import Radial from "./radial.svelte";
	import Tooltip from "./tooltip.svelte";
	import Legend from "./legend.svelte";
	import Table from "./table.svelte";
	import { setCompCtx, SERIES_COLORS } from "./ctx.svelte.js";
	import type { Props, ChartSeries } from "./index.js";
	import type { CompCtxProps } from "./ctx.svelte.js";
	let { data, index, config, categories = {}, type = "bar", stacked = false, orientation = "vertical", curve = "linear", dots = false, gradient = false, legend, table = false, hiddenSeries = $bindable([]), onHiddenSeriesChange, formatValue, formatIndex, tooltip, center, label = "Chart", size = "md", rounded = "xs", class: className, ...props }: Props<T> = $props();
	// Read the config by string key; the generic type only checks the keys against the data.
	const seriesConfig: Partial<Record<string, ChartSeries>> = $derived(config);
	const series = $derived(Object.entries(seriesConfig).map(([key, item], position) => ({ key, label: item?.label ?? key, color: item?.color ?? SERIES_COLORS[position] ?? "var(--muted-foreground)" })));
	const contextData: Omit<CompCtxProps, "hidden"> = $derived({ data, index, series, categories, type, stacked, orientation, curve, dots, gradient, formatValue, formatIndex, tooltip, onHiddenSeriesChange });
	const ctx = setCompCtx({ ...contextData, hidden: hiddenSeries });
	// A single series or slice needs no legend, since the chart's title already names it.
	const showLegend = $derived(legend ?? ctx.legendItems.length > 1);
	// Read out the focused row while the keyboard drives the tooltip; pointer hovers stay quiet.
	const announcement = $derived(
		ctx.activeIndex >= 0 && !ctx.pointer
			? `${ctx.rows[ctx.activeIndex]?.label}: ${ctx
					.getTooltipItems(ctx.activeIndex)
					.map((item) => `${item.label} ${item.formattedValue}`)
					.join(", ")}`
			: "",
	);
	let probe: HTMLSpanElement | undefined = $state();

	// Keep the shared settings in sync when the props change.
	$effect.pre(() => void Object.assign(ctx, contextData));

	// Keep the bindable prop and the shared hidden series in sync in both directions.
	$effect.pre(() => {
		ctx.hidden = hiddenSeries;
	});
	$effect.pre(() => {
		hiddenSeries = ctx.hidden;
	});

	// Read the axis text size and bar radius from CSS, so they follow `size`, `rounded`, and the theme tokens.
	$effect(() => {
		void [size, rounded];
		// If the probe is not mounted yet: wait for it.
		if (!probe) return;
		const style = getComputedStyle(probe);
		ctx.fontSize = parseFloat(style.fontSize) || 12;
		ctx.barRadius = parseFloat(style.borderTopLeftRadius) || 0;
	});

	/** Hovers the row under the pointer. */
	const handlePointer = (e: PointerEvent & { currentTarget: EventTarget & HTMLDivElement }) => {
		const box = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - box.left;
		const y = e.clientY - box.top;
		ctx.pointer = { x, y };
		ctx.activeIndex = ctx.indexAt(x, y);
	};

	/** Clears the hover when the pointer leaves, unless the keyboard is reading the chart. */
	const handlePointerLeave = () => {
		// If the keyboard drives the tooltip: keep it.
		if (!ctx.pointer) return;
		ctx.pointer = null;
		ctx.activeIndex = -1;
	};

	/** Moves between the visible rows with the arrows, Home, and End, and hides the tooltip with Escape. */
	const handleKeydown = (e: KeyboardEvent) => {
		const rows = ctx.visibleRows;
		const position = rows.indexOf(ctx.activeIndex);
		const keyPositions: Record<string, number> = { ArrowRight: position + 1, ArrowDown: position + 1, ArrowLeft: position - 1, ArrowUp: position - 1, Home: 0, End: rows.length - 1 };
		// If Escape was pressed: hide the tooltip.
		if (e.key === "Escape") {
			ctx.activeIndex = -1;
			return;
		}
		// If the key does not move between rows, or none are shown: leave it alone.
		if (!(e.key in keyPositions) || !rows.length) return;
		e.preventDefault();
		ctx.moveActive(rows[Math.min(rows.length - 1, Math.max(0, keyPositions[e.key]))]);
	};

	/** Shows the first visible row when the plot gets keyboard focus. */
	const handleFocus = () => {
		// If a row is already active, such as from a click, or none are shown: leave it.
		if (ctx.activeIndex >= 0 || !ctx.visibleRows.length) return;
		ctx.moveActive(ctx.visibleRows[0]);
	};

	/** Hides the tooltip when focus leaves the plot. */
	const handleBlur = () => {
		ctx.pointer = null;
		ctx.activeIndex = -1;
	};
</script>

<!-- Chart figure: the plot, then the legend and the data table. -->
<figure class={["chart not-typeset", className]} data-type={type} data-orientation={type === "bar" ? orientation : undefined} data-size={size} data-rounded={rounded} {...props}>
	<!-- Plot; focus it and use the arrows to read each row. -->
	<!-- A focusable chart that reads rows with the arrow keys is interactive, which this check does not know. -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
	<div class="chartPlot" role="group" aria-roledescription="chart" aria-label={label} tabindex="0" bind:clientWidth={ctx.width} bind:clientHeight={ctx.height} onpointermove={handlePointer} onpointerdown={handlePointer} onpointerleave={handlePointerLeave} onkeydown={handleKeydown} onfocus={handleFocus} onblur={handleBlur}>
		{#if ctx.width > 0 && ctx.height > 0}
			<svg class="chartSvg" width={ctx.width} height={ctx.height} viewBox="0 0 {ctx.width} {ctx.height}" aria-hidden="true">
				{#if type === "pie" || type === "donut"}
					<Pie />
				{:else if type === "radial"}
					<Radial />
				{:else if type === "radar"}
					<Radar />
				{:else}
					<Axes />
					{#if type === "bar"}
						<Bars />
					{:else}
						<Lines />
					{/if}
				{/if}
			</svg>
		{/if}
		<!-- Content in the donut's hole, such as the total. -->
		{#if type === "donut" && center && ctx.width > 0}
			<div class="chartCenter" style:--chart-center-x="{ctx.centerX}px" style:--chart-center-y="{ctx.centerY}px" style:--chart-center-size="{ctx.holeRadius * 2}px">
				{@render center({ total: ctx.total, formattedTotal: ctx.formatFull(ctx.total) })}
			</div>
		{/if}
		{#if ctx.activeIndex >= 0}
			<Tooltip />
		{/if}
		<!-- Hidden probe that resolves the axis text size and bar radius tokens to pixels. -->
		<span class="chartProbe" bind:this={probe} aria-hidden="true"></span>
	</div>

	{#if showLegend}
		<Legend />
	{/if}
	<Table visible={table} />
	<span class="chartAnnouncement" aria-live="polite">{announcement}</span>
</figure>

<style>
	/* Base chart; the plot takes the full width */
	.chart {
		display: flex;
		position: relative;
		flex-direction: column;
		gap: var(--spacing-md);
		margin: 0;
		min-width: 0;
		color: var(--foreground);
	}

	/* Plot area; its height comes from `--chart-height`, which `size` sets */
	.chartPlot {
		position: relative;
		outline: none;
		border-radius: var(--radius-sm);
		height: var(--chart-height);
		touch-action: pan-y;
	}

	/* Keyboard focus ring */
	.chartPlot:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
	}

	.chartSvg {
		display: block;
		overflow: visible;
		font-variant-numeric: tabular-nums;
	}

	/* Donut hole content, centered and sized to the hole; the tooltip draws above it */
	.chartCenter {
		display: flex;
		position: absolute;
		top: calc(var(--chart-center-y) - var(--chart-center-size) / 2);
		left: calc(var(--chart-center-x) - var(--chart-center-size) / 2);
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-radius: var(--radius-pill);
		width: var(--chart-center-size);
		height: var(--chart-center-size);
		pointer-events: none;
		text-align: center;
	}

	/* Hidden element measured for the axis text size and bar radius */
	.chartProbe {
		position: absolute;
		visibility: hidden;
		border-radius: var(--chart-bar-radius);
		width: 0;
		height: 0;
		pointer-events: none;
	}

	/* Read by screen readers only */
	.chartAnnouncement {
		position: absolute;
		clip-path: inset(50%);
		width: 1px;
		height: 1px;
		overflow: hidden;
		white-space: nowrap;
	}

	/* =============== Sizes =============== */

	/* Large */
	.chart[data-size="lg"] {
		--chart-height: 20rem; /* 320px */
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Medium — default */
	.chart[data-size="md"] {
		--chart-height: 16rem; /* 256px */
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* Small */
	.chart[data-size="sm"] {
		--chart-height: 12rem; /* 192px */
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* Extra small */
	.chart[data-size="xs"] {
		--chart-height: 8rem; /* 128px */
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* =============== Rounded =============== */

	/* Radius of each bar's end, read by the probe; ends never round past half the bar's thickness */
	.chart[data-rounded="xs"] {
		--chart-bar-radius: var(--radius-xs);
	}

	.chart[data-rounded="sm"] {
		--chart-bar-radius: var(--radius-sm);
	}

	.chart[data-rounded="md"] {
		--chart-bar-radius: var(--radius-md);
	}

	.chart[data-rounded="lg"] {
		--chart-bar-radius: var(--radius-lg);
	}

	.chart[data-rounded="xl"] {
		--chart-bar-radius: var(--radius-xl);
	}

	.chart[data-rounded="2xl"] {
		--chart-bar-radius: var(--radius-2xl);
	}

	.chart[data-rounded="3xl"] {
		--chart-bar-radius: var(--radius-3xl);
	}

	.chart[data-rounded="4xl"] {
		--chart-bar-radius: var(--radius-4xl);
	}

	.chart[data-rounded="pill"] {
		--chart-bar-radius: var(--radius-pill);
	}
</style>
