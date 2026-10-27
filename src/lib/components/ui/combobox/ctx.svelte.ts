import { setContext, getContext } from "svelte";
import { SvelteMap } from "svelte/reactivity";
import type { Props } from "./index.js";

const CONTEXT_ID = "combobox-context";

class UseCompCtx {
	/** Value of the selected item */
	value = $state("");
	/** Whether the popover is shown */
	open = $state(false);
	/** Whether the trigger is disabled */
	disabled = $state(false);
	/** Size of the trigger, input, and items */
	size: UiSize = $state("md");
	/** Corner radius override; follows `size` when undefined */
	rounded?: UiRounded = $state();
	/** Called with the new value when an item is selected */
	onValueChange?: Props["onValueChange"];
	/** Called when the popover opens or closes */
	onOpenChange?: Props["onOpenChange"];
	/** Text of each item by value, kept after the list closes so the trigger can show it */
	labels = new SvelteMap<string, string>();

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}
	}

	/** Opens or closes the popover and reports the change. */
	setOpen(open: boolean) {
		// If the popover is already in that state: skip the update.
		if (open === this.open) return;
		this.open = open;
		this.onOpenChange?.(open);
	}

	/** Selects a value, reports the change, and closes the popover. */
	select(value: string) {
		// Only report a change when the value is new.
		if (value !== this.value) {
			this.value = value;
			this.onValueChange?.(value);
		}
		this.setOpen(false);
	}
}

export type CompCtxProps = Pick<InstanceType<typeof UseCompCtx>, "value" | "open" | "disabled" | "size" | "rounded" | "onValueChange" | "onOpenChange">;

export const setCompCtx = (props: CompCtxProps) => setContext(CONTEXT_ID, new UseCompCtx(props));

export const useCompCtx = () => getContext<ReturnType<typeof setCompCtx>>(CONTEXT_ID);
