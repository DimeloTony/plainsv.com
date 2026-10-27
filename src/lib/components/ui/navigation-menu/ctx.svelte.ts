import { setContext, getContext } from "svelte";
import type { Props } from "./index.js";

const CONTEXT_ID = "navigation-menu-context";
const ITEM_CONTEXT_ID = "navigation-menu-item-context";
const CONTENT_CONTEXT_ID = "navigation-menu-content-context";
// Milliseconds the content stays open after the pointer leaves its item, so it can cross small gaps.
const CLOSE_DELAY = 150;

class UseCompCtx {
	/** Value of the open item; empty while every item is closed */
	value = $state("");
	/** Unique prefix that links each trigger to its content by id */
	baseId = $state("");
	/** Milliseconds the pointer rests on a trigger before its content opens */
	delayDuration = $state(200);
	/** Style of the triggers and top-level links */
	variant: NonNullable<Props["variant"]> = $state("default");
	/** Called with the open item's value when an item opens or closes */
	onValueChange?: Props["onValueChange"];
	/** Pending hover open */
	openTimer?: ReturnType<typeof setTimeout>;
	/** Pending close after the pointer left an item */
	closeTimer?: ReturnType<typeof setTimeout>;

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}
	}

	/** Builds the trigger id for an item value; whitespace is not allowed in ids. */
	triggerId(value: string) {
		return `${this.baseId}-trigger-${value.replace(/\s+/g, "-")}`;
	}

	/** Builds the content id for an item value; whitespace is not allowed in ids. */
	contentId(value: string) {
		return `${this.baseId}-content-${value.replace(/\s+/g, "-")}`;
	}

	/** Sets the open item and reports the change. */
	setValue(value: string) {
		// If that item is already open: skip the update.
		if (value === this.value) return;
		this.value = value;
		this.onValueChange?.(value);
	}

	/** Cancels any pending hover open or close. */
	clearTimers() {
		clearTimeout(this.openTimer);
		clearTimeout(this.closeTimer);
	}

	/** Opens an item right away, closing any other. */
	open(value: string) {
		this.clearTimers();
		this.setValue(value);
	}

	/** Closes every item right away. */
	close() {
		this.clearTimers();
		this.setValue("");
	}

	/** Opens an item after the hover delay, or right away while another item is already open. */
	scheduleOpen(value: string) {
		this.clearTimers();
		// If another item is open: switch without waiting, so moving across the triggers feels instant.
		if (this.value) this.setValue(value);
		else this.openTimer = setTimeout(() => this.setValue(value), this.delayDuration);
	}

	/** Closes every item after a short delay, unless the pointer comes back first. */
	scheduleClose() {
		this.clearTimers();
		this.closeTimer = setTimeout(() => this.setValue(""), CLOSE_DELAY);
	}
}

class UseItemCtx {
	/** Value that identifies the item in the menu's open value */
	value = $state("");

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}
	}
}

export type CompCtxProps = Pick<InstanceType<typeof UseCompCtx>, "value" | "baseId" | "delayDuration" | "variant" | "onValueChange">;

export const setCompCtx = (props: CompCtxProps) => setContext(CONTEXT_ID, new UseCompCtx(props));

export const useCompCtx = () => getContext<ReturnType<typeof setCompCtx>>(CONTEXT_ID);

export type ItemCtxProps = Pick<InstanceType<typeof UseItemCtx>, "value">;

export const setItemCtx = (props: ItemCtxProps) => setContext(ITEM_CONTEXT_ID, new UseItemCtx(props));

export const useItemCtx = () => getContext<ReturnType<typeof setItemCtx>>(ITEM_CONTEXT_ID);

/** Marks the parts inside a content panel, so links there use the panel style. */
export const setContentCtx = () => setContext(CONTENT_CONTEXT_ID, true);

/** Whether the part renders inside a content panel. */
export const useContentCtx = () => getContext<boolean | undefined>(CONTENT_CONTEXT_ID) ?? false;
