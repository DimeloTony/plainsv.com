import { setContext, getContext } from "svelte";
import { getParentPaths, getVisiblePaths } from "./utils.js";
import type { Props } from "./index.js";
import type { FileTreeNode } from "./utils.js";

const CONTEXT_ID = "file-tree-context";

class UseCompCtx {
	/** Files and folders built from the `files` prop */
	tree: FileTreeNode[] = $state([]);
	/** Path of the selected file; empty while none is selected */
	value = $state("");
	/** Paths of the open folders */
	expanded: string[] = $state([]);
	/** Paths drawn with the highlight, such as search matches */
	highlighted: ReadonlySet<string> = $state(new Set());
	/** Blocks file selection; folders still open and close */
	disabled = $state(false);
	/** Path of the last focused item */
	focused = $state("");
	/** Custom icon for every item */
	icon?: Props["icon"] = $state();
	/** Content after every item's name */
	trailing?: Props["trailing"] = $state();
	/** Called with the path when a file is selected */
	onValueChange?: Props["onValueChange"];
	/** Called with the open folder paths when a folder opens or closes */
	onExpandedChange?: Props["onExpandedChange"];
	/** Paths of the items on screen in order */
	visiblePaths = $derived(getVisiblePaths(this.tree, this.expanded));
	/** Path of the one item Tab reaches: the last focused item, else the selected file, else the first item */
	tabStop = $derived([this.focused, this.value].find((path) => this.visiblePaths.includes(path)) ?? this.visiblePaths[0] ?? "");

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}
	}

	/** Whether a folder is open. */
	isExpanded(path: string) {
		return this.expanded.includes(path);
	}

	/** Selects a file and reports the change. */
	select(path: string) {
		// If selection is disabled or the file is already selected: skip the update.
		if (this.disabled || path === this.value) return;
		this.value = path;
		this.onValueChange?.(path);
	}

	/** Opens or closes a folder and reports the change. */
	setExpanded(path: string, open: boolean) {
		// If the folder is already in that state: skip the update.
		if (open === this.isExpanded(path)) return;
		this.expanded = open ? [...this.expanded, path] : this.expanded.filter((expandedPath) => expandedPath !== path);
		this.onExpandedChange?.(this.expanded);
	}

	/** Opens a closed folder or closes an open one. */
	toggle(path: string) {
		this.setExpanded(path, !this.isExpanded(path));
	}

	/** Opens every folder around a path, so a file selected from outside the tree is on screen. */
	reveal(path: string) {
		for (const parentPath of getParentPaths(path)) this.setExpanded(parentPath, true);
	}
}

export type CompCtxProps = Pick<InstanceType<typeof UseCompCtx>, "tree" | "value" | "expanded" | "highlighted" | "disabled" | "icon" | "trailing" | "onValueChange" | "onExpandedChange">;

export const setCompCtx = (props: CompCtxProps) => setContext(CONTEXT_ID, new UseCompCtx(props));

export const useCompCtx = () => getContext<ReturnType<typeof setCompCtx>>(CONTEXT_ID);
