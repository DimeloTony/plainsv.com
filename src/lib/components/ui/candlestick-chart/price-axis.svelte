<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	const ctx = useCompCtx();
	// How fast a vertical drag stretches the price axis, per pixel.
	const STRETCH_SPEED = 0.01;
	// Where the drag started and the stretch it started from.
	let drag: { y: number; stretch: number } | null = null;

	/** Starts stretching, and keeps the press from panning the plot underneath. */
	const handlePointerDown = (e: PointerEvent & { currentTarget: EventTarget & HTMLDivElement }) => {
		e.stopPropagation();
		// If a mouse button other than the main one was pressed: ignore it.
		if (e.pointerType === "mouse" && e.button !== 0) return;
		e.currentTarget.setPointerCapture(e.pointerId);
		drag = { y: e.clientY, stretch: ctx.priceStretch };
	};

	/** Stretches the prices while dragging up and squashes them while dragging down. */
	const handlePointerMove = (e: PointerEvent) => {
		// If no drag is running: the pointer only hovers.
		if (!drag) return;
		ctx.setPriceStretch(drag.stretch * Math.exp((drag.y - e.clientY) * STRETCH_SPEED));
	};

	/** Ends the stretch. */
	const handlePointerUp = () => {
		drag = null;
	};

	/** Fits and centers the prices on the candles on screen again, without resetting the plot's zoom. */
	const handleDoubleClick = (e: MouseEvent) => {
		e.stopPropagation();
		ctx.resetPriceScale();
	};
</script>

<!-- Price axis handle over the price labels; drag up or down to stretch prices, and double-click to fit and center them again. -->
<!-- The plot's keyboard and table already read every price, so this pointer-only handle stays out of the accessibility tree. -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="candlestickChartPriceAxis" aria-hidden="true" style:--candlestick-chart-price-axis-top="{ctx.marginTop}px" style:--candlestick-chart-price-axis-left="{ctx.marginLeft + ctx.plotWidth}px" style:--candlestick-chart-price-axis-width="{ctx.marginRight}px" style:--candlestick-chart-price-axis-height="{ctx.priceHeight}px" onpointerdown={handlePointerDown} onpointermove={handlePointerMove} onpointerup={handlePointerUp} onpointercancel={handlePointerUp} ondblclick={handleDoubleClick}></div>

<style>
	/* Invisible handle over the price labels, placed by the chart */
	.candlestickChartPriceAxis {
		position: absolute;
		top: var(--candlestick-chart-price-axis-top);
		left: var(--candlestick-chart-price-axis-left);
		cursor: ns-resize;
		width: var(--candlestick-chart-price-axis-width);
		height: var(--candlestick-chart-price-axis-height);
		touch-action: none;
	}
</style>
