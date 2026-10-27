import { setContext, getContext } from "svelte";
import type { Props, ToggleGroupType } from "./index.js";

const CONTEXT_ID = "toggle-group-context";

class UseCompCtx {
	/** Values of the pressed items, as a list in both selection types */
	values: string[] = $state([]);
	/** Whether one or many items can be pressed */
	type: ToggleGroupType = $state("single");
	/** Disables every item */
	disabled = $state(false);
	/** Style of every item */
	variant: NonNullable<Props["variant"]> = $state("default");
	/** Size of every item */
	size: UiSize = $state("md");
	/** Corner radius override; follows `size` when undefined */
	rounded?: UiRounded = $state();
	/** Item that last had focus; it holds the single tab stop */
	focusedValue?: string = $state();
	/** Reports the new pressed values to the root, which updates `value` */
	onValuesChange: (values: string[]) => void = () => {};
	/** Item in the tab order: the last focused one, else the first pressed one; undefined keeps every item reachable */
	tabStopValue = $derived(this.focusedValue ?? this.values[0]);

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}
	}

	/** Presses or releases an item by the rules of the selection type. */
	toggle(value: string) {
		const isPressed = this.values.includes(value);
		// If one item can be pressed: it replaces the current one, or releases itself.
		if (this.type === "single") return this.onValuesChange(isPressed ? [] : [value]);
		this.onValuesChange(isPressed ? this.values.filter((pressed) => pressed !== value) : [...this.values, value]);
	}
}

export type CompCtxProps = Pick<InstanceType<typeof UseCompCtx>, "values" | "type" | "disabled" | "variant" | "size" | "rounded" | "onValuesChange">;

export const setCompCtx = (props: CompCtxProps) => setContext(CONTEXT_ID, new UseCompCtx(props));

export const useCompCtx = () => getContext<ReturnType<typeof setCompCtx>>(CONTEXT_ID);
