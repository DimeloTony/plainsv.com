import { setContext, getContext } from "svelte";
import type { Props } from "./index.js";

const CONTEXT_ID = "ai-action-context";

class UseCompCtx {
	/** Whether the details are shown */
	open = $state(false);
	/** Unique prefix that links the title button to the details by id */
	baseId = $state("");
	/** Called when the details open or close */
	onOpenChange?: Props["onOpenChange"];

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}
	}

	/** Id of the details, referenced by the title button's `aria-controls` */
	get contentId() {
		return `${this.baseId}-content`;
	}

	/** Opens or closes the details and reports the change. */
	toggle() {
		this.open = !this.open;
		this.onOpenChange?.(this.open);
	}
}

export type CompCtxProps = Pick<InstanceType<typeof UseCompCtx>, "open" | "baseId" | "onOpenChange">;

export const setCompCtx = (props: CompCtxProps) => setContext(CONTEXT_ID, new UseCompCtx(props));

export const useCompCtx = () => getContext<ReturnType<typeof setCompCtx>>(CONTEXT_ID);
