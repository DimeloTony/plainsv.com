import { setContext, getContext } from "svelte";
import type { MenuFocus } from "#lib/components/ui/dropdown-menu/index.js";
import type { Props } from "./index.js";

const CONTEXT_ID = "menubar-context";
const MENU_CONTEXT_ID = "menubar-menu-context";

/** What the bar needs from each menu to open it */
interface MenuHandle {
	/** Opens or closes the menu, and sets what takes focus on open */
	setOpen: (open: boolean, initialFocus?: MenuFocus) => void;
}

class UseCompCtx {
	/** Value of the open menu; empty while all are closed */
	activeValue = $state("");
	/** Trigger that last had focus; it holds the single tab stop */
	focusedValue = $state("");
	/** Menu values in markup order */
	values: string[] = $state([]);
	/** Style of the triggers */
	variant: NonNullable<Props["variant"]> = $state("default");
	/** Height and padding of the bar and triggers, and the menu item size */
	size: UiSize = $state("md");
	/** Corner radius override; follows `size` when undefined */
	rounded?: UiRounded = $state();
	/** Bar element, for finding the triggers in order */
	rootEl?: HTMLElement = $state();
	/** Open handles of the menus, by value */
	menus = new Map<string, MenuHandle>();

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}
	}

	/** Trigger in the tab order: the last focused one, else the first one */
	get tabStopValue() {
		return this.focusedValue || this.values[0];
	}

	/** Adds a menu to the bar; returns a function that removes it. */
	registerMenu(value: string, menu: MenuHandle) {
		this.values.push(value);
		this.menus.set(value, menu);
		return () => {
			this.values = this.values.filter((registered) => registered !== value);
			this.menus.delete(value);
		};
	}

	/** Records a menu opening or closing; opening one closes the others. */
	setActive(value: string, open: boolean) {
		if (open) this.activeValue = value;
		else if (this.activeValue === value) this.activeValue = "";
	}

	/** Moves focus to the trigger a step away, wrapping around, and opens its menu when one was open. */
	moveToAdjacent(fromValue: string, step: number, openMenu: boolean) {
		const triggers = [...(this.rootEl?.querySelectorAll<HTMLElement>("[data-menubar-trigger]") ?? [])];
		const currentIndex = triggers.findIndex((trigger) => trigger.dataset.value === fromValue);
		// If the trigger is not in the bar: stay where focus is.
		if (currentIndex === -1) return;
		const next = triggers[(currentIndex + step + triggers.length) % triggers.length];
		const nextValue = next.dataset.value ?? "";
		next.focus();
		// If a menu was open: open the next one with its first item focused.
		if (openMenu) this.menus.get(nextValue)?.setOpen(true, "first");
	}
}

export type CompCtxProps = Pick<InstanceType<typeof UseCompCtx>, "variant" | "size" | "rounded">;

export const setCompCtx = (props: CompCtxProps) => setContext(CONTEXT_ID, new UseCompCtx(props));

export const useCompCtx = () => getContext<ReturnType<typeof setCompCtx>>(CONTEXT_ID);

/** Shares the value of the enclosing menu with its trigger and content; a getter keeps it current. */
export const setMenuCtx = (getValue: () => string) => setContext(MENU_CONTEXT_ID, getValue);

export const useMenuCtx = () => getContext<ReturnType<typeof setMenuCtx>>(MENU_CONTEXT_ID);
