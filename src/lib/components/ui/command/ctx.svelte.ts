import { setContext, getContext } from "svelte";
import { SvelteMap } from "svelte/reactivity";
import type { Props } from "./index.js";

const CONTEXT_ID = "command-context";
// Enabled items that match the search, in order; the keyboard moves through these.
const ITEM_SELECTOR = '[role="option"]:not([data-disabled]):not([hidden])';

/** Matches when every word of the search appears in the text, ignoring case. */
const defaultFilter = (text: string, search: string) => {
	const haystack = text.toLowerCase();
	return search
		.toLowerCase()
		.split(/\s+/)
		.filter(Boolean)
		.every((word) => haystack.includes(word));
};

class UseCompCtx {
	/** Value of the highlighted item */
	value = $state("");
	/** Text typed in `CommandInput` */
	search = $state("");
	/** Unique prefix for the part ids */
	baseId = $state("");
	/** Whether items that do not match the search are hidden */
	shouldFilter = $state(true);
	/** Whether the arrow keys wrap between the first and last items */
	loop = $state(false);
	/** Custom match function; the default matches every word of the search */
	filter?: Props["filter"] = $state();
	/** Called with the new value when the highlight moves */
	onValueChange?: Props["onValueChange"];
	/** Called with the new text as the user types */
	onSearchChange?: Props["onSearchChange"];
	/** Root element, searched for the visible items in order */
	rootEl?: HTMLElement = $state();
	/** Search data of each mounted item by item id */
	items = new SvelteMap<string, ItemData>();

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}
	}

	/** Id of the list, referenced by the input's `aria-controls` */
	get listId() {
		return `${this.baseId}-list`;
	}

	/** Whether the search is currently hiding items */
	get isFiltering() {
		return this.shouldFilter && this.search.trim() !== "";
	}

	/** Id of the highlighted item while it is visible, referenced by the input's `aria-activedescendant` */
	get activeId() {
		for (const [id, item] of this.items) {
			if (item.value === this.value && this.isVisible(id)) return id;
		}
		return undefined;
	}

	/** Whether an item matches the search. */
	isVisible(id: string) {
		const item = this.items.get(id);
		// If the item has not registered yet or nothing is filtering: show it.
		if (!item || !this.isFiltering) return true;
		return (this.filter ?? defaultFilter)([item.text, item.value, ...item.keywords].join(" "), this.search);
	}

	/** Enabled items that match the search, in document order. */
	getItems() {
		return [...(this.rootEl?.querySelectorAll<HTMLElement>(ITEM_SELECTOR) ?? [])];
	}

	/** Highlights an item by value and reports the change. */
	highlight(value: string) {
		// If the item is already highlighted: skip the update.
		if (value === this.value) return;
		this.value = value;
		this.onValueChange?.(value);
	}

	/** Highlights the first enabled item that matches the search. */
	highlightFirst() {
		this.highlight(this.getItems()[0]?.dataset.value ?? "");
	}

	/** Sets the search text and reports the change. */
	setSearch(search: string) {
		// If the text did not change: skip the update.
		if (search === this.search) return;
		this.search = search;
		this.onSearchChange?.(search);
	}
}

export type CompCtxProps = Pick<InstanceType<typeof UseCompCtx>, "value" | "search" | "baseId" | "shouldFilter" | "loop" | "filter" | "onValueChange" | "onSearchChange">;

export const setCompCtx = (props: CompCtxProps) => setContext(CONTEXT_ID, new UseCompCtx(props));

export const useCompCtx = () => getContext<ReturnType<typeof setCompCtx>>(CONTEXT_ID);

/** Text an item is searched by */
interface ItemData {
	/** Value reported when the item is highlighted or selected */
	value: string;
	/** Visible text of the item, without its shortcut */
	text: string;
	/** Extra words that also match the item */
	keywords: string[];
}
