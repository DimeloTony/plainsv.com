import { setContext, getContext, onDestroy } from "svelte";
import type { Props, HoverCardSide } from "./index.js";

const CONTEXT_ID = "hover-card-context";

class UseCompCtx {
	/** Whether the card is shown */
	open = $state(false);
	/** Milliseconds before the card opens on hover */
	openDelay = $state(700);
	/** Milliseconds the card stays open after the pointer leaves */
	closeDelay = $state(300);
	/** Preferred side of the trigger */
	side: HoverCardSide = $state("bottom");
	/** Alignment along the trigger's edge */
	align: NonNullable<Props["align"]> = $state("center");
	/** Gap in pixels between the trigger and the card */
	sideOffset = $state(4);
	/** Padding and text size of the card */
	size: UiSize = $state("md");
	/** Corner radius override; follows `size` when undefined */
	rounded?: UiRounded = $state();
	/** Called when the card opens or closes */
	onOpenChange?: Props["onOpenChange"];
	/** Element the card is placed against, registered by the trigger */
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
		// Cancel a pending open or close when the card unmounts.
		onDestroy(() => {
			clearTimeout(this.openTimer);
			clearTimeout(this.closeTimer);
		});
	}

	/** Opens or closes the card right away and reports the change. */
	setOpen(open: boolean) {
		clearTimeout(this.openTimer);
		clearTimeout(this.closeTimer);
		// If the card is already in that state: skip the update.
		if (open === this.open) return;
		this.open = open;
		this.onOpenChange?.(open);
	}

	/** Opens the card after the open delay, and cancels a pending close. */
	scheduleOpen() {
		clearTimeout(this.closeTimer);
		// If the card is already open: keep it open without waiting again.
		if (this.open) return;
		clearTimeout(this.openTimer);
		this.openTimer = setTimeout(() => this.setOpen(true), this.openDelay);
	}

	/** Closes the card after the close delay, giving the pointer time to cross to it. */
	scheduleClose() {
		clearTimeout(this.openTimer);
		clearTimeout(this.closeTimer);
		this.closeTimer = setTimeout(() => this.setOpen(false), this.closeDelay);
	}

	/** Keeps the card open when the pointer reaches the trigger or card again. */
	cancelClose() {
		clearTimeout(this.closeTimer);
	}
}

export type CompCtxProps = Pick<InstanceType<typeof UseCompCtx>, "open" | "openDelay" | "closeDelay" | "side" | "align" | "sideOffset" | "size" | "rounded" | "onOpenChange">;

export const setCompCtx = (props: CompCtxProps) => setContext(CONTEXT_ID, new UseCompCtx(props));

export const useCompCtx = () => getContext<ReturnType<typeof setCompCtx>>(CONTEXT_ID);
