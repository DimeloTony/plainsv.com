import { setContext, getContext } from "svelte";
import type { Props } from "./index.js";

const CONTEXT_ID = "collapsible-context";

class UseCompCtx {
	/** Whether the content is shown */
	open = $state(false);
	/** Whether the trigger is disabled */
	disabled = $state(false);
	/** Unique prefix that links the trigger to the content by id */
	baseId = $state("");
	/** Called when the content opens or closes */
	onOpenChange?: Props["onOpenChange"];

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}
	}

	/** Id of the trigger */
	get triggerId() {
		return `${this.baseId}-trigger`;
	}

	/** Id of the content, referenced by the trigger's `aria-controls` */
	get contentId() {
		return `${this.baseId}-content`;
	}

	/** Opens or closes the content and reports the change. */
	toggle() {
		this.open = !this.open;
		this.onOpenChange?.(this.open);
	}
}

export type CompCtxProps = Pick<InstanceType<typeof UseCompCtx>, "open" | "disabled" | "baseId" | "onOpenChange">;

export const setCompCtx = (props: CompCtxProps) => setContext(CONTEXT_ID, new UseCompCtx(props));

export const useCompCtx = () => getContext<ReturnType<typeof setCompCtx>>(CONTEXT_ID);
