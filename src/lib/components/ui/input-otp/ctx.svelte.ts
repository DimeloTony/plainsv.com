import { setContext, getContext } from "svelte";
import type { Props } from "./index.js";

const CONTEXT_ID = "input-otp-context";

class UseCompCtx {
	/** Characters entered so far */
	value = $state("");
	/** Number of characters the code needs */
	maxlength = $state(6);
	/** Whether the native input has focus */
	focused = $state(false);
	/** Whether the native input is disabled */
	disabled = $state(false);
	/** Whether the code failed validation, from `aria-invalid` */
	invalid = $state(false);
	/** Size of the slots and separators */
	size: UiSize = $state("md");
	/** Corner radius override; follows `size` when undefined */
	rounded?: UiRounded = $state();
	/** Called with the new value when it changes */
	onValueChange?: Props["onValueChange"];
	/** Called with the value once every slot is filled */
	onComplete?: Props["onComplete"];
	/** Slot that receives the next character; the last slot once the code is full */
	activeIndex = $derived(Math.min(this.value.length, this.maxlength - 1));

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}
	}

	/** Stores a new value and reports the change and completion. */
	setValue(value: string) {
		// If the value did not change: skip the update.
		if (value === this.value) return;
		this.value = value;
		this.onValueChange?.(value);
		// If every slot is filled: report the finished code.
		if (value.length === this.maxlength) this.onComplete?.(value);
	}
}

export type CompCtxProps = Pick<InstanceType<typeof UseCompCtx>, "value" | "maxlength" | "disabled" | "invalid" | "size" | "rounded" | "onValueChange" | "onComplete">;

export const setCompCtx = (props: CompCtxProps) => setContext(CONTEXT_ID, new UseCompCtx(props));

export const useCompCtx = () => getContext<ReturnType<typeof setCompCtx>>(CONTEXT_ID);
