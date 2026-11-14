<script lang="ts">
	import { CheckIcon } from "@lucide/svelte";
	import { XIcon } from "@lucide/svelte";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { PositionChange } from "./index.js";
	const ctx = useCompCtx();
	// Price steps the arrow keys move a line, and how many Page Up, Page Down, or Shift moves at once.
	const KEY_STEP = 1;
	const BIG_STEP = 10;
	// Milliseconds an armed check mark waits for the confirming press before it turns back into the cancel button.
	const CONFIRM_TIMEOUT = 3000;
	let layer: HTMLDivElement | undefined = $state();
	// Line being dragged; the drag ends and reports on release.
	let drag: { id: string; field: PositionChange["field"] } | null = null;
	const priceBottom = $derived(ctx.marginTop + ctx.priceHeight);

	// Disarm a check mark that waits too long, so a later stray press never cancels a trade.
	$effect(() => {
		// If no button is armed: there is nothing to time.
		if (!ctx.armedCancelId) return;
		const timer = setTimeout(() => ctx.disarmCancel(), CONFIRM_TIMEOUT);
		return () => clearTimeout(timer);
	});
	// Every position line inside the price pane, with its label and its spot in layer pixels.
	const handles = $derived(
		ctx.placedPositions.flatMap((item) => {
			// If the position is closed: it keeps just its zones and lines, without labels.
			if (item.end !== null) return [];
			const left = Math.max(0, ctx.x(item.start) - ctx.marginLeft);
			const right = Math.min(ctx.plotWidth, (item.end === null ? ctx.plotWidth + ctx.marginLeft : ctx.x(item.end)) - ctx.marginLeft);
			// If the zone is off screen: it has no handles.
			if (right <= left) return [];
			return item.lines.flatMap((line) => {
				const y = ctx.priceToY(line.price);
				// If the line is above or below the price pane: its axis tag pins to the edge instead.
				if (y < ctx.marginTop || y > priceBottom) return [];
				const percent = ((line.price - item.position.entry) / item.position.entry) * 100;
				const price = ctx.formatPriceValue(line.price);
				const text = line.field === "entry" ? `${item.name} ${price}` : `${line.field === "target" ? "Target" : "Stop"} ${price} (${percent >= 0 ? "+" : "−"}${Math.abs(percent).toFixed(2)}%)`;
				const field = line.field === "entry" ? null : line.field;
				// Only the entry label of an open, editable position gets a cancel button, and only when someone listens for it.
				const isCancelable = field === null && item.isEditable && !!ctx.onPositionCancel;
				return [{ key: `${item.position.id}-${line.field}`, id: item.position.id, name: item.name, field, isEditable: item.isEditable && field !== null, isCancelable, price: line.price, text, color: line.color, left, width: right - left, y }];
			});
		}),
	);

	/** Starts dragging a target or stop, and keeps the press from panning the plot underneath. */
	function handlePointerDown(e: PointerEvent & { currentTarget: EventTarget & HTMLDivElement }, id: string, field: PositionChange["field"]) {
		e.stopPropagation();
		// If a mouse button other than the main one was pressed: ignore it.
		if (e.pointerType === "mouse" && e.button !== 0) return;
		e.currentTarget.setPointerCapture(e.pointerId);
		drag = { id, field };
		// Hide the tooltip while dragging, so it never covers the line.
		ctx.isDragging = true;
	}

	/** Moves the dragged line to the price under the pointer, snapped and kept on its side of the entry. */
	function handlePointerMove(e: PointerEvent) {
		// If nothing is dragged or the layer is gone: the pointer only hovers.
		if (!drag || !layer) return;
		// The layer sits at the top of the plot, so its top is the plot's.
		ctx.previewPosition(drag.id, drag.field, ctx.yToPrice(e.clientY - layer.getBoundingClientRect().top));
	}

	/** Ends the drag and reports the new price. */
	function handlePointerUp() {
		// If nothing is dragged: there is nothing to report.
		if (!drag) return;
		drag = null;
		ctx.isDragging = false;
		ctx.commitPosition();
	}

	/** Drops the drag when the browser takes the pointer away, putting the line back. */
	function handlePointerCancel() {
		drag = null;
		ctx.isDragging = false;
		ctx.discardPositionDraft();
	}

	/** Keeps presses on the cancel button from panning or zooming the plot underneath. */
	const stopPlotGesture = (e: Event) => e.stopPropagation();

	/** Turns the check mark back into the cancel button when focus leaves it. */
	function handleCancelBlur() {
		// Only one button can be armed, and it is the focused one, so this reads no per-button values; the button also blurs as it is removed after a confirmed cancel, when those values are gone.
		ctx.disarmCancel();
	}

	/** Disarms the check mark with Escape, and keeps keys on the cancel button from moving the plot underneath. */
	function handleCancelKeydown(e: KeyboardEvent) {
		e.stopPropagation();
		// If Escape is pressed while armed: turn back into the cancel button.
		if (e.key === "Escape" && ctx.armedCancelId) {
			e.preventDefault();
			ctx.disarmCancel();
		}
	}

	/** Moves a target or stop by price steps from the keyboard, and Escape cancels a drag. */
	function handleKeydown(e: KeyboardEvent, id: string, field: PositionChange["field"]) {
		const steps = { ArrowUp: KEY_STEP, ArrowRight: KEY_STEP, ArrowDown: -KEY_STEP, ArrowLeft: -KEY_STEP, PageUp: BIG_STEP, PageDown: -BIG_STEP }[e.key];
		// If Escape is pressed mid-drag: put the line back.
		if (e.key === "Escape" && drag) handlePointerCancel();
		else if (steps !== undefined) ctx.nudgePosition(id, field, e.shiftKey ? steps * BIG_STEP : steps);
		else return;
		// Keep the plot's own arrow keys from moving between candles.
		e.preventDefault();
		e.stopPropagation();
	}
</script>

<!-- Labels on each position line; the target and stop are sliders that drag up and down and take the arrow keys. -->
<div class="candlestickChartPositionHandles" bind:this={layer} style:--candlestick-chart-position-handles-left="{ctx.marginLeft}px" style:--candlestick-chart-position-handles-width="{ctx.plotWidth}px" style:--candlestick-chart-position-handles-height="{priceBottom}px">
	{#each handles as handle (handle.key)}
		{#if handle.isEditable && handle.field}
			{@const field = handle.field}
			<div class="candlestickChartPositionHandle" role="slider" tabindex="0" aria-label="{handle.name} {field}" aria-orientation="vertical" aria-valuenow={handle.price} aria-valuetext={handle.text} data-editable style:--candlestick-chart-series-color={handle.color} style:--candlestick-chart-position-handle-x="{handle.left}px" style:--candlestick-chart-position-handle-y="{handle.y}px" style:--candlestick-chart-position-handle-width="{handle.width}px" onpointerdown={(e) => handlePointerDown(e, handle.id, field)} onpointermove={handlePointerMove} onpointerup={handlePointerUp} onpointercancel={handlePointerCancel} ondblclick={(e) => e.stopPropagation()} onkeydown={(e) => handleKeydown(e, handle.id, field)}>
				<span class="candlestickChartPositionLabel">{handle.text}</span>
			</div>
		{:else if handle.isCancelable}
			<!-- Entry label with a cancel button; the first press turns it into a check mark, a press on the check mark reports the cancel, and the chart keeps the position until the caller removes or closes it. -->
			{@const isArmed = ctx.armedCancelId === handle.id}
			<div class="candlestickChartPositionHandle" style:--candlestick-chart-series-color={handle.color} style:--candlestick-chart-position-handle-x="{handle.left}px" style:--candlestick-chart-position-handle-y="{handle.y}px" style:--candlestick-chart-position-handle-width="{handle.width}px">
				<span class="candlestickChartPositionLabel">
					<span aria-hidden="true">{handle.text}</span>
					<button type="button" class="candlestickChartPositionCancel" aria-label={isArmed ? `Confirm cancel ${handle.name}` : `Cancel ${handle.name}`} title={isArmed ? "Press again to confirm" : undefined} data-armed={isArmed || undefined} onclick={() => ctx.requestCancelPosition(handle.id)} onblur={handleCancelBlur} onpointerdown={stopPlotGesture} ondblclick={stopPlotGesture} onkeydown={handleCancelKeydown}>
						{#if isArmed}
							<CheckIcon size={12} aria-hidden="true" />
						{:else}
							<XIcon size={12} aria-hidden="true" />
						{/if}
					</button>
				</span>
			</div>
		{:else}
			<div class="candlestickChartPositionHandle" aria-hidden="true" style:--candlestick-chart-series-color={handle.color} style:--candlestick-chart-position-handle-x="{handle.left}px" style:--candlestick-chart-position-handle-y="{handle.y}px" style:--candlestick-chart-position-handle-width="{handle.width}px">
				<span class="candlestickChartPositionLabel">{handle.text}</span>
			</div>
		{/if}
	{/each}
</div>

<style>
	/* Layer over the price pane, clipped so labels stop at the price axis while panning; only editable lines take the pointer */
	.candlestickChartPositionHandles {
		position: absolute;
		top: 0;
		left: var(--candlestick-chart-position-handles-left);
		width: var(--candlestick-chart-position-handles-width);
		height: var(--candlestick-chart-position-handles-height);
		overflow: hidden;
		pointer-events: none;
	}

	/* Strip along the line, with its label at the right end of the zone */
	.candlestickChartPositionHandle {
		display: flex;
		position: absolute;
		top: var(--candlestick-chart-position-handle-y);
		left: var(--candlestick-chart-position-handle-x);
		justify-content: flex-end;
		align-items: center;
		translate: 0 -50%;
		outline: none;
		padding-right: var(--spacing-xs);
		width: var(--candlestick-chart-position-handle-width);
		height: 0.75rem; /* 12px */
	}

	/* Label outlined in the line color; text stays in text colors */
	.candlestickChartPositionLabel {
		display: inline-flex;
		align-items: center;
		gap: var(--spacing-xs);
		border: 1px solid var(--candlestick-chart-series-color);
		border-radius: var(--radius-xs);
		background-color: var(--popover);
		padding: 0 calc(var(--spacing-xs) * 1.25);
		color: var(--popover-foreground);
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}

	/* Small square button after the entry label */
	.candlestickChartPositionCancel {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		transition-duration: 150ms;
		transition-property: color, background-color, box-shadow;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		cursor: pointer;
		margin-right: calc(var(--spacing-xs) / -2);
		border-radius: var(--radius-xs);
		width: 1rem; /* 16px */
		height: 1rem; /* 16px */
		pointer-events: auto;
		color: var(--muted-foreground);
	}

	/* =============== States =============== */

	.candlestickChartPositionCancel:hover {
		background-color: color-mix(in oklab, var(--destructive) 14%, transparent);
		color: var(--destructive);
	}

	/* Armed check mark: a filled circle in the falling color, so the confirming press reads apart from the square × and as destructive */
	.candlestickChartPositionCancel[data-armed] {
		border-radius: var(--radius-pill);
		background-color: var(--destructive);
		color: var(--background);
	}

	.candlestickChartPositionCancel[data-armed]:hover {
		background-color: color-mix(in oklab, var(--destructive) 85%, var(--foreground));
		color: var(--background);
	}

	.candlestickChartPositionCancel:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
	}

	/* Target and stop lines drag up and down, and a finger drag never scrolls the page */
	.candlestickChartPositionHandle[data-editable] {
		cursor: ns-resize;
		touch-action: none;
		pointer-events: auto;
	}

	.candlestickChartPositionHandle[data-editable]:hover .candlestickChartPositionLabel {
		background-color: color-mix(in oklab, var(--candlestick-chart-series-color) 14%, var(--popover));
	}

	/* Keyboard focus ring on the label */
	.candlestickChartPositionHandle:focus-visible .candlestickChartPositionLabel {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
	}
</style>
