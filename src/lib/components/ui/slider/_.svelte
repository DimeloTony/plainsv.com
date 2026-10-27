<script lang="ts">
	import type { Attachment } from "svelte/attachments";
	import type { Props } from "./index.js";
	let { value = $bindable(), defaultValue, min = 0, max = 100, step = 1, orientation = "horizontal", disabled = false, name, thumbLabels, onValueChange, onValueCommit, variant = "default", size = "md", rounded, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledby, class: className, ...props }: Props = $props();
	let trackEl = $state<HTMLElement>();
	let thumbEls: HTMLElement[] = $state([]);
	// The thumb being dragged, and the values when the drag started.
	let activeIndex = 0;
	let valuesAtStart: number[] = [];
	const values = $derived(value ?? defaultValue ?? [min]);
	const isVertical = $derived(orientation === "vertical");
	const percents = $derived(values.map((v) => toPercent(v)));
	// A single thumb fills from the start of the track; several fill between the outer thumbs.
	const rangeStart = $derived(values.length > 1 ? percents[0] : 0);
	const rangeEnd = $derived(percents.at(-1) ?? 0);
	// Round snapped values to the step's decimals so steps like 0.1 do not drift into float noise.
	const stepDecimals = $derived(String(step).split(".")[1]?.length ?? 0);

	/** Converts a value to its position along the track, from 0 to 100. */
	const toPercent = (v: number) => (max > min ? ((v - min) / (max - min)) * 100 : 0);

	/** Snaps a raw value to the nearest step between min and max. */
	const snapToStep = (raw: number) => {
		const snapped = min + Math.round((raw - min) / step) * step;
		return Math.min(Math.max(Number(snapped.toFixed(stepDecimals)), min), max);
	};

	/** Sets one thumb's value and reports the change; returns whether the value moved. */
	const setThumbValue = (index: number, raw: number) => {
		// Keep the thumb between its neighbors so the values stay in order.
		const lower = values[index - 1] ?? min;
		const upper = values[index + 1] ?? max;
		const next = Math.min(Math.max(snapToStep(raw), lower), upper);
		// If the snapped value did not move: skip the update.
		if (next === values[index]) return false;
		const nextValues = values.map((v, i) => (i === index ? next : v));
		value = nextValues;
		onValueChange?.(nextValues);
		return true;
	};

	/** Reads the value under the pointer from its position along the track. */
	const valueFromPointer = (e: PointerEvent) => {
		// If the track is not mounted yet: fall back to the minimum.
		if (!trackEl) return min;
		const rect = trackEl.getBoundingClientRect();
		const ratio = isVertical ? (rect.bottom - e.clientY) / rect.height : (e.clientX - rect.left) / rect.width;
		return min + Math.min(Math.max(ratio, 0), 1) * (max - min);
	};

	/** Finds the thumb closest to a value; stacked thumbs resolve toward the pointer's side. */
	const closestThumb = (target: number) => {
		let closest = 0;
		values.forEach((v, i) => {
			const distance = Math.abs(v - target);
			const best = Math.abs(values[closest] - target);
			if (distance < best || (distance === best && target > v)) closest = i;
		});
		return closest;
	};

	/** Moves the closest thumb to a press on the slider and follows the pointer until release. */
	const trackPointer: Attachment<HTMLElement> = (node) => {
		const handleDown = (e: PointerEvent) => {
			// If the slider is disabled or this is not a primary press: ignore it.
			if (disabled || e.button !== 0) return;
			// Stop text selection, and keep receiving moves after the pointer leaves the slider.
			e.preventDefault();
			node.setPointerCapture(e.pointerId);
			valuesAtStart = values;
			const target = valueFromPointer(e);
			activeIndex = closestThumb(target);
			setThumbValue(activeIndex, target);
			thumbEls[activeIndex]?.focus();
		};
		const handleMove = (e: PointerEvent) => {
			// If this pointer did not start a drag on the slider: ignore it.
			if (!node.hasPointerCapture(e.pointerId)) return;
			setThumbValue(activeIndex, valueFromPointer(e));
		};
		const handleEnd = (e: PointerEvent) => {
			if (!node.hasPointerCapture(e.pointerId)) return;
			node.releasePointerCapture(e.pointerId);
			// Commit once at the end of the drag, only when it changed the values.
			if (values.some((v, i) => v !== valuesAtStart[i])) onValueCommit?.(values);
		};

		// Listen directly so pointer handlers passed through props still run.
		node.addEventListener("pointerdown", handleDown);
		node.addEventListener("pointermove", handleMove);
		node.addEventListener("pointerup", handleEnd);
		node.addEventListener("pointercancel", handleEnd);
		return () => {
			node.removeEventListener("pointerdown", handleDown);
			node.removeEventListener("pointermove", handleMove);
			node.removeEventListener("pointerup", handleEnd);
			node.removeEventListener("pointercancel", handleEnd);
		};
	};

	/** Moves a thumb with the arrow, Page Up, Page Down, Home, and End keys. */
	const handleThumbKeydown = (e: KeyboardEvent, index: number) => {
		// If the slider is disabled: ignore the key.
		if (disabled) return;
		// Shift with an arrow, and the page keys, move ten steps at a time.
		const arrowStep = e.shiftKey ? step * 10 : step;
		const current = values[index];
		const keyTargets: Record<string, number> = {
			ArrowRight: current + arrowStep,
			ArrowUp: current + arrowStep,
			ArrowLeft: current - arrowStep,
			ArrowDown: current - arrowStep,
			PageUp: current + step * 10,
			PageDown: current - step * 10,
			Home: min,
			End: max,
		};
		const target = keyTargets[e.key];
		// If the key does not move the slider: let it through.
		if (target === undefined) return;
		e.preventDefault();
		// Each key press is a finished change, so commit right away.
		if (setThumbValue(index, target)) onValueCommit?.(values);
	};
</script>

<!-- Track with a filled range and one thumb per value; pressing anywhere moves the closest thumb. -->
<div class={["slider not-typeset", className]} data-orientation={orientation} data-disabled={disabled || undefined} data-variant={variant} data-size={size} data-rounded={rounded} aria-disabled={disabled || undefined} {@attach trackPointer} {...props}>
	<div class="sliderTrack" bind:this={trackEl}>
		<div class="sliderRange" style:left={isVertical ? undefined : `${rangeStart}%`} style:right={isVertical ? undefined : `${100 - rangeEnd}%`} style:bottom={isVertical ? `${rangeStart}%` : undefined} style:top={isVertical ? `${100 - rangeEnd}%` : undefined}></div>
	</div>

	<!-- Thumbs are focusable sliders that screen readers announce and keys move. -->
	{#each values as thumbValue, i (i)}
		<span class="sliderThumb" bind:this={thumbEls[i]} role="slider" tabindex={disabled ? undefined : 0} aria-label={thumbLabels?.[i] ?? ariaLabel} aria-labelledby={thumbLabels?.[i] ? undefined : ariaLabelledby} aria-valuemin={min} aria-valuemax={max} aria-valuenow={thumbValue} aria-orientation={orientation} aria-disabled={disabled || undefined} style:left={isVertical ? undefined : `${percents[i]}%`} style:bottom={isVertical ? `${percents[i]}%` : undefined} onkeydown={(e) => handleThumbKeydown(e, i)}></span>
	{/each}

	<!-- Submit each value with a form when the slider has a name. -->
	{#if name}
		{#each values as thumbValue, i (i)}
			<input type="hidden" {name} value={thumbValue} />
		{/each}
	{/if}
</div>

<style>
	/* Base slider; as tall as a thumb so the whole thumb area takes presses */
	.slider {
		display: flex;
		position: relative;
		align-items: center;
		width: 100%;
		height: var(--slider-thumb);
		touch-action: none;
		user-select: none;
	}

	/* Vertical sliders fill their parent's height, with a minimum so they stay usable */
	.slider[data-orientation="vertical"] {
		flex-direction: column;
		justify-content: center;
		width: var(--slider-thumb);
		height: 100%;
		min-height: 10rem; /* 160px */
	}

	/* Clips the range to the track's rounded ends */
	.sliderTrack {
		position: relative;
		flex-grow: 1;
		border-radius: var(--slider-radius);
		width: 100%;
		height: var(--slider-track);
		overflow: hidden;
	}

	.slider[data-orientation="vertical"] .sliderTrack {
		width: var(--slider-track);
		height: 100%;
	}

	/* Filled part of the track; its ends are set inline from the values */
	.sliderRange {
		position: absolute;
	}

	.slider[data-orientation="horizontal"] .sliderRange {
		height: 100%;
	}

	.slider[data-orientation="vertical"] .sliderRange {
		width: 100%;
	}

	/* Centered on its value, so it overhangs the track ends by half its size */
	.sliderThumb {
		display: block;
		position: absolute;
		transition: box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1);
		box-sizing: border-box;
		outline: none;
		border: 1px solid;
		border-radius: var(--slider-radius);
		background-color: var(--background);
		width: var(--slider-thumb);
		height: var(--slider-thumb);
	}

	.slider[data-orientation="horizontal"] .sliderThumb {
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.slider[data-orientation="vertical"] .sliderThumb {
		left: 50%;
		transform: translate(-50%, 50%);
	}

	/* =============== Variants =============== */

	.slider[data-variant="default"] .sliderTrack {
		background-color: var(--muted);
	}

	.slider[data-variant="default"] .sliderRange {
		background-color: var(--primary);
	}

	.slider[data-variant="default"] .sliderThumb {
		border-color: var(--primary);
	}

	.slider[data-variant="destructive"] .sliderTrack {
		background-color: color-mix(in oklab, var(--destructive) 20%, transparent);
	}

	.slider[data-variant="destructive"] .sliderRange {
		background-color: var(--destructive);
	}

	.slider[data-variant="destructive"] .sliderThumb {
		border-color: var(--destructive);
	}

	/* =============== States =============== */

	/* Hover and keyboard focus ring around the thumb */
	.slider[data-variant] .sliderThumb:hover,
	.slider[data-variant] .sliderThumb:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
	}

	.slider[data-variant="destructive"] .sliderThumb:hover,
	.slider[data-variant="destructive"] .sliderThumb:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--destructive) 20%, transparent);
	}

	:global(.dark) .slider[data-variant="destructive"] .sliderThumb:hover,
	:global(.dark) .slider[data-variant="destructive"] .sliderThumb:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--destructive) 40%, transparent);
	}

	/* Disabled state */
	.slider[data-disabled] {
		opacity: 50%;
		pointer-events: none;
	}

	/* =============== Sizes =============== */

	/* Large */
	.slider[data-size="lg"] {
		--slider-track: 0.5rem; /* 8px */
		--slider-thumb: 1.25rem; /* 20px */
		--slider-radius: var(--radius-lg);
	}

	/* Medium — default */
	.slider[data-size="md"] {
		--slider-track: 0.375rem; /* 6px */
		--slider-thumb: 1rem; /* 16px */
		--slider-radius: var(--radius-md);
	}

	/* Small */
	.slider[data-size="sm"] {
		--slider-track: 0.25rem; /* 4px */
		--slider-thumb: 0.875rem; /* 14px */
		--slider-radius: var(--radius-sm);
	}

	/* Extra small */
	.slider[data-size="xs"] {
		--slider-track: 0.25rem; /* 4px */
		--slider-thumb: 0.75rem; /* 12px */
		--slider-radius: var(--radius-xs);
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius; must stay after the size rules */
	.slider[data-rounded="xs"] {
		--slider-radius: var(--radius-xs);
	}

	.slider[data-rounded="sm"] {
		--slider-radius: var(--radius-sm);
	}

	.slider[data-rounded="md"] {
		--slider-radius: var(--radius-md);
	}

	.slider[data-rounded="lg"] {
		--slider-radius: var(--radius-lg);
	}

	.slider[data-rounded="xl"] {
		--slider-radius: var(--radius-xl);
	}

	.slider[data-rounded="2xl"] {
		--slider-radius: var(--radius-2xl);
	}

	.slider[data-rounded="3xl"] {
		--slider-radius: var(--radius-3xl);
	}

	.slider[data-rounded="4xl"] {
		--slider-radius: var(--radius-4xl);
	}

	.slider[data-rounded="pill"] {
		--slider-radius: var(--radius-pill);
	}
</style>
