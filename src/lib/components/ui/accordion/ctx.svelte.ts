import { setContext, getContext } from "svelte";
import type { Props } from "./index.js";

const CONTEXT_ID = "accordion-context";
const ITEM_CONTEXT_ID = "accordion-item-context";

class UseCompCtx {
	/** Values of the open items; replaced on every change so bindings update */
	value: string[] = $state.raw([]);
	/** Unique prefix that links each trigger to its content by id */
	baseId = $state("");
	/** Whether several items can be open at once */
	multiple = $state(false);
	/** Whether every item is disabled */
	disabled = $state(false);
	/** Visual style of the accordion */
	variant: NonNullable<Props["variant"]> = $state("default");
	/** Padding and text size of the items */
	size: UiSize = $state("md");
	/** Corner radius override; follows `size` when undefined */
	rounded?: UiRounded = $state();
	/** Called with the open values when an item opens or closes */
	onValueChange?: Props["onValueChange"];

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}
	}

	/** Whether the item with this value is open. */
	isOpen(value: string) {
		return this.value.includes(value);
	}

	/** Opens or closes an item and reports the change; opening closes the others unless `multiple` is set. */
	toggle(value: string) {
		// If the item is open: close it; otherwise open it beside or instead of the others.
		if (this.isOpen(value)) this.value = this.value.filter((openValue) => openValue !== value);
		else this.value = this.multiple ? [...this.value, value] : [value];
		this.onValueChange?.(this.value);
	}

	/** Builds the trigger id for an item value; whitespace is not allowed in ids. */
	triggerId(value: string) {
		return `${this.baseId}-trigger-${value.replace(/\s+/g, "-")}`;
	}

	/** Builds the content id for an item value; whitespace is not allowed in ids. */
	contentId(value: string) {
		return `${this.baseId}-content-${value.replace(/\s+/g, "-")}`;
	}
}

class UseItemCtx {
	/** Value that identifies the item in the accordion's open values */
	value = $state("");
	/** Whether the item is disabled */
	disabled = $state(false);

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}
	}
}

export type CompCtxProps = Pick<InstanceType<typeof UseCompCtx>, "value" | "baseId" | "multiple" | "disabled" | "variant" | "size" | "rounded" | "onValueChange">;

export const setCompCtx = (props: CompCtxProps) => setContext(CONTEXT_ID, new UseCompCtx(props));

export const useCompCtx = () => getContext<ReturnType<typeof setCompCtx>>(CONTEXT_ID);

export type ItemCtxProps = Pick<InstanceType<typeof UseItemCtx>, "value" | "disabled">;

export const setItemCtx = (props: ItemCtxProps) => setContext(ITEM_CONTEXT_ID, new UseItemCtx(props));

export const useItemCtx = () => getContext<ReturnType<typeof setItemCtx>>(ITEM_CONTEXT_ID);
