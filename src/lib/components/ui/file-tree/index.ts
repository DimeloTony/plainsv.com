export { default as FileTree } from "./_.svelte";
export { default as FileTreeIcon } from "./icon.svelte";
export type { FileTreeNode } from "./utils.js";

/** Values a custom `icon` or `trailing` snippet receives for each item */
export interface ItemSnippetProps {
	/** Full path of the file or folder */
	path: string;
	/** Whether the item is a folder */
	isFolder: boolean;
	/** Whether the folder is open; always `false` for files */
	open: boolean;
	/** Whether the file is selected; always `false` for folders */
	selected: boolean;
}

/** Tree of files and folders built from paths, with one selectable file */
export interface Props extends CompProps<"ul"> {
	/** File paths, or an object keyed by path, such as editor files; a path ending in `/` is an empty folder */
	files: string[] | Record<string, unknown>;
	/** Path of the selected file; supports `bind:value` */
	value?: string;
	/** Called with the path when a file is selected */
	onValueChange?: (value: string) => void;
	/** Paths of the open folders; every folder starts open when omitted; supports `bind:expanded` */
	expanded?: string[];
	/** Called with the open folder paths when a folder opens or closes */
	onExpandedChange?: (expanded: string[]) => void;
	/** File paths drawn with the highlight, such as search matches */
	highlighted?: string[];
	/** Blocks file selection; folders still open and close */
	disabled?: boolean;
	/** Custom icon for every item; replaces the language and folder icons */
	icon?: Snippet<[ItemSnippetProps]>;
	/** Content after every item's name, such as a badge or an action */
	trailing?: Snippet<[ItemSnippetProps]>;
	/** `default` draws no box; `outline` draws a bordered card around the tree */
	variant?: "default" | "outline";
	/** Row height, text, icons, and indent on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Corner radius of the box; rows use one step smaller; follows `size` when omitted */
	rounded?: UiRounded;
	/** Classes merged onto the tree */
	class?: CompProps<"ul">["class"];
}

/** Icon picked from a path's extension, or an open or closed folder */
export interface IconProps {
	/** File or folder path; the extension picks the file icon */
	path: string;
	/** Draws a folder instead of a file icon */
	isFolder?: boolean;
	/** Draws the open folder; only used with `isFolder` */
	open?: boolean;
	/** Classes merged onto the icon */
	class?: string;
}

export type FileTreeProps = Props;
export type FileTreeIconProps = IconProps;
export type FileTreeItemSnippetProps = ItemSnippetProps;
