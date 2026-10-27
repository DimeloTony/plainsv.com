import type { ButtonProps } from "#lib/components/ui/button/index.js";
import type { InputProps } from "#lib/components/ui/input/index.js";

export { default as Sidebar } from "./_.svelte";
export { default as SidebarProvider } from "./provider.svelte";
export { default as SidebarTrigger } from "./trigger.svelte";
export { default as SidebarRail } from "./rail.svelte";
export { default as SidebarInset } from "./inset.svelte";
export { default as SidebarInput } from "./input.svelte";
export { default as SidebarHeader } from "./header.svelte";
export { default as SidebarFooter } from "./footer.svelte";
export { default as SidebarSeparator } from "./separator.svelte";
export { default as SidebarContent } from "./content.svelte";
export { default as SidebarGroup } from "./group.svelte";
export { default as SidebarGroupLabel } from "./group-label.svelte";
export { default as SidebarGroupAction } from "./group-action.svelte";
export { default as SidebarGroupContent } from "./group-content.svelte";
export { default as SidebarMenu } from "./menu.svelte";
export { default as SidebarMenuItem } from "./menu-item.svelte";
export { default as SidebarMenuButton } from "./menu-button.svelte";
export { default as SidebarMenuAction } from "./menu-action.svelte";
export { default as SidebarMenuBadge } from "./menu-badge.svelte";
export { default as SidebarMenuSkeleton } from "./menu-skeleton.svelte";
export { default as SidebarMenuSub } from "./menu-sub.svelte";
export { default as SidebarMenuSubItem } from "./menu-sub-item.svelte";
export { default as SidebarMenuSubButton } from "./menu-sub-button.svelte";
export { useCompCtx as useSidebar } from "./ctx.svelte.js";

/** Holds the sidebar state for the page; wrap the sidebar and the main content in it */
export interface ProviderProps extends CompPropsWithChild<"div"> {
	/** Whether the desktop sidebar is expanded; supports `bind:open` */
	open?: boolean;
	/** Called when the desktop sidebar expands or collapses */
	onOpenChange?: (open: boolean) => void;
	/** Width of the expanded sidebar; defaults to `16rem` */
	width?: string;
	/** Width of the sidebar collapsed to its icons; defaults to `3rem` */
	iconWidth?: string;
	/** Width of the mobile drawer; defaults to `18rem` */
	mobileWidth?: string;
	/** Toggles the sidebar with Cmd or Ctrl and this key; set `false` to turn it off; defaults to `b` */
	shortcut?: string | false;
	/** Classes merged onto the wrapper */
	class?: CompPropsWithChild<"div">["class"];
}

/** Sidebar panel; a drawer below 48rem wide */
export interface Props extends CompPropsWithChild<"div"> {
	/** Edge the sidebar sits on; defaults to `left` */
	side?: "left" | "right";
	/** `sidebar` is flush with a border; `floating` is a rounded card; `inset` frames the main content; defaults to `sidebar` */
	variant?: "sidebar" | "floating" | "inset";
	/** `offcanvas` slides out of view; `icon` shrinks to the icons; `none` never collapses, such as a second panel, one inside another sidebar, or one in a popover or dialog; defaults to `offcanvas` */
	collapsible?: "offcanvas" | "icon" | "none";
	/** Space above the fixed desktop panel, such as the height of a sticky site header, so the panel starts below it; defaults to `0rem` */
	offsetTop?: string;
	/** Classes merged onto the sidebar */
	class?: CompPropsWithChild<"div">["class"];
}

/** Button attributes without the link form */
type ButtonAttrs = Partial<Omit<Extract<ButtonProps, { href?: undefined }>, "href">>;

/** Props a custom trigger spreads onto the element that toggles the sidebar */
export interface TriggerAttrs {
	/** Accessible name for the trigger */
	"aria-label": string;
	/** Whether the sidebar, or the drawer on mobile, is open */
	"aria-expanded": boolean;
	/** Toggles the sidebar */
	onclick: () => void;
}

/** Ghost icon button that toggles the sidebar unless `trigger` is given */
export type TriggerProps = ButtonAttrs & {
	/** Custom trigger; spread `props` onto the element that toggles the sidebar */
	trigger?: Snippet<[{ props: TriggerAttrs }]>;
};

/** Thin strip on the sidebar edge that toggles it on click */
export interface RailProps extends CompProps<"button"> {
	/** Classes merged onto the rail */
	class?: CompProps<"button">["class"];
}

/** Main content beside the sidebar; renders a `main` */
export interface InsetProps extends CompPropsWithChild<"main"> {
	/** Classes merged onto the main element */
	class?: CompPropsWithChild<"main">["class"];
}

/** Compact input for a search field in the sidebar */
export type SidebarInputProps = InputProps;

/** Row at the top of the sidebar */
export interface HeaderProps extends CompPropsWithChild<"div"> {
	/** Classes merged onto the header */
	class?: CompPropsWithChild<"div">["class"];
}

/** Row at the bottom of the sidebar */
export interface FooterProps extends CompPropsWithChild<"div"> {
	/** Classes merged onto the footer */
	class?: CompPropsWithChild<"div">["class"];
}

/** Line between sidebar sections */
export interface SeparatorProps extends CompProps<"div"> {
	/** Classes merged onto the separator */
	class?: CompProps<"div">["class"];
}

/** Scrolling area that holds the groups */
export interface ContentProps extends CompPropsWithChild<"div"> {
	/** Classes merged onto the content */
	class?: CompPropsWithChild<"div">["class"];
}

/** Section of the sidebar with a label */
export interface GroupProps extends CompPropsWithChild<"div"> {
	/** Classes merged onto the group */
	class?: CompPropsWithChild<"div">["class"];
}

/** Group label as a plain heading */
interface GroupLabelHeadingProps extends CompPropsWithChild<"div"> {
	/** Leave unset for a plain heading; setting it renders a `button` */
	onclick?: undefined;
	/** Classes merged onto the label */
	class?: CompPropsWithChild<"div">["class"];
}

/** Group label as a button, such as the trigger of a collapsible group */
interface GroupLabelButtonProps extends CompPropsWithChild<"button"> {
	/** Runs when the label is pressed; setting it renders a `button` */
	onclick: NonNullable<CompPropsWithChild<"button">["onclick"]>;
	/** Classes merged onto the label */
	class?: CompPropsWithChild<"button">["class"];
}

/** Small muted heading of a group; hidden while collapsed to icons. Renders a `button` when `onclick` is set, such as when spread with a `CollapsibleTrigger` snippet's `props` */
export type GroupLabelProps = GroupLabelHeadingProps | GroupLabelButtonProps;

/** Icon button at the end of a group label, such as for adding an item */
export interface GroupActionProps extends CompPropsWithChild<"button"> {
	/** Classes merged onto the action */
	class?: CompPropsWithChild<"button">["class"];
}

/** Body of a group */
export interface GroupContentProps extends CompPropsWithChild<"div"> {
	/** Classes merged onto the content */
	class?: CompPropsWithChild<"div">["class"];
}

/** List of menu items */
export interface MenuProps extends CompPropsWithChild<"ul"> {
	/** Classes merged onto the menu */
	class?: CompPropsWithChild<"ul">["class"];
}

/** One menu entry */
export interface MenuItemProps extends CompPropsWithChild<"li"> {
	/** Classes merged onto the item */
	class?: CompPropsWithChild<"li">["class"];
}

/** Props shared by the button and link forms of a menu button */
interface MenuButtonBaseProps {
	/** Highlights the button as the current page */
	isActive?: boolean;
	/** `default` is transparent; `outline` draws a border */
	variant?: "default" | "outline";
	/** Height and text size on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Label shown in a tooltip while the sidebar is collapsed to icons */
	tooltip?: string;
	/** Shows `tooltip` even while the sidebar is expanded, such as in an icon-only rail */
	showTooltip?: boolean;
}

/** Main button of a menu item; renders an `<a>` when `href` is set */
export type MenuButtonProps = MenuButtonBaseProps & ((CompPropsWithChild<"button"> & { href?: undefined }) | (CompPropsWithChild<"a"> & { href: string }));

/** Icon button at the end of a menu item */
export interface MenuActionProps extends CompPropsWithChild<"button"> {
	/** Shows the action only while the item is hovered, focused, or open */
	showOnHover?: boolean;
	/** Classes merged onto the action */
	class?: CompPropsWithChild<"button">["class"];
}

/** Small count at the end of a menu item */
export interface MenuBadgeProps extends CompPropsWithChild<"div"> {
	/** Classes merged onto the badge */
	class?: CompPropsWithChild<"div">["class"];
}

/** Placeholder for a menu item while it loads */
export interface MenuSkeletonProps extends CompProps<"div"> {
	/** Shows a square for the icon */
	showIcon?: boolean;
	/** Classes merged onto the skeleton */
	class?: CompProps<"div">["class"];
}

/** Nested list under a menu item; hidden while collapsed to icons */
export interface MenuSubProps extends CompPropsWithChild<"ul"> {
	/** Classes merged onto the list */
	class?: CompPropsWithChild<"ul">["class"];
}

/** One nested entry */
export interface MenuSubItemProps extends CompPropsWithChild<"li"> {
	/** Classes merged onto the item */
	class?: CompPropsWithChild<"li">["class"];
}

/** Props shared by the button and link forms of a nested menu button */
interface MenuSubButtonBaseProps {
	/** Highlights the button as the current page */
	isActive?: boolean;
	/** `sm` uses the small text size; defaults to `md` */
	size?: "sm" | "md";
}

/** Nested link or button; renders an `<a>` when `href` is set */
export type MenuSubButtonProps = MenuSubButtonBaseProps & ((CompPropsWithChild<"button"> & { href?: undefined }) | (CompPropsWithChild<"a"> & { href: string }));

export type SidebarProps = Props;
export type SidebarProviderProps = ProviderProps;
export type SidebarTriggerProps = TriggerProps;
export type SidebarTriggerAttrs = TriggerAttrs;
export type SidebarRailProps = RailProps;
export type SidebarInsetProps = InsetProps;
export type SidebarHeaderProps = HeaderProps;
export type SidebarFooterProps = FooterProps;
export type SidebarSeparatorProps = SeparatorProps;
export type SidebarContentProps = ContentProps;
export type SidebarGroupProps = GroupProps;
export type SidebarGroupLabelProps = GroupLabelProps;
export type SidebarGroupActionProps = GroupActionProps;
export type SidebarGroupContentProps = GroupContentProps;
export type SidebarMenuProps = MenuProps;
export type SidebarMenuItemProps = MenuItemProps;
export type SidebarMenuButtonProps = MenuButtonProps;
export type SidebarMenuActionProps = MenuActionProps;
export type SidebarMenuBadgeProps = MenuBadgeProps;
export type SidebarMenuSkeletonProps = MenuSkeletonProps;
export type SidebarMenuSubProps = MenuSubProps;
export type SidebarMenuSubItemProps = MenuSubItemProps;
export type SidebarMenuSubButtonProps = MenuSubButtonProps;
