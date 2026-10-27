import { setContext, getContext, untrack } from "svelte";
import { SvelteMap } from "svelte/reactivity";
import type { Props, ToastId } from "./index.js";

const CONTEXT_ID = "toaster-context";

class UseCompCtx {
	/** Where the toasts stack */
	position: NonNullable<Props["position"]> = $state("bottom-right");
	/** Keeps the toasts spread out */
	expand = $state(false);
	/** Number of toasts shown at once */
	visibleToasts = $state(3);
	/** Milliseconds each toast stays open, unless it sets its own */
	duration = $state(4000);
	/** Shows a close button on every toast, unless it sets its own */
	closeButton = $state(false);
	/** Tints error toasts, unless a toast sets its own */
	richColors = $state(false);
	/** Padding, text, and icon size of the toasts */
	size: UiSize = $state("md");
	/** Corner radius of the toasts */
	rounded: UiRounded = $state("lg");
	/** Whether the pointer is over the list */
	hovered = $state(false);
	/** Whether focus is inside the list */
	focused = $state(false);
	/** Whether a toast is being pressed or swiped */
	interacting = $state(false);
	/** Whether the page is in a background tab */
	pageHidden = $state(false);
	/** Measured content height of each toast in pixels, by id */
	heights = new SvelteMap<ToastId, number>();
	/** Whether the toasts are spread out instead of stacked */
	expanded = $derived(this.expand || this.hovered || this.focused || this.interacting);
	/** Whether the close timers are on hold */
	paused = $derived(this.hovered || this.focused || this.interacting || this.pageHidden);
	/** Edge of the viewport the toasts enter from */
	edge = $derived(this.position.startsWith("top") ? "top" : "bottom");

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}
	}

	/** Records a toast's content height; untracked, so the effect that reports it does not also depend on the map and loop. */
	setHeight(id: ToastId, height: number) {
		untrack(() => this.heights.set(id, height));
	}

	/** Forgets a toast's height once it unmounts. */
	removeHeight(id: ToastId) {
		untrack(() => this.heights.delete(id));
	}
}

export type CompCtxProps = Pick<InstanceType<typeof UseCompCtx>, "position" | "expand" | "visibleToasts" | "duration" | "closeButton" | "richColors" | "size" | "rounded">;

export const setCompCtx = (props: CompCtxProps) => setContext(CONTEXT_ID, new UseCompCtx(props));

export const useCompCtx = () => getContext<ReturnType<typeof setCompCtx>>(CONTEXT_ID);
