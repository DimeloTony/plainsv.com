import type { Attachment } from "svelte/attachments";

export { default as Select } from "./_.svelte";
export { default as SelectTrigger } from "./trigger.svelte";
export { default as SelectValue } from "./value.svelte";
export { default as SelectContent } from "./content.svelte";
export { default as SelectGroup } from "./group.svelte";
export { default as SelectLabel } from "./label.svelte";
export { default as SelectItem } from "./item.svelte";
export { default as SelectSeparator } from "./separator.svelte";

/** Select settings shared with every part */
interface SelectOptions {
	/** Value of the selected item; supports `bind:value` */
	value?: string;
	/** Starting value when `value` is not set */
	defaultValue?: string;
	/** Called with the new value when an item is selected */
	onValueChange?: (value: string) => void;
	/** Whether the list is shown; supports `bind:open` */
	open?: boolean;
	/** Called when the list opens or closes */
	onOpenChange?: (open: boolean) => void;
	/** Dims the trigger and blocks opening */
	disabled?: boolean;
	/** Form field name; the value submits through a hidden native select */
	name?: string;
	/** Blocks form submission until a value is selected; needs `name` */
	required?: boolean;
	/** Visual style of the trigger */
	variant?: "default" | "secondary" | "ghost";
	/** Trigger height and item size on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Corner radius of the trigger, list, and items; follows `size` when omitted. `pill` makes the panels pills too, which can clip their items, so use `3xl` or `4xl` for round panels */
	rounded?: UiRounded;
}

/** Select props; renders no element of its own */
export type Props = CompPropsWithChildSimple<SelectOptions>;

/** Props a custom trigger spreads onto the element that opens the list */
export interface TriggerAttrs {
	/** Announces the element as a combobox */
	role: "combobox";
	/** Id that names the list */
	id: string;
	/** Announces that the trigger opens a listbox */
	"aria-haspopup": "listbox";
	/** Whether the list is open */
	"aria-expanded": boolean;
	/** Id of the list */
	"aria-controls": string;
	/** Whether the select is disabled */
	disabled: boolean;
	/** `open` or `closed`, for styling */
	"data-state": "open" | "closed";
	/** Records whether the list was open when the press started */
	onpointerdown: () => void;
	/** Toggles the list */
	onclick: (e: MouseEvent) => void;
	/** Opens the list with the up and down arrows */
	onkeydown: (e: KeyboardEvent) => void;
	/** Registers the element the list is placed against */
	[key: symbol]: Attachment<HTMLElement>;
}

/** Button that opens the list and holds the `SelectValue`; renders a button with a chevron unless `trigger` is given */
export interface TriggerProps extends Omit<CompProps<"button">, "children"> {
	/** Content of the default trigger button, such as a `SelectValue` */
	children?: Snippet;
	/** Custom trigger; spread `props` onto the element that opens the list */
	trigger?: Snippet<[{ props: TriggerAttrs }]>;
	/** Style of the default trigger; overrides the select's `variant` */
	variant?: Props["variant"];
	/** Height, padding, and text of the default trigger; overrides the select's `size` */
	size?: UiSize;
	/** Corner radius of the default trigger; overrides the select's `rounded` */
	rounded?: UiRounded;
	/** Classes merged onto the default trigger */
	class?: CompProps<"button">["class"];
}

/** Text of the selected item, or the placeholder when nothing is selected */
export interface ValueProps extends CompProps<"span"> {
	/** Text shown when no item is selected */
	placeholder?: string;
	/** Text of the selected item, shown before the items mount, such as during server rendering */
	label?: string;
	/** Classes merged onto the value */
	class?: CompProps<"span">["class"];
}

/** List of items shown in the top layer below the trigger */
export interface ContentProps extends CompPropsWithChild<"div"> {
	/** Item size of this list; overrides the select's `size` */
	size?: UiSize;
	/** Corner radius of this list, with items one step smaller; overrides the select's `rounded`. `pill` makes it a pill too, which can clip its items, so use `3xl` or `4xl` to stay round */
	rounded?: UiRounded;
	/** Classes merged onto the list */
	class?: CompPropsWithChild<"div">["class"];
}

/** Group of related items, named by its `SelectLabel` */
export interface GroupProps extends CompPropsWithChild<"div"> {
	/** Classes merged onto the group */
	class?: CompPropsWithChild<"div">["class"];
}

/** Heading for a group; not selectable */
export interface LabelProps extends CompPropsWithChild<"div"> {
	/** Classes merged onto the label */
	class?: CompPropsWithChild<"div">["class"];
}

/** Selectable option */
export interface ItemProps extends CompPropsWithChild<"div"> {
	/** Value set on the select when this item is chosen */
	value: string;
	/** Blocks selecting the item; the arrow keys skip it */
	disabled?: boolean;
	/** Text shown in `SelectValue` and matched by typeahead; defaults to the item's text */
	label?: string;
	/** Corner radius of this item with this exact value; overrides the list's item radius */
	rounded?: UiRounded;
	/** Classes merged onto the item */
	class?: CompPropsWithChild<"div">["class"];
}

/** Divider between groups */
export interface SeparatorProps extends CompProps<"div"> {
	/** Classes merged onto the separator */
	class?: CompProps<"div">["class"];
}

export type SelectProps = Props;
export type SelectTriggerProps = TriggerProps;
export type SelectTriggerAttrs = TriggerAttrs;
export type SelectValueProps = ValueProps;
export type SelectContentProps = ContentProps;
export type SelectGroupProps = GroupProps;
export type SelectLabelProps = LabelProps;
export type SelectItemProps = ItemProps;
export type SelectSeparatorProps = SeparatorProps;
