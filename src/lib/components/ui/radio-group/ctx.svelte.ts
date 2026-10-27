import { setContext, getContext } from "svelte";
import type { Props } from "./index.js";

const CONTEXT_ID = "radio-group-context";

class UseCompCtx {
	/** Value of the checked item; empty while none is checked */
	value = $state("");
	/** Disables every item */
	disabled = $state(false);
	/** Circle and dot size of the items */
	size: UiSize = $state("md");
	/** Called with the new value when an item is checked */
	onValueChange?: Props["onValueChange"];

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}
	}

	/** Checks an item and reports the change. */
	select(value: string) {
		// If the item is already checked: skip the update.
		if (value === this.value) return;
		this.value = value;
		this.onValueChange?.(value);
	}
}

export type CompCtxProps = Pick<InstanceType<typeof UseCompCtx>, "value" | "disabled" | "size" | "onValueChange">;

export const setCompCtx = (props: CompCtxProps) => setContext(CONTEXT_ID, new UseCompCtx(props));

export const useCompCtx = () => getContext<ReturnType<typeof setCompCtx>>(CONTEXT_ID);
