export { default as ContextMenu } from "./_.svelte";
export { default as ContextMenuTrigger } from "./trigger.svelte";
// The menu, items, and submenus are the dropdown menu's parts, opened at the pointer instead of below a button.
export { DropdownMenuContent as ContextMenuContent, DropdownMenuGroup as ContextMenuGroup, DropdownMenuLabel as ContextMenuLabel, DropdownMenuItem as ContextMenuItem, DropdownMenuCheckboxItem as ContextMenuCheckboxItem, DropdownMenuRadioGroup as ContextMenuRadioGroup, DropdownMenuRadioItem as ContextMenuRadioItem, DropdownMenuSeparator as ContextMenuSeparator, DropdownMenuShortcut as ContextMenuShortcut, DropdownMenuSub as ContextMenuSub, DropdownMenuSubTrigger as ContextMenuSubTrigger, DropdownMenuSubContent as ContextMenuSubContent } from "#lib/components/ui/dropdown-menu/index.js";

/** Context menu props; renders no element of its own */
export type Props = CompPropsWithChildSimple<{
	/** Whether the menu is shown; supports `bind:open` */
	open?: boolean;
	/** Called when the menu opens or closes */
	onOpenChange?: (open: boolean) => void;
	/** Item size on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Corner radius of the menus and items; follows `size` when omitted. `pill` makes the panels pills too, which can clip their items, so use `3xl` or `4xl` for round panels */
	rounded?: UiRounded;
}>;

/** Props a custom trigger spreads onto the element that opens the menu */
export interface TriggerAttrs {
	/** `open` or `closed`, for styling */
	"data-state": "open" | "closed";
	/** Set while the trigger keeps the browser's own context menu */
	"data-disabled"?: true;
	/** Opens the menu at the pointer instead of the browser's context menu */
	oncontextmenu: (e: MouseEvent) => void;
}

/** Area that opens the menu at the pointer on right-click, a long press, or the context menu key; renders a `div` unless `trigger` is given */
export interface TriggerProps extends Omit<CompProps<"div">, "children"> {
	/** Keeps the browser's own context menu instead */
	disabled?: boolean;
	/** Content of the default area */
	children?: Snippet;
	/** Custom trigger; spread `props` onto the element that opens the menu */
	trigger?: Snippet<[{ props: TriggerAttrs }]>;
	/** Classes merged onto the default area */
	class?: CompProps<"div">["class"];
}

export type ContextMenuProps = Props;
export type ContextMenuTriggerProps = TriggerProps;
export type ContextMenuTriggerAttrs = TriggerAttrs;
