import { setContext, getContext, onDestroy } from "svelte";
import type { Props, TooltipSide } from "./index.js";

const CONTEXT_ID = "tooltip-context";

class UseCompCtx {
	/** Whether the tooltip is shown */
	open = $state(false);
	/** Id of the content, referenced by the trigger's `aria-describedby` */
	contentId = $state("");
	/** Milliseconds before the tooltip opens on hover */
	delay = $state(0);
	/** Milliseconds the tooltip stays open after the pointer leaves, so it can reach the content */
	closeDelay = $state(150);
	/** Preferred side of the trigger */
	side: TooltipSide = $state("top");
	/** Alignment along the trigger's edge */
	align: NonNullable<Props["align"]> = $state("center");
	/** Whether the content shows its arrow */
	arrow = $state(true);
	/** Gap in pixels between the trigger and the tooltip */
	sideOffset = $state(8);
	/** Visual style of the content */
	variant: NonNullable<Props["variant"]> = $state("default");
	/** Size of the content */
	size: UiSize = $state("md");
	/** Corner radius override; follows `size` when undefined */
	rounded?: UiRounded = $state();
	/** Element the content is placed against, registered by the trigger */
	triggerEl?: HTMLElement = $state();
	openTimer?: ReturnType<typeof setTimeout>;
	closeTimer?: ReturnType<typeof setTimeout>;

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}
		// Cancel a pending open or close when the tooltip unmounts.
		onDestroy(() => {
			clearTimeout(this.openTimer);
			clearTimeout(this.closeTimer);
		});
	}

	/** Opens the tooltip after the hover delay, and cancels a pending close. */
	scheduleOpen() {
		this.cancelClose();
		// If the tooltip is already open: keep it open without waiting again.
		if (this.open) return;
		clearTimeout(this.openTimer);
		// If there is no delay: open right away.
		if (this.delay <= 0) this.open = true;
		else this.openTimer = setTimeout(() => (this.open = true), this.delay);
	}

	/** Closes the tooltip after the close delay, giving the pointer time to cross to the content. */
	scheduleClose() {
		clearTimeout(this.openTimer);
		clearTimeout(this.closeTimer);
		this.closeTimer = setTimeout(() => (this.open = false), this.closeDelay);
	}

	/** Keeps the tooltip open when the pointer reaches the trigger or content again. */
	cancelClose() {
		clearTimeout(this.closeTimer);
	}

	/** Closes the tooltip right away and cancels any pending open or close. */
	close() {
		clearTimeout(this.openTimer);
		clearTimeout(this.closeTimer);
		this.open = false;
	}
}

export type CompCtxProps = Pick<InstanceType<typeof UseCompCtx>, "open" | "contentId" | "delay" | "closeDelay" | "side" | "align" | "arrow" | "sideOffset" | "variant" | "size" | "rounded">;

export const setCompCtx = (props: CompCtxProps) => setContext(CONTEXT_ID, new UseCompCtx(props));

export const useCompCtx = () => getContext<ReturnType<typeof setCompCtx>>(CONTEXT_ID);
