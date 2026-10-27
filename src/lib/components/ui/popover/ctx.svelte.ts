import { setContext, getContext } from "svelte";
import type { Props, PopoverSide, PopoverAlign } from "./index.js";

const CONTEXT_ID = "popover-context";

class UseCompCtx {
	/** Whether the popover is shown */
	open = $state(false);
	/** Unique prefix for the trigger, content, title, and description ids */
	baseId = $state("");
	/** Preferred side of the trigger */
	side: PopoverSide = $state("bottom");
	/** Alignment along the trigger's edge */
	align: PopoverAlign = $state("center");
	/** Gap in pixels between the trigger and the popover */
	sideOffset = $state(4);
	/** Padding and text size of the content */
	size: UiSize = $state("md");
	/** Corner radius override; follows `size` when undefined */
	rounded?: UiRounded = $state();
	/** Called when the popover opens or closes */
	onOpenChange?: Props["onOpenChange"];
	/** Element the content is placed against, registered by the trigger */
	triggerEl?: HTMLElement = $state();
	/** Whether a `PopoverTitle` is mounted to name the content */
	hasTitle = $state(false);
	/** Whether a `PopoverDescription` is mounted to describe the content */
	hasDescription = $state(false);

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}
	}

	/** Id of the content, referenced by the trigger's `aria-controls` */
	get contentId() {
		return `${this.baseId}-content`;
	}

	/** Id of the trigger, which names the content when there is no title */
	get triggerId() {
		return `${this.baseId}-trigger`;
	}

	/** Id of the title, which names the content */
	get titleId() {
		return `${this.baseId}-title`;
	}

	/** Id of the description, which describes the content */
	get descriptionId() {
		return `${this.baseId}-description`;
	}

	/** Opens or closes the popover and reports the change. */
	setOpen(open: boolean) {
		// If the popover is already in that state: skip the update.
		if (open === this.open) return;
		this.open = open;
		this.onOpenChange?.(open);
	}
}

export type CompCtxProps = Pick<InstanceType<typeof UseCompCtx>, "open" | "baseId" | "side" | "align" | "sideOffset" | "size" | "rounded" | "onOpenChange">;

export const setCompCtx = (props: CompCtxProps) => setContext(CONTEXT_ID, new UseCompCtx(props));

export const useCompCtx = () => getContext<ReturnType<typeof setCompCtx>>(CONTEXT_ID);
