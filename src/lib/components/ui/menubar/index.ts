import type { Attachment } from "svelte/attachments";

export { default as Menubar } from "./_.svelte";
export { default as MenubarMenu } from "./menu.svelte";
export { default as MenubarTrigger } from "./trigger.svelte";
export { default as MenubarContent } from "./content.svelte";
// The items and submenus are the dropdown menu's parts.
export { DropdownMenuGroup as MenubarGroup, DropdownMenuLabel as MenubarLabel, DropdownMenuItem as MenubarItem, DropdownMenuCheckboxItem as MenubarCheckboxItem, DropdownMenuRadioGroup as MenubarRadioGroup, DropdownMenuRadioItem as MenubarRadioItem, DropdownMenuSeparator as MenubarSeparator, DropdownMenuShortcut as MenubarShortcut, DropdownMenuSub as MenubarSub, DropdownMenuSubTrigger as MenubarSubTrigger, DropdownMenuSubContent as MenubarSubContent } from "#lib/components/ui/dropdown-menu/index.js";

/** Bar of menus, such as File, Edit, and View in a desktop app */
export interface Props extends CompPropsWithChild<"div"> {
	/** Style of the triggers; `ghost` also drops the bar's border, shadow, and background; defaults to `default` */
	variant?: "default" | "outline" | "ghost" | "secondary";
	/** Height, trigger padding, and menu item size on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Corner radius of the bar, with triggers one step smaller; follows `size` when omitted. `pill` makes the panels pills too, which can clip their items, so use `3xl` or `4xl` for round panels */
	rounded?: UiRounded;
	/** Classes merged onto the bar */
	class?: CompPropsWithChild<"div">["class"];
}

/** One menu in the bar; holds its trigger and content */
export type MenuProps = CompPropsWithChildSimple<{
	/** Unique name of the menu; generated when omitted */
	value?: string;
}>;

/** Props a custom trigger spreads onto the element that opens its menu */
export interface TriggerAttrs {
	/** Announces the element as an item of the bar */
	role: "menuitem";
	/** Id that names the menu */
	id: string;
	/** Announces that the trigger opens a menu */
	"aria-haspopup": "menu";
	/** Whether the menu is open */
	"aria-expanded": boolean;
	/** Id of the menu while it is open */
	"aria-controls"?: string;
	/** `0` for the trigger that holds the bar's single tab stop, `-1` for the rest */
	tabindex: 0 | -1;
	/** Marks the element as a trigger that the left and right arrows move between */
	"data-menubar-trigger": true;
	/** Name of the menu */
	"data-value": string;
	/** `open` or `closed`, for styling */
	"data-state": "open" | "closed";
	/** Records whether the menu was open when the press started */
	onpointerdown: () => void;
	/** Toggles the menu */
	onclick: (e: MouseEvent) => void;
	/** Switches to this menu on hover while another menu is open */
	onpointerenter: (e: PointerEvent) => void;
	/** Moves between triggers and opens the menu with the arrow keys */
	onkeydown: (e: KeyboardEvent) => void;
	/** Gives this trigger the bar's tab stop */
	onfocus: () => void;
	/** Registers the element the menu is placed against */
	[key: symbol]: Attachment<HTMLElement>;
}

/** Button in the bar that opens its menu; renders a button unless `trigger` is given */
export interface TriggerProps extends Omit<CompProps<"button">, "children"> {
	/** Label for the default trigger button */
	children?: Snippet;
	/** Custom trigger; spread `props` onto the element that opens the menu */
	trigger?: Snippet<[{ props: TriggerAttrs }]>;
	/** Style of the default trigger; overrides the bar's `variant` */
	variant?: Props["variant"];
	/** Padding and text of the default trigger; overrides the bar's `size` */
	size?: UiSize;
	/** Corner radius of the default trigger with this exact value; overrides the inherited radius */
	rounded?: UiRounded;
	/** Classes merged onto the default trigger */
	class?: CompProps<"button">["class"];
}

/** Menu shown below its trigger */
export interface ContentProps extends CompPropsWithChild<"div"> {
	/** Item size of this menu; overrides the bar's `size` */
	size?: UiSize;
	/** Corner radius of this menu, with items one step smaller; overrides the bar's `rounded`. `pill` makes it a pill too, which can clip its items, so use `3xl` or `4xl` to stay round */
	rounded?: UiRounded;
	/** Classes merged onto the menu */
	class?: CompPropsWithChild<"div">["class"];
}

export type MenubarProps = Props;
export type MenubarMenuProps = MenuProps;
export type MenubarTriggerProps = TriggerProps;
export type MenubarTriggerAttrs = TriggerAttrs;
export type MenubarContentProps = ContentProps;
