import { setContext, getContext } from "svelte";
import type { Props } from "./index.js";

const CONTEXT_ID = "carousel-context";
// Pixels of slack when comparing scroll positions, for rounding in fractional layouts.
const EDGE_TOLERANCE = 1;

class UseCompCtx {
	/** Direction the slides scroll in */
	orientation: NonNullable<Props["orientation"]> = $state("horizontal");
	/** Whether the buttons wrap around at the ends */
	loop = $state(false);
	/** Size of the gap and the buttons */
	size: UiSize = $state("md");
	/** Scrolling viewport, registered by the content */
	viewportEl?: HTMLElement = $state();
	/** Index of the slide at the start of the view */
	selectedIndex = $state(0);
	/** Number of slides */
	slideCount = $state(0);
	/** Whether the view can scroll back */
	canScrollPrev = $state(false);
	/** Whether the view can scroll forward */
	canScrollNext = $state(false);
	/** Called with the index of the slide at the start of the view when it changes */
	onSelectedIndexChange?: Props["onSelectedIndexChange"];

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}
	}

	/** Lists the slides in order. */
	getSlides() {
		return [...(this.viewportEl?.querySelectorAll<HTMLElement>("[data-carousel-item]") ?? [])];
	}

	/** Reads the scroll position to update the selected slide and the button states. */
	update() {
		const viewport = this.viewportEl;
		// If the viewport is not mounted yet: there is nothing to read.
		if (!viewport) return;
		const isVertical = this.orientation === "vertical";
		const scroll = isVertical ? viewport.scrollTop : viewport.scrollLeft;
		const maxScroll = isVertical ? viewport.scrollHeight - viewport.clientHeight : viewport.scrollWidth - viewport.clientWidth;
		const slides = this.getSlides();
		// The selected slide is the one whose start is closest to the scroll position.
		const offsets = slides.map((slide) => (isVertical ? slide.offsetTop : slide.offsetLeft));
		const closest = offsets.reduce((best, offset, index) => (Math.abs(offset - scroll) < Math.abs(offsets[best] - scroll) ? index : best), 0);
		// At the far end, the last slide counts as selected even when several fit in the view.
		const selected = scroll >= maxScroll - EDGE_TOLERANCE && slides.length ? slides.length - 1 : closest;
		this.slideCount = slides.length;
		this.canScrollPrev = scroll > EDGE_TOLERANCE;
		this.canScrollNext = scroll < maxScroll - EDGE_TOLERANCE;
		// If the selected slide changed: report it.
		if (selected !== this.selectedIndex) {
			this.selectedIndex = selected;
			this.onSelectedIndexChange?.(selected);
		}
	}

	/** Scrolls so the slide at the index starts the view. */
	scrollTo(index: number, behavior: ScrollBehavior = "smooth") {
		const slide = this.getSlides()[index];
		// If there is no slide at that index: stay where the view is.
		if (!slide || !this.viewportEl) return;
		if (this.orientation === "vertical") this.viewportEl.scrollTo({ top: slide.offsetTop, behavior });
		else this.viewportEl.scrollTo({ left: slide.offsetLeft, behavior });
	}

	/** Scrolls back one slide, wrapping to the end when `loop` is set. */
	scrollPrev() {
		// If the view is at the start: wrap to the last slide when looping.
		if (!this.canScrollPrev) return void (this.loop && this.scrollTo(this.slideCount - 1));
		// At the far end the selected slide is the last one, so step back from the slide at the view start instead.
		this.scrollTo(Math.max(Math.min(this.selectedIndex, this.firstVisibleIndex()) - 1, 0));
	}

	/** Scrolls forward one slide, wrapping to the start when `loop` is set. */
	scrollNext() {
		// If the view is at the end: wrap to the first slide when looping.
		if (!this.canScrollNext) return void (this.loop && this.scrollTo(0));
		this.scrollTo(this.firstVisibleIndex() + 1);
	}

	/** Returns the index of the slide whose start is closest to the scroll position. */
	firstVisibleIndex() {
		const viewport = this.viewportEl;
		// If the viewport is not mounted yet: the view starts at the first slide.
		if (!viewport) return 0;
		const isVertical = this.orientation === "vertical";
		const scroll = isVertical ? viewport.scrollTop : viewport.scrollLeft;
		const offsets = this.getSlides().map((slide) => (isVertical ? slide.offsetTop : slide.offsetLeft));
		return offsets.reduce((best, offset, index) => (Math.abs(offset - scroll) < Math.abs(offsets[best] - scroll) ? index : best), 0);
	}
}

export type CompCtxProps = Pick<InstanceType<typeof UseCompCtx>, "orientation" | "loop" | "size" | "onSelectedIndexChange">;

export const setCompCtx = (props: CompCtxProps) => setContext(CONTEXT_ID, new UseCompCtx(props));

export const useCompCtx = () => getContext<ReturnType<typeof setCompCtx>>(CONTEXT_ID);
