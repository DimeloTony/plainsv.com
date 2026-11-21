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
	// Pixels between the latest candle and a label, a label's padding and border around its text, and each button with its gap, for checking that a label fits past the latest candle.
	const LABEL_GAP = 4;
	const LABEL_CHROME = 12;
	const BUTTON_WIDTH = 20;
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
			// Draft and pending zones run to the plot's right edge, so their labels sit at its end.
			const right = item.isWaiting ? ctx.plotWidth : Math.min(ctx.plotWidth, ctx.latestCandleRight - ctx.marginLeft);
			// If the zone is off screen: it has no handles.
			if (right <= left) return [];
			return item.lines.flatMap((line) => {
				const y = ctx.priceToY(line.price);
				// If the line is above or below the price pane: its axis tag pins to the edge instead.
				if (y < ctx.marginTop || y > priceBottom) return [];
				const percent = ((line.price - item.entry) / item.entry) * 100;
				const price = ctx.formatPriceValue(line.price);
				const entryText = item.stage === "pending" ? `${item.name} ${price} · Waiting` : `${item.name} ${price}`;
				const text = line.field === "entry" ? entryText : `${line.field === "target" ? "Target" : "Stop"} ${price} (${percent >= 0 ? "+" : "−"}${Math.abs(percent).toFixed(2)}%)`;
				const isEntry = line.field === "entry";
				// The target and stop drag while the position is editable, and the entry only on a draft, before it fills.
				const isEditable = item.isEditable && (!isEntry || item.stage === "draft");
				// The entry label of a draft, pending, or open editable position gets a cancel button when someone listens for it, and a draft's also gets a check mark to confirm it.
				const isCancelable = isEntry && !!ctx.onPositionCancel && (item.isEditable || (item.stage === "pending" && (item.position.editable ?? true)));
				const isConfirmable = isEntry && item.stage === "draft" && !!ctx.onPositionConfirm;
				// Labels start just right of the latest candle, in the empty time ahead, and fall back inside the zone at its end when that space is too narrow.
				const labelWidth = ctx.measureText([text]) + LABEL_CHROME + (isCancelable ? BUTTON_WIDTH : 0) + (isConfirmable ? BUTTON_WIDTH : 0);
				const isOutside = right + LABEL_GAP + labelWidth <= ctx.plotWidth;
				const width = isOutside ? ctx.plotWidth - left : right - left;
				return [{ key: `${item.position.id}-${line.field}`, id: item.position.id, name: item.name, stage: item.stage, field: line.field, isEditable, isCancelable, isConfirmable, price: line.price, text, color: line.color, left, width, labelOffset: isOutside ? right - left + LABEL_GAP : null, y }];
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

	/** Moves a line by price steps from the keyboard; Escape cancels a drag, or discards a draft when nothing is dragged. */
	function handleKeydown(e: KeyboardEvent, handle: Handle) {
		const steps = { ArrowUp: KEY_STEP, ArrowRight: KEY_STEP, ArrowDown: -KEY_STEP, ArrowLeft: -KEY_STEP, PageUp: BIG_STEP, PageDown: -BIG_STEP }[e.key];
		// If Escape is pressed mid-drag: put the line back.
		if (e.key === "Escape" && drag) handlePointerCancel();
		// If Escape is pressed on a draft that someone can discard: discard it.
		else if (e.key === "Escape" && handle.stage === "draft" && ctx.onPositionCancel) ctx.cancelPosition(handle.id);
		else if (steps !== undefined) ctx.nudgePosition(handle.id, handle.field, e.shiftKey ? steps * BIG_STEP : steps);
		else return;
		// Keep the plot's own arrow keys from moving between candles.
		e.preventDefault();
		e.stopPropagation();
	}

	/** Presses the cancel button: a draft is discarded at once, since nothing was sent, and anything else arms first. */
	function handleCancelClick(handle: Handle) {
		if (handle.stage === "draft") ctx.cancelPosition(handle.id);
		else ctx.requestCancelPosition(handle.id);
	}

	/** Keeps keys on the check mark from moving the plot or the line underneath. */
	function handleConfirmKeydown(e: KeyboardEvent) {
		e.stopPropagation();
	}

	/** One label on a position line */
	type Handle = (typeof handles)[number];
</script>

<!-- Label text with a check mark on a draft's entry, and the cancel button; the first cancel press on a pending or open trade turns it into a check mark that confirms. -->
{#snippet label(handle: Handle)}
	{@const isArmed = ctx.armedCancelId === handle.id}
	<span class="candlestickChartPositionLabel">
		<span aria-hidden={handle.isCancelable || handle.isConfirmable || undefined}>{handle.text}</span>
		{#if handle.isConfirmable}
			<button type="button" class="candlestickChartPositionConfirm" aria-label="Confirm {handle.name}" onclick={() => ctx.confirmPosition(handle.id)} onpointerdown={stopPlotGesture} ondblclick={stopPlotGesture} onkeydown={handleConfirmKeydown}>
				<CheckIcon size={12} aria-hidden="true" />
			</button>
		{/if}
		{#if handle.isCancelable}
			<button type="button" class="candlestickChartPositionCancel" aria-label={handle.stage === "draft" ? `Discard ${handle.name}` : isArmed ? `Confirm cancel ${handle.name}` : `Cancel ${handle.name}`} title={isArmed ? "Press again to confirm" : undefined} data-armed={isArmed || undefined} onclick={() => handleCancelClick(handle)} onblur={handleCancelBlur} onpointerdown={stopPlotGesture} ondblclick={stopPlotGesture} onkeydown={handleCancelKeydown}>
				{#if isArmed}
					<CheckIcon size={12} aria-hidden="true" />
				{:else}
					<XIcon size={12} aria-hidden="true" />
				{/if}
			</button>
		{/if}
	</span>
{/snippet}

<!-- Labels on each position line; the target and stop, and a draft's entry, are sliders that drag up and down and take the arrow keys. -->
<div class="candlestickChartPositionHandles" bind:this={layer} style:--candlestick-chart-position-handles-left="{ctx.marginLeft}px" style:--candlestick-chart-position-handles-width="{ctx.plotWidth}px" style:--candlestick-chart-position-handles-height="{priceBottom}px">
	{#each handles as handle (handle.key)}
		{#if handle.isEditable}
			<div class="candlestickChartPositionHandle" role="slider" tabindex="0" aria-label="{handle.name} {handle.field}" aria-orientation="vertical" aria-valuenow={handle.price} aria-valuetext={handle.text} data-editable style:--candlestick-chart-series-color={handle.color} style:--candlestick-chart-position-handle-x="{handle.left}px" style:--candlestick-chart-position-handle-y="{handle.y}px" style:--candlestick-chart-position-handle-width="{handle.width}px" style:--candlestick-chart-position-label-offset={handle.labelOffset === null ? undefined : `${handle.labelOffset}px`} data-outside={handle.labelOffset !== null || undefined} onpointerdown={(e) => handlePointerDown(e, handle.id, handle.field)} onpointermove={handlePointerMove} onpointerup={handlePointerUp} onpointercancel={handlePointerCancel} ondblclick={(e) => e.stopPropagation()} onkeydown={(e) => handleKeydown(e, handle)}>
				{@render label(handle)}
			</div>
		{:else}
			<div class="candlestickChartPositionHandle" aria-hidden={handle.isCancelable ? undefined : "true"} style:--candlestick-chart-series-color={handle.color} style:--candlestick-chart-position-handle-x="{handle.left}px" style:--candlestick-chart-position-handle-y="{handle.y}px" style:--candlestick-chart-position-handle-width="{handle.width}px" style:--candlestick-chart-position-label-offset={handle.labelOffset === null ? undefined : `${handle.labelOffset}px`} data-outside={handle.labelOffset !== null || undefined}>
				{@render label(handle)}
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

	/* Strip along the line, with its label at the right end of the zone when there is no room past the latest candle */
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

	/* Label just right of the latest candle, in the empty time ahead */
	.candlestickChartPositionHandle[data-outside] {
		justify-content: flex-start;
		padding-right: 0;
		padding-left: var(--candlestick-chart-position-label-offset);
	}

	/* Label outlined in the line color; text stays in text colors */
	.candlestickChartPositionLabel {
		display: inline-flex;
		align-items: center;
		gap: var(--spacing-xs);
		border: 1px solid var(--candlestick-chart-series-color);
		border-radius: var(--radius-lg);
		background-color: var(--popover);
		padding: 0 calc(var(--spacing-xs) * 1.25);
		color: var(--popover-foreground);
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}

	/* Small square buttons after the label text: a check mark on a draft's entry, then the cancel */
	.candlestickChartPositionConfirm,
	.candlestickChartPositionCancel {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		transition-duration: 150ms;
		transition-property: color, background-color, box-shadow;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		cursor: pointer;
		margin-right: calc(var(--spacing-xs) / -2);
		border-radius: var(--radius-lg);
		width: 1rem; /* 16px */
		height: 1rem; /* 16px */
		pointer-events: auto;
		color: var(--muted-foreground);
	}

	/* =============== States =============== */

	/* The check mark fills in the rising color, apart from the destructive cancel */
	.candlestickChartPositionConfirm:hover {
		background-color: color-mix(in oklab, var(--candlestick-chart-up, var(--chart-3)) 18%, transparent);
		color: var(--candlestick-chart-up, var(--chart-3));
	}

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

	.candlestickChartPositionConfirm:focus-visible,
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
