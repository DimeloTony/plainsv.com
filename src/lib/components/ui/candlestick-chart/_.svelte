<script lang="ts">
	import Axes from "./axes.svelte";
	import Sessions from "./sessions.svelte";
	import Candles from "./candles.svelte";
	import Volume from "./volume.svelte";
	import Overlays from "./overlays.svelte";
	import Levels from "./levels.svelte";
	import Markers from "./markers.svelte";
	import LevelLines from "./level-lines.svelte";
	import Positions from "./positions.svelte";
	import PositionHandles from "./position-handles.svelte";
	import Crosshair from "./crosshair.svelte";
	import TooltipView from "./tooltip-view.svelte";
	import InfoView from "./info-view.svelte";
	import LegendView from "./legend-view.svelte";
	import PriceAxis from "./price-axis.svelte";
	import Table from "./table.svelte";
	import { untrack } from "svelte";
	import { setCompCtx } from "./ctx.svelte.js";
	import type { Attachment } from "svelte/attachments";
	import type { Props } from "./index.js";
	import type { CompCtxProps } from "./ctx.svelte.js";
	let { data, levels = [], level, indicators = [], markers = [], marker, positions = $bindable([]), onPositionsChange, onPositionCancel, onPositionConfirm, confirmCancel = true, priceStep = 0.01, sessions = [], highlights = [], timeZone = "", volume, range = $bindable(), onRangeChange, gestures = "page", ready = $bindable(false), onReadyChange, hiddenIndicators = $bindable([]), onHiddenIndicatorsChange, hiddenGroups = $bindable([]), onHiddenGroupsChange, variant = "solid", scale = "linear", grid = true, lastPrice = true, size = "md", formatPrice, formatTime, formatVolume, table = false, label = "Candlestick chart", children, class: className, ...props }: Props = $props();
	// Pixels a pointer must move before a press becomes a drag, so clicks still click.
	const DRAG_THRESHOLD = 3;
	// Milliseconds a finger must hold still before it reads candles, long enough that a slow drag still pans, and pixels it may jitter meanwhile before it pans instead.
	const LONG_PRESS_DELAY = 300;
	const TOUCH_SLOP = 8;
	// Zoom speed for the wheel and the keyboard.
	const WHEEL_ZOOM_SPEED = 0.002;
	const KEY_ZOOM_FACTOR = 1.25;
	// Share of the visible candles a Shift + arrow pans.
	const KEY_PAN_SHARE = 0.1;
	// Share of the price pane a Shift + up or down arrow moves the prices.
	const KEY_PRICE_PAN_SHARE = 0.1;
	const clipId = $props.id();
	const showVolume = $derived(volume ?? data.some((candle) => typeof candle.volume === "number"));
	const contextData: Omit<CompCtxProps, "range" | "hidden" | "hiddenGroups" | "positions"> = $derived({ data, levels, level, indicators, markers, marker, onPositionsChange, onPositionCancel, onPositionConfirm, confirmCancel, priceStep, sessions, highlights, timeZone, scale, grid, lastPrice, showVolume, variant, formatPrice, formatTime, formatVolume, onRangeChange, onHiddenIndicatorsChange, onHiddenGroupsChange });
	const ctx = setCompCtx({ ...contextData, range: range ?? null, hidden: hiddenIndicators, hiddenGroups, positions });
	// The chart shows only the parts passed as children, so a part left out is hidden.
	const tooltipSettings = $derived(ctx.tooltipPart);
	const infoSettings = $derived(ctx.infoPart);
	const legendSettings = $derived(ctx.legendPart);
	const legendPosition = $derived(legendSettings?.position ?? "top");
	// The legend shows only when it has indicators or groups to toggle.
	const hasLegendItems = $derived(indicators.length > 0 || ctx.groups.length > 0);
	// Read out the focused candle while the keyboard drives the tooltip; pointer hovers stay quiet.
	const announcement = $derived.by(() => {
		const candle = data[ctx.activeIndex];
		// If no candle is active or the pointer drives the tooltip: say nothing.
		if (!candle || ctx.pointer) return "";
		const { changePercent } = ctx.getChange(ctx.activeIndex);
		const markerNames = ctx.getMarkers(ctx.activeIndex).map((item) => item.name);
		return `${ctx.formatCandleTime(ctx.activeIndex)}: open ${ctx.formatPriceValue(candle.open)}, high ${ctx.formatPriceValue(candle.high)}, low ${ctx.formatPriceValue(candle.low)}, close ${ctx.formatPriceValue(candle.close)}, ${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(2)}%${markerNames.length ? `, ${markerNames.join(", ")}` : ""}`;
	});
	let probe: HTMLSpanElement | undefined = $state();
	// Whether the axis text size has been read, so the plot draws once at its real size instead of jumping from the fallback.
	let isMeasured = $state(false);
	// Ready once the plot is measured and has candles to draw.
	const isReady = $derived(isMeasured && ctx.width > 0 && ctx.height > 0 && data.length > 0);
	// Pointers pressed on the plot, and where the drag or pinch started.
	const pointers = new Map<number, { x: number; y: number }>();
	let drag: { x: number; y: number; start: number; count: number; offset: number; hasMoved: boolean } | null = null;
	let pinch: { distance: number; start: number; count: number; anchorX: number } | null = null;
	// Long press on touch: its timer, the finger's latest position, and whether the held finger reads candles instead of panning.
	let pressTimer: ReturnType<typeof setTimeout> | undefined;
	let touchPoint = { x: 0, y: 0 };
	let isInspecting = false;
	// Drag and pinch updates wait for the next frame, so a burst of move events renders once per frame.
	let frame = 0;
	let pendingMove: (() => void) | null = null;

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
	$effect.pre(() => {
		ctx.hiddenGroups = hiddenGroups;
	});
	$effect.pre(() => {
		hiddenGroups = ctx.hiddenGroups;
	});
	$effect.pre(() => {
		ctx.positions = positions;
	});
	$effect.pre(() => {
		positions = ctx.positions;
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
		isMeasured = true;
	});

	// Report readiness through `bind:ready` and `onReadyChange`, only when it changes; turning ready waits for two frames, so the chart, its info, and its legend have painted before a loader over them hides.
	$effect(() => {
		const next = isReady;
		/** Reports the new readiness unless it is already reported. */
		const report = () =>
			untrack(() => {
				if (ready === next) return;
				ready = next;
				onReadyChange?.(next);
			});
		// If the chart is no longer ready: report it right away, so a loader shows at once.
		if (!next) return report();
		let frame = requestAnimationFrame(() => (frame = requestAnimationFrame(report)));
		return () => cancelAnimationFrame(frame);
	});

	/** Zooms with the wheel or a trackpad pinch, and pans with Shift or a sideways wheel. */
	const handleWheel: Attachment<HTMLDivElement> = (node) => {
		/** Zooms or pans, and stops the page from scrolling only when it does. */
		const handle = (e: WheelEvent) => {
			const box = node.getBoundingClientRect();
			// If Ctrl or ⌘ is held, which trackpad pinches also send, or the wheel moves up and down without Shift: zoom around the pointer.
			if (e.ctrlKey || e.metaKey || (!e.shiftKey && Math.abs(e.deltaY) >= Math.abs(e.deltaX))) {
				e.preventDefault();
				ctx.zoom(Math.exp(e.deltaY * WHEEL_ZOOM_SPEED), e.clientX - box.left);
				return;
			}
			const sideways = e.shiftKey ? e.deltaX || e.deltaY : Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : 0;
			// If there is no sideways movement left to pan with: leave the event alone.
			if (!sideways) return;
			e.preventDefault();
			ctx.pan(sideways / (ctx.spacing || 1));
		};
		node.addEventListener("wheel", handle, { passive: false });
		return () => node.removeEventListener("wheel", handle);
	};

	/** Stops the page from scrolling while a long press reads candles, since `touch-action: pan-y` lets vertical moves scroll. */
	const handleTouchMove: Attachment<HTMLDivElement> = (node) => {
		/** Blocks the scroll only during a long press, so quick vertical swipes still scroll the page. */
		const handle = (e: TouchEvent) => {
			if (isInspecting) e.preventDefault();
		};
		node.addEventListener("touchmove", handle, { passive: false });
		return () => {
			node.removeEventListener("touchmove", handle);
			clearTimeout(pressTimer);
			cancelAnimationFrame(frame);
		};
	};

	/** Runs the latest drag or pinch update on the next frame, dropping the ones it replaces, since each sets the view from where the gesture started. */
	function scheduleMove(update: () => void) {
		pendingMove = update;
		if (frame) return;
		frame = requestAnimationFrame(() => {
			frame = 0;
			const run = pendingMove;
			pendingMove = null;
			run?.();
		});
	}

	/** Runs a waiting drag or pinch update now instead of on the next frame. */
	function flushMove() {
		cancelAnimationFrame(frame);
		frame = 0;
		const run = pendingMove;
		pendingMove = null;
		run?.();
	}

	/** Distance in pixels between the two pinching pointers, in any direction, so fingers placed one above the other still zoom smoothly. */
	function getPinchDistance() {
		const [first, second] = [...pointers.values()];
		return Math.hypot(second.x - first.x, second.y - first.y) || 1;
	}

	/** Starts a drag with one pointer, or a pinch with two; a finger waits for a long press before it shows the crosshair. */
	const handlePointerDown = (e: PointerEvent & { currentTarget: EventTarget & HTMLDivElement }) => {
		const node = e.currentTarget;
		const isTouch = e.pointerType === "touch";
		// If a mouse button other than the main one was pressed: ignore it.
		if (e.pointerType === "mouse" && e.button !== 0) return;
		node.setPointerCapture(e.pointerId);
		pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
		const box = node.getBoundingClientRect();
		if (pointers.size === 1) drag = { x: e.clientX, y: e.clientY, start: ctx.view[0], count: ctx.visibleCount, offset: ctx.priceOffset, hasMoved: false };
		else if (pointers.size === 2) {
			const [first, second] = [...pointers.values()];
			pinch = { distance: getPinchDistance(), start: ctx.view[0], count: ctx.visibleCount, anchorX: (first.x + second.x) / 2 - box.left };
			drag = null;
		}
		// If a finger pressed: show the crosshair only after a long press, so a quick drag just pans.
		if (isTouch) {
			clearTimeout(pressTimer);
			// If a second finger joined: it pinches, so drop the long press and the crosshair.
			if (pointers.size > 1) {
				isInspecting = false;
				clearHover();
				return;
			}
			touchPoint = { x: e.clientX, y: e.clientY };
			pressTimer = setTimeout(() => {
				isInspecting = true;
				updateHover(node, touchPoint.x, touchPoint.y);
			}, LONG_PRESS_DELAY);
			return;
		}
		updateHover(node, e.clientX, e.clientY);
	};

	/** Pans with a drag, zooms with a pinch, and otherwise moves the crosshair. */
	const handlePointerMove = (e: PointerEvent & { currentTarget: EventTarget & HTMLDivElement }) => {
		if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
		// If two pointers pinch: zoom by the change in their distance, around where they started.
		if (pinch && pointers.size === 2) {
			const { start, count, distance, anchorX } = pinch;
			const scale = distance / getPinchDistance();
			ctx.isDragging = true;
			scheduleMove(() => {
				ctx.setRange(start, count);
				ctx.zoom(scale, anchorX);
			});
			return;
		}
		const isTouch = e.pointerType === "touch";
		if (isTouch) {
			touchPoint = { x: e.clientX, y: e.clientY };
			// If a long press reads candles: move the crosshair with the finger instead of panning.
			if (isInspecting) return updateHover(e.currentTarget, e.clientX, e.clientY);
			// If the finger moved past the slop before the long press: it pans or scrolls, so cancel the long press.
			if (drag && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) >= TOUCH_SLOP) clearTimeout(pressTimer);
		}
		// If one pointer drags past the threshold: pan with it both ways. A mouse starts in any direction; a finger needs the larger slop, since a jittery hold still counts as a press, and starts sideways only while the page owns vertical swipes.
		const moveX = Math.abs(e.clientX - (drag?.x ?? 0));
		const moveDistance = Math.hypot(e.clientX - (drag?.x ?? 0), e.clientY - (drag?.y ?? 0));
		const hasStarted = !isTouch ? moveDistance >= DRAG_THRESHOLD : gestures === "chart" ? moveDistance >= TOUCH_SLOP : moveX >= TOUCH_SLOP;
		if (drag && (drag.hasMoved || hasStarted)) {
			const { start, count, offset, x, y } = drag;
			const { clientX, clientY } = e;
			drag.hasMoved = true;
			ctx.isDragging = true;
			scheduleMove(() => {
				ctx.setRange(start - (clientX - x) / (ctx.spacing || 1), count);
				ctx.setPriceOffset(offset + (clientY - y) / (ctx.priceHeight || 1));
			});
		}
		// If a mouse or pen moved: the crosshair follows it.
		if (!isTouch) updateHover(e.currentTarget, e.clientX, e.clientY);
	};

	/** Ends the drag or pinch when a pointer lifts. */
	const handlePointerUp = (e: PointerEvent) => {
		pointers.delete(e.pointerId);
		// If a pinch drops to one finger: that finger keeps dragging from where it is, instead of freezing until it lifts.
		if (pinch && pointers.size === 1) {
			const [rest] = [...pointers.values()];
			// Apply the waiting pinch first, so the drag starts from the zoom on screen.
			flushMove();
			drag = { x: rest.x, y: rest.y, start: ctx.view[0], count: ctx.visibleCount, offset: ctx.priceOffset, hasMoved: true };
		}
		if (pointers.size < 2) pinch = null;
		if (pointers.size === 0) {
			drag = null;
			ctx.isDragging = false;
			clearTimeout(pressTimer);
			// If a finger lifted: hide the crosshair, since no hover follows a touch.
			if (e.pointerType === "touch") {
				isInspecting = false;
				clearHover();
			}
		}
	};

	/** Moves the crosshair to the candle under a point in client pixels. */
	function updateHover(node: HTMLElement, clientX: number, clientY: number) {
		const box = node.getBoundingClientRect();
		const x = clientX - box.left;
		const y = clientY - box.top;
		ctx.pointer = { x, y };
		ctx.activeIndex = ctx.indexAt(x);
	}

	/** Hides the crosshair and tooltip. */
	function clearHover() {
		ctx.pointer = null;
		ctx.activeIndex = -1;
	}

	/** Clears the crosshair when the pointer leaves, unless the keyboard is reading the chart. */
	const handlePointerLeave = () => {
		// If the keyboard drives the tooltip, or a drag continues outside: keep it.
		if (!ctx.pointer || drag) return;
		clearHover();
	};

	/** Moves between candles, zooms, and pans from the keyboard. */
	const handleKeydown = (e: KeyboardEvent) => {
		const anchorX = ctx.activeIndex >= 0 ? ctx.x(ctx.activeIndex) : ctx.marginLeft + ctx.plotWidth / 2;
		const current = ctx.activeIndex >= 0 ? ctx.activeIndex : (ctx.visibleIndexes.at(-1) ?? 0);
		const isArrow = e.key === "ArrowLeft" || e.key === "ArrowRight";
		const isVerticalArrow = e.key === "ArrowUp" || e.key === "ArrowDown";
		const direction = e.key === "ArrowLeft" ? -1 : 1;
		// If there are no candles: there is nothing to move to.
		if (!data.length) return;
		if (e.key === "Escape") ctx.activeIndex = -1;
		else if (e.key === "+" || e.key === "=") ctx.zoom(1 / KEY_ZOOM_FACTOR, anchorX);
		else if (e.key === "-" || e.key === "_") ctx.zoom(KEY_ZOOM_FACTOR, anchorX);
		else if (isArrow && e.shiftKey) ctx.pan(direction * Math.max(1, ctx.visibleCount * KEY_PAN_SHARE));
		// Shift + up moves the candles up, like dragging the chart up.
		else if (isVerticalArrow && e.shiftKey) ctx.setPriceOffset(ctx.priceOffset + (e.key === "ArrowUp" ? -KEY_PRICE_PAN_SHARE : KEY_PRICE_PAN_SHARE));
		else if (isArrow) ctx.moveActive(ctx.activeIndex >= 0 ? current + direction : current);
		else if (e.key === "Home") ctx.moveActive(0);
		else if (e.key === "End") ctx.moveActive(data.length - 1);
		else return;
		e.preventDefault();
	};

	/** Shows the latest visible candle when the plot gets keyboard focus. */
	const handleFocus = (e: FocusEvent & { currentTarget: EventTarget & HTMLDivElement }) => {
		// If a tap or click focused the plot: leave the tooltip to the pointer, so a touch does not open it.
		if (!e.currentTarget.matches(":focus-visible")) return;
		// If a candle is already active, such as from a click, or there are none: leave it.
		if (ctx.activeIndex >= 0 || !ctx.visibleIndexes.length) return;
		ctx.moveActive(ctx.visibleIndexes.at(-1) ?? 0);
	};

	/** Hides the crosshair when focus leaves the plot. */
	const handleBlur = () => {
		clearHover();
	};

	/** Stops the long-press menu while a finger reads candles. */
	const handleContextMenu = (e: MouseEvent) => {
		if (isInspecting) e.preventDefault();
	};
</script>

<!-- Candlestick chart: the legend, the plot, and the table of visible candles; the legend sits above or below the plot, or an overlay legend floats inside it. -->
<figure class={["candlestickChart not-typeset", className]} data-variant={variant} data-size={size} data-ready={isReady || undefined} {...props}>
	<!-- Parts hand their settings to the chart and draw nothing here, so they render first and every layer below can read them. -->
	{@render children()}
	{#if legendSettings && hasLegendItems && legendPosition === "top"}
		<LegendView {...legendSettings} />
	{/if}

	<!-- Plot; drag to pan, Ctrl or ⌘ and the wheel to zoom, and focus it to read candles with the arrows. -->
	<!-- A focusable chart that reads candles with the arrow keys is interactive, which this check does not know. -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
	<div class="candlestickChartPlot" role="group" aria-roledescription="candlestick chart" aria-label={label} tabindex="0" data-gestures={gestures} data-dragging={ctx.isDragging || undefined} bind:clientWidth={ctx.width} bind:clientHeight={ctx.height} {@attach handleWheel} {@attach handleTouchMove} onpointerdown={handlePointerDown} onpointermove={handlePointerMove} onpointerup={handlePointerUp} onpointercancel={handlePointerUp} onpointerleave={handlePointerLeave} ondblclick={() => ctx.resetRange()} oncontextmenu={handleContextMenu} onkeydown={handleKeydown} onfocus={handleFocus} onblur={handleBlur}>
		<!-- Draw once the plot and its text are measured, so the first paint is already at full size. -->
		{#if isMeasured && ctx.width > 0 && ctx.height > 0}
			<svg class="candlestickChartSvg" width={ctx.width} height={ctx.height} viewBox="0 0 {ctx.width} {ctx.height}" aria-hidden="true">
				<defs>
					<clipPath id={clipId}>
						<rect x={ctx.marginLeft} y={0} width={ctx.plotWidth} height={ctx.plotBottom} />
					</clipPath>
					<clipPath id="{clipId}-price">
						<rect x={ctx.marginLeft} y={ctx.marginTop} width={ctx.plotWidth} height={ctx.priceHeight} />
					</clipPath>
				</defs>
				<Axes />
				<!-- Marks clip to the panes and the space above them, so candles at the edges stop at the axis and shading reaches the top. -->
				<g clip-path="url(#{clipId})">
					<Sessions />
					{#if showVolume}
						<Volume />
					{/if}
					<!-- A stretched price axis can push prices past the price pane, so its lines and candles clip to it. -->
					<g clip-path="url(#{clipId}-price)">
						<Positions />
						<Overlays />
						<Candles />
					</g>
				</g>
				<Levels />
				<Crosshair />
			</svg>
			{#if ctx.level && ctx.levelLines.length}
				<LevelLines />
			{/if}
			{#if ctx.placedMarkers.length}
				<Markers />
			{/if}
			{#if ctx.placedPositions.length}
				<PositionHandles />
			{/if}
			<PriceAxis />
		{/if}
		<!-- The info and an overlay legend wait for the plot's width too, so they never paint squeezed into a column first. -->
		{#if infoSettings && isMeasured && ctx.width > 0}
			<InfoView {...infoSettings} />
		{/if}
		{#if legendSettings && hasLegendItems && isMeasured && ctx.width > 0 && (legendPosition === "overlay" || legendPosition === "overlayBottom")}
			<LegendView {...legendSettings} />
		{/if}
		<!-- Without a tooltip part the crosshair, info, and announcements still follow the candle. -->
		{#if tooltipSettings && ctx.activeIndex >= 0 && !ctx.isDragging}
			<TooltipView {...tooltipSettings} />
		{/if}
		<!-- Hidden probe that resolves the axis text size token to pixels. -->
		<span class="candlestickChartProbe" bind:this={probe} aria-hidden="true"></span>
	</div>

	{#if legendSettings && hasLegendItems && legendPosition === "bottom"}
		<LegendView {...legendSettings} />
	{/if}
	<Table visible={table} />
	<span class="candlestickChartAnnouncement" aria-live="polite">{announcement}</span>
</figure>

<style>
	/* Base chart; the plot takes the full width and sits right under the legend, so session shading meets it */
	.candlestickChart {
		display: flex;
		position: relative;
		flex-direction: column;
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
		-webkit-touch-callout: none;
	}

	/* The chart owns every touch gesture, so vertical drags move the prices instead of being cancelled by a page that cannot scroll */
	.candlestickChartPlot[data-gestures="chart"] {
		touch-action: none;
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

	/* Each size also passes its radius, and one step smaller for buttons, to the parts through `--candlestick-chart-radius` and `--candlestick-chart-inner-radius` */

	/* Large */
	.candlestickChart[data-size="lg"] {
		--candlestick-chart-height: 30rem; /* 480px */
		--candlestick-chart-radius: var(--radius-lg);
		--candlestick-chart-inner-radius: var(--radius-md);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Medium — default */
	.candlestickChart[data-size="md"] {
		--candlestick-chart-height: 24rem; /* 384px */
		--candlestick-chart-radius: var(--radius-md);
		--candlestick-chart-inner-radius: var(--radius-sm);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* Small */
	.candlestickChart[data-size="sm"] {
		--candlestick-chart-height: 18rem; /* 288px */
		--candlestick-chart-radius: var(--radius-sm);
		--candlestick-chart-inner-radius: var(--radius-xs);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* Extra small */
	.candlestickChart[data-size="xs"] {
		--candlestick-chart-height: 14rem; /* 224px */
		--candlestick-chart-radius: var(--radius-xs);
		--candlestick-chart-inner-radius: var(--radius-xs);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}
</style>
