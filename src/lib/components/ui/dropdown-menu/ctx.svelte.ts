import { setContext, getContext, onDestroy } from "svelte";
import type { Props, DropdownMenuSide, DropdownMenuAlign, MenuFocus } from "./index.js";

const CONTEXT_ID = "dropdown-menu-context";
const LEVEL_CONTEXT_ID = "dropdown-menu-level-context";
const SUB_CONTEXT_ID = "dropdown-menu-sub-context";
const GROUP_CONTEXT_ID = "dropdown-menu-group-context";
const RADIO_GROUP_CONTEXT_ID = "dropdown-menu-radio-group-context";
// Milliseconds an open submenu waits before closing, so the pointer can cross other items on the way to it.
const SUB_CLOSE_DELAY = 100;
// Enabled items of every kind, in order; disabled items are skipped by the keyboard.
export const ITEM_SELECTOR = '[role^="menuitem"]:not([data-disabled])';

class UseCompCtx {
	/** Whether the menu is shown */
	open = $state(false);
	/** Unique prefix for the trigger and content ids */
	baseId = $state("");
	/** Preferred side of the trigger */
	side: DropdownMenuSide = $state("bottom");
	/** Alignment along the trigger's edge */
	align: DropdownMenuAlign = $state("start");
	/** Gap in pixels between the trigger and the menu */
	sideOffset = $state(4);
	/** Size of the menu and its items */
	size: UiSize = $state("md");
	/** Corner radius override; follows `size` when undefined */
	rounded?: UiRounded = $state();
	/** Called when the menu opens or closes */
	onOpenChange?: Props["onOpenChange"];
	/** Element the menu is placed against, registered by the trigger */
	triggerEl?: HTMLElement = $state();
	/** What takes focus when the menu opens */
	initialFocus: MenuFocus = $state("menu");

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}
	}

	/** Id of the menu, referenced by the trigger's `aria-controls` */
	get contentId() {
		return `${this.baseId}-content`;
	}

	/** Id of the trigger, which names the menu */
	get triggerId() {
		return `${this.baseId}-trigger`;
	}

	/** Opens or closes the menu, sets what takes focus on open, and reports the change. */
	setOpen(open: boolean, initialFocus: MenuFocus = "menu") {
		// If the menu is already in that state: skip the update.
		if (open === this.open) return;
		this.initialFocus = initialFocus;
		this.open = open;
		this.onOpenChange?.(open);
	}

	/** Closes the menu and every submenu, and returns focus to the trigger. */
	close() {
		this.setOpen(false);
		this.triggerEl?.focus({ preventScroll: true });
	}
}

class UseLevelCtx {
	/** Submenu opened from this menu level; closes when another item at this level takes focus */
	activeSub?: UseSubCtx;

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}
	}
}

class UseSubCtx {
	/** Whether the submenu is shown */
	open = $state(false);
	/** Unique prefix for the sub trigger and sub content ids */
	baseId = $state("");
	/** Sub trigger the submenu is placed against */
	triggerEl?: HTMLElement = $state();
	/** What takes focus when the submenu opens */
	initialFocus: MenuFocus = $state("none");
	closeTimer?: ReturnType<typeof setTimeout>;

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}
		// Cancel a pending close when the submenu unmounts.
		onDestroy(() => clearTimeout(this.closeTimer));
	}

	/** Id of the submenu, referenced by the sub trigger's `aria-controls` */
	get contentId() {
		return `${this.baseId}-content`;
	}

	/** Id of the sub trigger, which names the submenu */
	get triggerId() {
		return `${this.baseId}-trigger`;
	}

	/** Opens or closes the submenu right away, and cancels a pending close. */
	setOpen(open: boolean, initialFocus: MenuFocus = "none") {
		clearTimeout(this.closeTimer);
		// If the submenu is already in that state: skip the update.
		if (open === this.open) return;
		this.initialFocus = initialFocus;
		this.open = open;
	}

	/** Closes the submenu after a short delay, unless the pointer reaches it first. */
	scheduleClose() {
		// If the submenu is closed: there is nothing to close.
		if (!this.open) return;
		clearTimeout(this.closeTimer);
		this.closeTimer = setTimeout(() => this.setOpen(false), SUB_CLOSE_DELAY);
	}

	/** Keeps the submenu open when the pointer or focus returns to it. */
	cancelClose() {
		clearTimeout(this.closeTimer);
	}

	/** Moves focus to the first enabled item of the open submenu. */
	focusFirstItem() {
		document.getElementById(this.contentId)?.querySelector<HTMLElement>(ITEM_SELECTOR)?.focus({ preventScroll: true });
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

class UseRadioGroupCtx {
	/** Value of the checked radio item */
	value = $state("");
	/** Called with the new value when a radio item is checked */
	onValueChange?: (value: string) => void;

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}
	}

	/** Checks a radio item and reports the change. */
	select(value: string) {
		// If the item is already checked: skip the update.
		if (value === this.value) return;
		this.value = value;
		this.onValueChange?.(value);
	}
}

export type CompCtxProps = Pick<InstanceType<typeof UseCompCtx>, "open" | "baseId" | "side" | "align" | "sideOffset" | "size" | "rounded" | "onOpenChange">;

export const setCompCtx = (props: CompCtxProps) => setContext(CONTEXT_ID, new UseCompCtx(props));

export const useCompCtx = () => getContext<ReturnType<typeof setCompCtx>>(CONTEXT_ID);

export const setLevelCtx = () => setContext(LEVEL_CONTEXT_ID, new UseLevelCtx({}));

export const useLevelCtx = () => getContext<ReturnType<typeof setLevelCtx>>(LEVEL_CONTEXT_ID);

export type SubCtxProps = Pick<InstanceType<typeof UseSubCtx>, "open" | "baseId">;

export const setSubCtx = (props: SubCtxProps) => setContext(SUB_CONTEXT_ID, new UseSubCtx(props));

export const useSubCtx = () => getContext<ReturnType<typeof setSubCtx>>(SUB_CONTEXT_ID);

export type GroupCtxProps = Pick<InstanceType<typeof UseGroupCtx>, "labelId">;

export const setGroupCtx = (props: GroupCtxProps) => setContext(GROUP_CONTEXT_ID, new UseGroupCtx(props));

/** Reads the group context; undefined for a label outside a group. */
export const useGroupCtx = () => getContext<ReturnType<typeof setGroupCtx> | undefined>(GROUP_CONTEXT_ID);

export type RadioGroupCtxProps = Pick<InstanceType<typeof UseRadioGroupCtx>, "value" | "onValueChange">;

export const setRadioGroupCtx = (props: RadioGroupCtxProps) => setContext(RADIO_GROUP_CONTEXT_ID, new UseRadioGroupCtx(props));

export const useRadioGroupCtx = () => getContext<ReturnType<typeof setRadioGroupCtx>>(RADIO_GROUP_CONTEXT_ID);
