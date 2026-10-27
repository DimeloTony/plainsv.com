import { setContext, getContext } from "svelte";
import type { Props } from "./index.js";

const CONTEXT_ID = "tabs-context";
const LIST_CONTEXT_ID = "tabs-list-context";

class UseCompCtx {
	/** Value of the active tab */
	value = $state("");
	/** Unique prefix that links each trigger to its panel by id */
	baseId = $state("");
	/** Direction of the list; the arrow keys follow it */
	orientation: NonNullable<Props["orientation"]> = $state("horizontal");
	/** Whether moving focus with the arrow keys also opens the tab */
	activationMode: NonNullable<Props["activationMode"]> = $state("automatic");
	/** Visual style of the list and triggers */
	variant: NonNullable<Props["variant"]> = $state("default");
	/** Size of the list and triggers */
	size: UiSize = $state("md");
	/** Corner radius override; follows `size` when undefined */
	rounded?: UiRounded = $state();
	/** Called with the new value when a tab opens */
	onValueChange?: Props["onValueChange"];

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}
	}

	/** Opens a tab and reports the change. */
	select(value: string) {
		// If the tab is already open: skip the update.
		if (value === this.value) return;
		this.value = value;
		this.onValueChange?.(value);
	}

	/** Builds the trigger id for a tab value; whitespace is not allowed in ids. */
	triggerId(value: string) {
		return `${this.baseId}-trigger-${value.replace(/\s+/g, "-")}`;
	}

	/** Builds the panel id for a tab value; whitespace is not allowed in ids. */
	contentId(value: string) {
		return `${this.baseId}-content-${value.replace(/\s+/g, "-")}`;
	}
}

class UseListCtx {
	/** Visual style of the list, which its triggers follow */
	variant: NonNullable<Props["variant"]> = $state("default");

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}
	}
}

export type CompCtxProps = Pick<InstanceType<typeof UseCompCtx>, "value" | "baseId" | "orientation" | "activationMode" | "variant" | "size" | "rounded" | "onValueChange">;

export const setCompCtx = (props: CompCtxProps) => setContext(CONTEXT_ID, new UseCompCtx(props));

export const useCompCtx = () => getContext<ReturnType<typeof setCompCtx>>(CONTEXT_ID);

export type ListCtxProps = Pick<InstanceType<typeof UseListCtx>, "variant">;

export const setListCtx = (props: ListCtxProps) => setContext(LIST_CONTEXT_ID, new UseListCtx(props));

/** The list a trigger sits in; undefined when the trigger is outside a `TabsList`. */
export const useListCtx = () => getContext<ReturnType<typeof setListCtx> | undefined>(LIST_CONTEXT_ID);
