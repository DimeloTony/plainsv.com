import { setContext, getContext } from "svelte";
import { SvelteMap } from "svelte/reactivity";
import type { Props } from "./index.js";

const CONTEXT_ID = "select-context";
const GROUP_CONTEXT_ID = "select-group-context";

class UseCompCtx {
	/** Value of the selected item */
	value = $state("");
	/** Whether the list is shown */
	open = $state(false);
	/** Unique prefix for the list id */
	baseId = $state("");
	/** Whether the trigger is disabled */
	disabled = $state(false);
	/** Visual style of the trigger */
	variant: NonNullable<Props["variant"]> = $state("default");
	/** Size of the trigger and items */
	size: UiSize = $state("md");
	/** Corner radius override; follows `size` when null. Defaults to null, not undefined, so the constructor copies it during server rendering */
	rounded?: UiRounded | null = $state(null);
	/** Called with the new value when an item is selected */
	onValueChange?: Props["onValueChange"];
	/** Called when the list opens or closes */
	onOpenChange?: Props["onOpenChange"];
	/** Trigger element the list is placed against */
	triggerEl?: HTMLElement = $state();
	/** Text of each mounted item by value, shown by `SelectValue` and listed in the native select */
	labels = new SvelteMap<string, string>();

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}
	}

	/** Id of the list, referenced by the trigger's `aria-controls` */
	get contentId() {
		return `${this.baseId}-content`;
	}

	/** Default id of the trigger, which names the list; a passed `id` replaces it */
	get triggerId() {
		return `${this.baseId}-trigger`;
	}

	/** Opens or closes the list and reports the change. */
	setOpen(open: boolean) {
		// If the list is already in that state: skip the update.
		if (open === this.open) return;
		this.open = open;
		this.onOpenChange?.(open);
	}

	/** Selects a value, reports the change, and closes the list. */
	select(value: string) {
		// Only report a change when the value is new.
		if (value !== this.value) {
			this.value = value;
			this.onValueChange?.(value);
		}
		this.setOpen(false);
	}
}

class UseGroupCtx {
	/** Id of the group's label, referenced by the group's `aria-labelledby` */
	labelId = $state("");

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}
	}
}

export type CompCtxProps = Pick<InstanceType<typeof UseCompCtx>, "value" | "open" | "baseId" | "disabled" | "variant" | "size" | "rounded" | "onValueChange" | "onOpenChange">;

export const setCompCtx = (props: CompCtxProps) => setContext(CONTEXT_ID, new UseCompCtx(props));

export const useCompCtx = () => getContext<ReturnType<typeof setCompCtx>>(CONTEXT_ID);

export type GroupCtxProps = Pick<InstanceType<typeof UseGroupCtx>, "labelId">;

export const setGroupCtx = (props: GroupCtxProps) => setContext(GROUP_CONTEXT_ID, new UseGroupCtx(props));

/** Reads the group context; undefined for a label outside a group. */
export const useGroupCtx = () => getContext<ReturnType<typeof setGroupCtx> | undefined>(GROUP_CONTEXT_ID);
