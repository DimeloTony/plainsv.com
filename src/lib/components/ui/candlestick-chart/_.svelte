<script lang="ts">
	import Axes from "./axes.svelte";
	import Sessions from "./sessions.svelte";
	import Candles from "./candles.svelte";
	import Volume from "./volume.svelte";
	import Overlays from "./overlays.svelte";
	import Levels from "./levels.svelte";
	import Crosshair from "./crosshair.svelte";
	import Tooltip from "./tooltip.svelte";
	import Legend from "./legend.svelte";
	import Table from "./table.svelte";
	import { untrack } from "svelte";
	import { setCompCtx } from "./ctx.svelte.js";
	import type { Attachment } from "svelte/attachments";
	import type { Props } from "./index.js";
	import type { CompCtxProps } from "./ctx.svelte.js";
	let { data, levels = [], indicators = [], sessions = [], highlights = [], timeZone = "", volume, range = $bindable(), onRangeChange, hiddenIndicators = $bindable([]), onHiddenIndicatorsChange, variant = "solid", scale = "linear", grid = true, lastPrice = true, size = "md", formatPrice, formatTime, formatVolume, tooltip, legend, table = false, label = "Candlestick chart", class: className, ...props }: Props = $props();
	// Pixels a pointer must move before a press becomes a drag, so clicks still click.
	const DRAG_THRESHOLD = 3;
	// Zoom speed for the wheel and the keyboard.
	const WHEEL_ZOOM_SPEED = 0.002;
	const KEY_ZOOM_FACTOR = 1.25;
	// Share of the visible candles a Shift + arrow pans.
	const KEY_PAN_SHARE = 0.1;
	const clipId = $props.id();
	const showVolume = $derived(volume ?? data.some((candle) => typeof candle.volume === "number"));
	const contextData: Omit<CompCtxProps, "range" | "hidden"> = $derived({ data, levels, indicators, sessions, highlights, timeZone, scale, grid, lastPrice, showVolume, variant, formatPrice, formatTime, formatVolume, tooltip, onRangeChange, onHiddenIndicatorsChange });
	const ctx = setCompCtx({ ...contextData, range: range ?? null, hidden: hiddenIndicators });
	const showLegend = $derived(legend ?? indicators.length > 0);
	// Read out the focused candle while the keyboard drives the tooltip; pointer hovers stay quiet.
	const announcement = $derived.by(() => {
		const candle = data[ctx.activeIndex];
		// If no candle is active or the pointer drives the tooltip: say nothing.
		if (!candle || ctx.pointer) return "";
		const { changePercent } = ctx.getChange(ctx.activeIndex);
		return `${ctx.formatCandleTime(ctx.activeIndex)}: open ${ctx.formatPriceValue(candle.open)}, high ${ctx.formatPriceValue(candle.high)}, low ${ctx.formatPriceValue(candle.low)}, close ${ctx.formatPriceValue(candle.close)}, ${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(2)}%`;
	});
	let probe: HTMLSpanElement | undefined = $state();
	// Pointers pressed on the plot, and where the drag or pinch started.
	const pointers = new Map<number, number>();
	let drag: { x: number; start: number; count: number; hasMoved: boolean } | null = null;
	let pinch: { distance: number; start: number; count: number; anchorX: number } | null = null;

	// Keep the shared settings in sync when the props change.
	$effect.pre(() => void Object.assign(ctx, contextData));

	// Keep the bindable props and the shared state in sync in both directions.
	$effect.pre(() => {
		ctx.range = range ?? null;
	});
	$effect.pre(() => {
		range = ctx.range ?? undefined;
	});
	$effect.pre(() => {
		ctx.hidden = hiddenIndicators;
	});
	$effect.pre(() => {
		hiddenIndicators = ctx.hidden;
	});

	// Follow live data: when candles arrive while the view reaches the newest one, slide the view with them.
	let previousLength = untrack(() => data.length);
	$effect.pre(() => {
		const length = data.length;
		untrack(() => {
			const added = length - previousLength;
			// If candles were added and a zoomed view sat at the right edge: keep the newest candle in view.
			if (added > 0 && ctx.range && ctx.range[1] >= previousLength - 0.5) ctx.setRange(ctx.range[0] + added, ctx.visibleCount);
			previousLength = length;
		});
	});

	// Read the axis text size from CSS, so it follows `size` and the theme tokens.
	$effect(() => {
		void size;
		// If the probe is not mounted yet: wait for it.
		if (!probe) return;
		ctx.fontSize = parseFloat(getComputedStyle(probe).fontSize) || 12;
	});

	/** Zooms with Ctrl or ⌘ and the wheel or a trackpad pinch, and pans with Shift or a sideways wheel; a plain wheel still scrolls the page. */
	const handleWheel: Attachment<HTMLDivElement> = (node) => {
		/** Zooms or pans, and stops the page from scrolling only when it does. */
		const handle = (e: WheelEvent) => {
			const box = node.getBoundingClientRect();
			// If Ctrl or ⌘ is held, which trackpad pinches also send: zoom around the pointer.
			if (e.ctrlKey || e.metaKey) {
				e.preventDefault();
				ctx.zoom(Math.exp(e.deltaY * WHEEL_ZOOM_SPEED), e.clientX - box.left);
				return;
			}
			const sideways = e.shiftKey ? e.deltaX || e.deltaY : Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : 0;
			// If the wheel moves up and down without Shift: let the page scroll.
			if (!sideways) return;
			e.preventDefault();
			ctx.pan(sideways / (ctx.spacing || 1));
		};
		node.addEventListener("wheel", handle, { passive: false });
		return () => node.removeEventListener("wheel", handle);
	};

	/** Starts a drag with one pointer, or a pinch with two. */
	const handlePointerDown = (e: PointerEvent & { currentTarget: EventTarget & HTMLDivElement }) => {
		// If a mouse button other than the main one was pressed: ignore it.
		if (e.pointerType === "mouse" && e.button !== 0) return;
		e.currentTarget.setPointerCapture(e.pointerId);
		pointers.set(e.pointerId, e.clientX);
		const box = e.currentTarget.getBoundingClientRect();
		if (pointers.size === 1) drag = { x: e.clientX, start: ctx.view[0], count: ctx.visibleCount, hasMoved: false };
		else if (pointers.size === 2) {
			const [first, second] = [...pointers.values()];
			pinch = { distance: Math.abs(second - first) || 1, start: ctx.view[0], count: ctx.visibleCount, anchorX: (first + second) / 2 - box.left };
			drag = null;
		}
		updateHover(e);
	};

	/** Pans with a drag, zooms with a pinch, and otherwise moves the crosshair. */
	const handlePointerMove = (e: PointerEvent & { currentTarget: EventTarget & HTMLDivElement }) => {
		if (pointers.has(e.pointerId)) pointers.set(e.pointerId, e.clientX);
		// If two pointers pinch: zoom by the change in their distance, around where they started.
		if (pinch && pointers.size === 2) {
			const [first, second] = [...pointers.values()];
			ctx.isDragging = true;
			ctx.setRange(pinch.start, pinch.count);
			ctx.zoom(pinch.distance / (Math.abs(second - first) || 1), pinch.anchorX);
			return;
		}
		// If one pointer drags past the threshold: pan with it.
		if (drag && (drag.hasMoved || Math.abs(e.clientX - drag.x) >= DRAG_THRESHOLD)) {
			drag.hasMoved = true;
			ctx.isDragging = true;
			ctx.setRange(drag.start - (e.clientX - drag.x) / (ctx.spacing || 1), drag.count);
		}
		updateHover(e);
	};

	/** Ends the drag or pinch when a pointer lifts. */
	const handlePointerUp = (e: PointerEvent) => {
		pointers.delete(e.pointerId);
		if (pointers.size < 2) pinch = null;
		if (pointers.size === 0) {
			drag = null;
			ctx.isDragging = false;
		}
	};

	/** Moves the crosshair to the candle under the pointer. */
	function updateHover(e: PointerEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		const box = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - box.left;
		const y = e.clientY - box.top;
		ctx.pointer = { x, y };
		ctx.activeIndex = ctx.indexAt(x);
	}

	/** Clears the crosshair when the pointer leaves, unless the keyboard is reading the chart. */
	const handlePointerLeave = () => {
		// If the keyboard drives the tooltip, or a drag continues outside: keep it.
		if (!ctx.pointer || drag) return;
		ctx.pointer = null;
		ctx.activeIndex = -1;
	};

	/** Moves between candles, zooms, and pans from the keyboard. */
	const handleKeydown = (e: KeyboardEvent) => {
		const anchorX = ctx.activeIndex >= 0 ? ctx.x(ctx.activeIndex) : ctx.marginLeft + ctx.plotWidth / 2;
		const current = ctx.activeIndex >= 0 ? ctx.activeIndex : (ctx.visibleIndexes.at(-1) ?? 0);
		const isArrow = e.key === "ArrowLeft" || e.key === "ArrowRight";
		const direction = e.key === "ArrowLeft" ? -1 : 1;
		// If there are no candles: there is nothing to move to.
		if (!data.length) return;
		if (e.key === "Escape") ctx.activeIndex = -1;
		else if (e.key === "+" || e.key === "=") ctx.zoom(1 / KEY_ZOOM_FACTOR, anchorX);
		else if (e.key === "-" || e.key === "_") ctx.zoom(KEY_ZOOM_FACTOR, anchorX);
		else if (isArrow && e.shiftKey) ctx.pan(direction * Math.max(1, ctx.visibleCount * KEY_PAN_SHARE));
		else if (isArrow) ctx.moveActive(ctx.activeIndex >= 0 ? current + direction : current);
		else if (e.key === "Home") ctx.moveActive(0);
		else if (e.key === "End") ctx.moveActive(data.length - 1);
		else return;
		e.preventDefault();
	};

	/** Shows the latest visible candle when the plot gets keyboard focus. */
	const handleFocus = () => {
		// If a candle is already active, such as from a click, or there are none: leave it.
		if (ctx.activeIndex >= 0 || !ctx.visibleIndexes.length) return;
		ctx.moveActive(ctx.visibleIndexes.at(-1) ?? 0);
	};

	/** Hides the crosshair when focus leaves the plot. */
	const handleBlur = () => {
		ctx.pointer = null;
		ctx.activeIndex = -1;
	};
</script>

<!-- Candlestick chart: the indicator legend, the plot, and the table of visible candles. -->
<figure class={["candlestickChart not-typeset", className]} data-variant={variant} data-size={size} {...props}>
	{#if showLegend}
		<Legend />
	{/if}

	<!-- Plot; drag to pan, Ctrl or ⌘ and the wheel to zoom, and focus it to read candles with the arrows. -->
	<!-- A focusable chart that reads candles with the arrow keys is interactive, which this check does not know. -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
	<div class="candlestickChartPlot" role="group" aria-roledescription="candlestick chart" aria-label={label} tabindex="0" data-dragging={ctx.isDragging || undefined} bind:clientWidth={ctx.width} bind:clientHeight={ctx.height} {@attach handleWheel} onpointerdown={handlePointerDown} onpointermove={handlePointerMove} onpointerup={handlePointerUp} onpointercancel={handlePointerUp} onpointerleave={handlePointerLeave} ondblclick={() => ctx.resetRange()} onkeydown={handleKeydown} onfocus={handleFocus} onblur={handleBlur}>
		{#if ctx.width > 0 && ctx.height > 0}
			<svg class="candlestickChartSvg" width={ctx.width} height={ctx.height} viewBox="0 0 {ctx.width} {ctx.height}" aria-hidden="true">
				<defs>
					<clipPath id={clipId}>
						<rect x={ctx.marginLeft} y={ctx.marginTop} width={ctx.plotWidth} height={ctx.panesHeight} />
					</clipPath>
				</defs>
				<Axes />
				<!-- Marks clip to the panes, so candles at the edges stop at the axis. -->
				<g clip-path="url(#{clipId})">
					<Sessions />
					{#if showVolume}
						<Volume />
					{/if}
					<Overlays />
					<Candles />
				</g>
				<Levels />
				<Crosshair />
			</svg>
		{/if}
		{#if ctx.activeIndex >= 0 && !ctx.isDragging}
			<Tooltip />
		{/if}
		<!-- Hidden probe that resolves the axis text size token to pixels. -->
		<span class="candlestickChartProbe" bind:this={probe} aria-hidden="true"></span>
	</div>

	<Table visible={table} />
	<span class="candlestickChartAnnouncement" aria-live="polite">{announcement}</span>
</figure>

<style>
	/* Base chart; the plot takes the full width */
	.candlestickChart {
		display: flex;
		position: relative;
		flex-direction: column;
		gap: var(--spacing-sm);
		margin: 0;
		min-width: 0;
		color: var(--foreground);
	}

	/* Plot area; its height comes from `--candlestick-chart-height`, which `size` sets */
	.candlestickChartPlot {
		position: relative;
		cursor: crosshair;
		outline: none;
		border-radius: var(--radius-sm);
		height: var(--candlestick-chart-height);
		touch-action: pan-y;
		user-select: none;
	}

	.candlestickChartSvg {
		display: block;
		overflow: visible;
		font-variant-numeric: tabular-nums;
	}

	/* Hidden element measured for the axis text size */
	.candlestickChartProbe {
		position: absolute;
		visibility: hidden;
		width: 0;
		height: 0;
		pointer-events: none;
	}

	/* Read by screen readers only */
	.candlestickChartAnnouncement {
		position: absolute;
		clip-path: inset(50%);
		width: 1px;
		height: 1px;
		overflow: hidden;
		white-space: nowrap;
	}

	/* =============== States =============== */

	/* Grabbing hand while a drag pans the chart */
	.candlestickChartPlot[data-dragging] {
		cursor: grabbing;
	}

	/* Keyboard focus ring */
	.candlestickChartPlot:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
	}

	/* =============== Sizes =============== */

	/* Large */
	.candlestickChart[data-size="lg"] {
		--candlestick-chart-height: 30rem; /* 480px */
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Medium — default */
	.candlestickChart[data-size="md"] {
		--candlestick-chart-height: 24rem; /* 384px */
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* Small */
	.candlestickChart[data-size="sm"] {
		--candlestick-chart-height: 18rem; /* 288px */
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* Extra small */
	.candlestickChart[data-size="xs"] {
		--candlestick-chart-height: 14rem; /* 224px */
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}
</style>
