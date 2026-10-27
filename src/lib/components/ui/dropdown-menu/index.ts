import type { Attachment } from "svelte/attachments";
import type { ButtonProps } from "#lib/components/ui/button/index.js";

export { default as DropdownMenu } from "./_.svelte";
export { default as DropdownMenuTrigger } from "./trigger.svelte";
export { default as DropdownMenuContent } from "./content.svelte";
export { default as DropdownMenuGroup } from "./group.svelte";
export { default as DropdownMenuLabel } from "./label.svelte";
export { default as DropdownMenuItem } from "./item.svelte";
export { default as DropdownMenuCheckboxItem } from "./checkbox-item.svelte";
export { default as DropdownMenuRadioGroup } from "./radio-group.svelte";
export { default as DropdownMenuRadioItem } from "./radio-item.svelte";
export { default as DropdownMenuSeparator } from "./separator.svelte";
export { default as DropdownMenuShortcut } from "./shortcut.svelte";
export { default as DropdownMenuSub } from "./sub.svelte";
export { default as DropdownMenuSubTrigger } from "./sub-trigger.svelte";
export { default as DropdownMenuSubContent } from "./sub-content.svelte";

/** Side of the trigger the menu opens on */
export type DropdownMenuSide = "top" | "right" | "bottom" | "left";

/** Alignment of the menu along the trigger's edge */
export type DropdownMenuAlign = "start" | "center" | "end";

/** What takes focus when a menu opens: an item, the menu itself, or nothing */
export type MenuFocus = "first" | "last" | "menu" | "none";

/** Dropdown menu settings shared with every part */
interface DropdownMenuOptions {
	/** Whether the menu is shown; supports `bind:open` */
	open?: boolean;
	/** Called when the menu opens or closes */
	onOpenChange?: (open: boolean) => void;
	/** Preferred side; flips to the opposite side when there is not enough room; defaults to `bottom` */
	side?: DropdownMenuSide;
	/** Alignment along the trigger's edge; defaults to `start` */
	align?: DropdownMenuAlign;
	/** Gap in pixels between the trigger and the menu; defaults to `4` */
	sideOffset?: number;
	/** Item size on the shared scale; defaults to `lg`, the shadcn item spacing */
	size?: UiSize;
	/** Corner radius of the menus, with items one step smaller; defaults to `md`, like shadcn. `pill` makes the panels pills too, which can clip their items, so use `3xl` or `4xl` for round panels */
	rounded?: UiRounded;
}

/** Dropdown menu props; renders no element of its own */
export type Props = CompPropsWithChildSimple<DropdownMenuOptions>;

/** Props a custom trigger spreads onto the element that opens the menu */
export interface TriggerAttrs {
	/** Id that names the menu */
	id: string;
	/** Announces that the trigger opens a menu */
	"aria-haspopup": "menu";
	/** Whether the menu is open */
	"aria-expanded": boolean;
	/** Id of the menu while it is open */
	"aria-controls"?: string;
	/** `open` or `closed`, for styling */
	"data-state": "open" | "closed";
	/** Records whether the menu was open when the press started */
	onpointerdown: () => void;
	/** Toggles the menu */
	onclick: (e: MouseEvent) => void;
	/** Opens the menu with the up and down arrows */
	onkeydown: (e: KeyboardEvent) => void;
	/** Registers the element the menu is placed against */
	[key: symbol]: Attachment<HTMLElement>;
}

/** Dropdown menu trigger props; renders an outline button unless `trigger` is given */
export interface TriggerProps {
	/** Label for the default trigger button */
	children?: Snippet;
	/** Custom trigger; spread `props` onto the element that opens the menu */
	trigger?: Snippet<[{ props: TriggerAttrs }]>;
	/** Style of the default trigger button; defaults to `outline` */
	variant?: ButtonProps["variant"];
	/** Size of the default trigger button, including the square `icon-*` sizes; follows the menu's `size` when omitted */
	size?: ButtonProps["size"];
	/** Corner radius of the default trigger button; follows its size when omitted */
	rounded?: UiRounded;
	/** Classes merged onto the default trigger button */
	class?: ButtonProps["class"];
}

/** Menu shown in the top layer beside the trigger */
export interface ContentProps extends CompPropsWithChild<"div"> {
	/** Item size of this menu; overrides the dropdown menu's `size` */
	size?: UiSize;
	/** Corner radius of this menu, with items one step smaller; overrides the dropdown menu's `rounded`. `pill` makes it a pill too, which can clip its items, so use `3xl` or `4xl` to stay round */
	rounded?: UiRounded;
	/** Classes merged onto the menu */
	class?: CompPropsWithChild<"div">["class"];
}

/** Group of related items, named by its `DropdownMenuLabel` */
export interface GroupProps extends CompPropsWithChild<"div"> {
	/** Classes merged onto the group */
	class?: CompPropsWithChild<"div">["class"];
}

/** Heading for a group; not selectable */
export interface LabelProps extends CompPropsWithChild<"div"> {
	/** Indents the label to line up with checkbox and radio item text */
	inset?: boolean;
	/** Classes merged onto the label */
	class?: CompPropsWithChild<"div">["class"];
}

/** Item that runs an action */
export interface ItemProps extends Omit<CompPropsWithChild<"div">, "role"> {
	/** Blocks selecting the item; the arrow keys skip it */
	disabled?: boolean;
	/** Visual style of the item; `destructive` marks a dangerous action */
	variant?: "default" | "destructive";
	/** Indents the item to line up with checkbox and radio item text */
	inset?: boolean;
	/** Whether selecting the item closes the menu; defaults to `true` */
	closeOnSelect?: boolean;
	/** Called when the item is selected with a click, Enter, or Space */
	onSelect?: () => void;
	/** Renders the item as a link to this URL; a click, Enter, or Space follows it */
	href?: string;
	/** Corner radius of this item with this exact value; overrides the menu's item radius */
	rounded?: UiRounded;
	/** Classes merged onto the item */
	class?: CompPropsWithChild<"div">["class"];
}

/** Item that toggles a setting on and off, with a check mark while checked */
export interface CheckboxItemProps extends Omit<CompPropsWithChild<"div">, "role"> {
	/** Whether the item is checked; supports `bind:checked` */
	checked?: boolean;
	/** Called with the new state when the item is toggled */
	onCheckedChange?: (checked: boolean) => void;
	/** Blocks toggling the item; the arrow keys skip it */
	disabled?: boolean;
	/** Whether toggling the item closes the menu; defaults to `false` */
	closeOnSelect?: boolean;
	/** Corner radius of this item with this exact value; overrides the menu's item radius */
	rounded?: UiRounded;
	/** Classes merged onto the item */
	class?: CompPropsWithChild<"div">["class"];
}

/** Group of radio items where one is checked at a time */
export interface RadioGroupProps extends CompPropsWithChild<"div"> {
	/** Value of the checked radio item; supports `bind:value` */
	value?: string;
	/** Called with the new value when a radio item is checked */
	onValueChange?: (value: string) => void;
	/** Classes merged onto the group */
	class?: CompPropsWithChild<"div">["class"];
}

/** Item in a radio group, with a dot while checked */
export interface RadioItemProps extends Omit<CompPropsWithChild<"div">, "role"> {
	/** Value set on the radio group when this item is checked */
	value: string;
	/** Blocks checking the item; the arrow keys skip it */
	disabled?: boolean;
	/** Whether checking the item closes the menu; defaults to `false` */
	closeOnSelect?: boolean;
	/** Corner radius of this item with this exact value; overrides the menu's item radius */
	rounded?: UiRounded;
	/** Classes merged onto the item */
	class?: CompPropsWithChild<"div">["class"];
}

/** Divider between groups */
export interface SeparatorProps extends CompProps<"div"> {
	/** Classes merged onto the separator */
	class?: CompProps<"div">["class"];
}

/** Muted keyboard shortcut hint at the end of an item */
export interface ShortcutProps extends CompPropsWithChild<"span"> {
	/** Classes merged onto the shortcut */
	class?: CompPropsWithChild<"span">["class"];
}

/** Submenu props; renders no element of its own */
export type SubProps = CompPropsWithChildSimple<{
	/** Whether the submenu is shown; supports `bind:open` */
	open?: boolean;
}>;

/** Item that opens a submenu on hover, click, or the right arrow */
export interface SubTriggerProps extends Omit<CompPropsWithChild<"div">, "role"> {
	/** Blocks opening the submenu; the arrow keys skip it */
	disabled?: boolean;
	/** Indents the item to line up with checkbox and radio item text */
	inset?: boolean;
	/** Corner radius of this item with this exact value; overrides the menu's item radius */
	rounded?: UiRounded;
	/** Classes merged onto the item */
	class?: CompPropsWithChild<"div">["class"];
}

/** Submenu shown in the top layer beside its sub trigger */
export interface SubContentProps extends CompPropsWithChild<"div"> {
	/** Item size of this submenu; overrides the dropdown menu's `size` */
	size?: UiSize;
	/** Corner radius of this submenu, with items one step smaller; overrides the dropdown menu's `rounded`. `pill` makes it a pill too, which can clip its items, so use `3xl` or `4xl` to stay round */
	rounded?: UiRounded;
	/** Classes merged onto the submenu */
	class?: CompPropsWithChild<"div">["class"];
}

/** Internal menu panel shared by the content and sub content */
export interface MenuProps extends CompPropsWithChild<"div"> {
	/** Whether the panel is shown */
	open: boolean;
	/** Element the panel is placed against */
	anchor?: HTMLElement;
	/** Preferred side of the anchor */
	side: DropdownMenuSide;
	/** Alignment along the anchor's edge */
	align: DropdownMenuAlign;
	/** Gap in pixels between the anchor and the panel */
	sideOffset: number;
	/** Shift in pixels along the anchor's edge */
	alignOffset?: number;
	/** What takes focus when the panel opens */
	initialFocus: MenuFocus;
	/** Called when the browser hides the panel, such as on Escape or an outside click */
	onDismiss: () => void;
	/** Called when the left arrow is pressed in the panel */
	onArrowLeft?: () => void;
	/** Item size of the panel; follows the dropdown menu's `size` when omitted */
	size?: UiSize;
	/** Corner radius of the panel; follows the dropdown menu's `rounded` when omitted. `pill` makes the panels pills too, which can clip their items, so use `3xl` or `4xl` for round panels */
	rounded?: UiRounded;
	/** Classes merged onto the panel */
	class?: CompPropsWithChild<"div">["class"];
}

/** Internal item shared by every item kind */
export interface MenuItemProps extends CompPropsWithChild<"div"> {
	/** Item role, which sets how assistive technology announces it */
	role: "menuitem" | "menuitemcheckbox" | "menuitemradio";
	/** Blocks selecting the item; the arrow keys skip it */
	disabled?: boolean;
	/** Visual style of the item */
	variant?: "default" | "destructive";
	/** Indents the item text past the indicator column */
	inset?: boolean;
	/** Keeps the highlight when the pointer leaves, such as while a submenu is open */
	keepHighlight?: boolean;
	/** Called when the item is selected with a click, Enter, or Space */
	onSelect?: () => void;
	/** Leading check mark or dot, shown in the indicator column */
	indicator?: Snippet;
	/** Trailing content after the text, such as a chevron */
	trailing?: Snippet;
	/** Renders the item as a link to this URL */
	href?: string;
	/** Corner radius of the item with this exact value; follows the panel when omitted */
	rounded?: UiRounded;
	/** Classes merged onto the item */
	class?: CompPropsWithChild<"div">["class"];
}

export type DropdownMenuProps = Props;
export type DropdownMenuTriggerProps = TriggerProps;
export type DropdownMenuTriggerAttrs = TriggerAttrs;
export type DropdownMenuContentProps = ContentProps;
export type DropdownMenuGroupProps = GroupProps;
export type DropdownMenuLabelProps = LabelProps;
export type DropdownMenuItemProps = ItemProps;
export type DropdownMenuCheckboxItemProps = CheckboxItemProps;
export type DropdownMenuRadioGroupProps = RadioGroupProps;
export type DropdownMenuRadioItemProps = RadioItemProps;
export type DropdownMenuSeparatorProps = SeparatorProps;
export type DropdownMenuShortcutProps = ShortcutProps;
export type DropdownMenuSubProps = SubProps;
export type DropdownMenuSubTriggerProps = SubTriggerProps;
export type DropdownMenuSubContentProps = SubContentProps;
