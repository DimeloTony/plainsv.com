export { default as Command } from "./_.svelte";
export { default as CommandDialog } from "./dialog.svelte";
export { default as CommandInput } from "./input.svelte";
export { default as CommandList } from "./list.svelte";
export { default as CommandEmpty } from "./empty.svelte";
export { default as CommandGroup } from "./group.svelte";
export { default as CommandItem } from "./item.svelte";
export { default as CommandSeparator } from "./separator.svelte";
export { default as CommandShortcut } from "./shortcut.svelte";

/** Command root that filters its items by the search and moves the highlight with the keyboard */
export interface Props extends CompPropsWithChild<"div"> {
	/** Value of the highlighted item; supports `bind:value` */
	value?: string;
	/** Called with the new value when the highlight moves */
	onValueChange?: (value: string) => void;
	/** Text in `CommandInput`; supports `bind:search` */
	search?: string;
	/** Called with the new text as the user types */
	onSearchChange?: (search: string) => void;
	/** Hides items that do not match the search; set `false` to filter the items yourself; defaults to `true` */
	shouldFilter?: boolean;
	/** Decides whether an item matches; receives the item's text, value, and keywords joined by spaces */
	filter?: (text: string, search: string) => boolean;
	/** Wraps the arrow keys between the first and last items; defaults to `false` */
	loop?: boolean;
	/** Input height, item padding, and text on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Corner radius of the root and items; follows `size` when omitted. `pill` makes the panels pills too, which can clip their items, so use `3xl` or `4xl` for round panels */
	rounded?: UiRounded;
	/** Classes merged onto the root */
	class?: CompPropsWithChild<"div">["class"];
}

/** Command menu in a modal dialog; takes every `Command` prop */
export interface DialogProps extends Props {
	/** Whether the dialog is shown; supports `bind:open` */
	open?: boolean;
	/** Accessible name of the dialog; defaults to `"Command menu"` */
	title?: string;
}

/** Search field that filters the items; extra attributes go on the `input` */
export interface InputProps extends Omit<CompProps<"input">, "value" | "type"> {
	/** Classes merged onto the wrapper around the icon and input */
	class?: CompProps<"input">["class"];
}

/** Scrolling list that holds the groups, items, and empty state */
export interface ListProps extends CompPropsWithChild<"div"> {
	/** Classes merged onto the list */
	class?: CompPropsWithChild<"div">["class"];
}

/** Message shown while no item matches the search; place it inside `CommandList` */
export interface EmptyProps extends CompPropsWithChild<"div"> {
	/** Classes merged onto the message */
	class?: CompPropsWithChild<"div">["class"];
}

/** Group of related items; hidden while none of them match */
export interface GroupProps extends CompPropsWithChild<"div"> {
	/** Muted heading above the items; also names the group */
	heading?: string;
	/** Classes merged onto the group */
	class?: CompPropsWithChild<"div">["class"];
}

/** Item the search filters and the user selects */
export interface ItemProps extends CompPropsWithChild<"div"> {
	/** Value reported to `onSelect` and the root `value`; defaults to the item's text */
	value?: string;
	/** Extra words that also match the item, such as synonyms */
	keywords?: string[];
	/** Blocks selecting the item; the arrow keys skip it */
	disabled?: boolean;
	/** Called with the item's value when it is clicked or chosen with Enter */
	onSelect?: (value: string) => void;
	/** Corner radius of this item with this exact value; overrides the list's item radius */
	rounded?: UiRounded;
	/** Classes merged onto the item */
	class?: CompPropsWithChild<"div">["class"];
}

/** Divider between groups; hidden while searching */
export interface SeparatorProps extends CompProps<"div"> {
	/** Classes merged onto the separator */
	class?: CompProps<"div">["class"];
}

/** Keyboard shortcut hint at the end of an item; left out of the item's search text */
export interface ShortcutProps extends CompPropsWithChild<"span"> {
	/** Classes merged onto the shortcut */
	class?: CompPropsWithChild<"span">["class"];
}

export type CommandProps = Props;
export type CommandDialogProps = DialogProps;
export type CommandInputProps = InputProps;
export type CommandListProps = ListProps;
export type CommandEmptyProps = EmptyProps;
export type CommandGroupProps = GroupProps;
export type CommandItemProps = ItemProps;
export type CommandSeparatorProps = SeparatorProps;
export type CommandShortcutProps = ShortcutProps;
