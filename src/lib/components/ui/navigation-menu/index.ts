export { default as NavigationMenu } from "./_.svelte";
export { default as NavigationMenuList } from "./list.svelte";
export { default as NavigationMenuItem } from "./item.svelte";
export { default as NavigationMenuTrigger } from "./trigger.svelte";
export { default as NavigationMenuContent } from "./content.svelte";
export { default as NavigationMenuLink } from "./link.svelte";

/** Navigation menu root; renders a `nav` that holds the open item */
export interface Props extends CompPropsWithChild<"nav"> {
	/** Value of the open item, or `""` while closed; supports `bind:value` */
	value?: string;
	/** Called with the open item's value when an item opens or closes */
	onValueChange?: (value: string) => void;
	/** Milliseconds the pointer rests on a trigger before its content opens; defaults to `200` */
	delayDuration?: number;
	/** Style of the triggers and top-level links; defaults to `default` */
	variant?: "default" | "outline" | "ghost" | "secondary";
	/** Trigger height, padding, and text on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Corner radius of the triggers, content, and links; follows `size` when omitted. `pill` makes the panels pills too, which can clip their items, so use `3xl` or `4xl` for round panels */
	rounded?: UiRounded;
	/** Classes merged onto the nav */
	class?: CompPropsWithChild<"nav">["class"];
}

/** Row of top-level items */
export interface ListProps extends CompPropsWithChild<"ul"> {
	/** Classes merged onto the list */
	class?: CompPropsWithChild<"ul">["class"];
}

/** Top-level item that holds a trigger and its content, or a single link */
export interface ItemProps extends CompPropsWithChild<"li"> {
	/** Value that identifies the item in the open value; defaults to a generated id */
	value?: string;
	/** Classes merged onto the item */
	class?: CompPropsWithChild<"li">["class"];
}

/** Props a custom trigger spreads onto the element that opens its item's content */
export interface TriggerAttrs {
	/** Id that links the trigger to its content */
	id: string;
	/** Whether the content is open */
	"aria-expanded": boolean;
	/** Id of the content */
	"aria-controls": string;
	/** `open` or `closed`, for styling */
	"data-state": "open" | "closed";
	/** Marks the element as a top-level item that the left and right arrows move between */
	"data-navigation-menu-top": true;
	/** Opens or closes the content */
	onclick: () => void;
	/** Opens the content and focuses its first control on the down arrow */
	onkeydown: (e: KeyboardEvent) => void;
	/** Opens the content after the hover delay when the mouse enters */
	onpointerenter: (e: PointerEvent) => void;
}

/** Button that opens its item's content on hover, click, or the down arrow; renders a button with a chevron unless `trigger` is given */
export interface TriggerProps extends Omit<CompProps<"button">, "children"> {
	/** Label for the default trigger button */
	children?: Snippet;
	/** Custom trigger; spread `props` onto the element that opens the item's content */
	trigger?: Snippet<[{ props: TriggerAttrs }]>;
	/** Style of the default trigger; overrides the menu's `variant` */
	variant?: Props["variant"];
	/** Height, padding, and text of the default trigger; overrides the menu's `size` */
	size?: UiSize;
	/** Corner radius of the default trigger with this exact value; overrides the menu's `rounded` */
	rounded?: UiRounded;
	/** Classes merged onto the default trigger */
	class?: CompProps<"button">["class"];
}

/** Panel shown below its item while open */
export interface ContentProps extends CompPropsWithChild<"div"> {
	/** Edge of the item the panel lines up with; use `end` near the right of the page; defaults to `start` */
	align?: "start" | "end";
	/** Padding and text of the panel, and the padding of its links; overrides the menu's `size` */
	size?: UiSize;
	/** Corner radius of the panel; its links use one step smaller; overrides the menu's `rounded`. `pill` makes the panels pills too, which can clip their items, so use `3xl` or `4xl` for round panels */
	rounded?: UiRounded;
	/** Classes merged onto the panel */
	class?: CompPropsWithChild<"div">["class"];
}

/** Link styled as a top-level trigger in an item, or as a padded row inside content */
export interface LinkProps extends CompPropsWithChild<"a"> {
	/** Marks the link as the current page with `aria-current="page"` */
	active?: boolean;
	/** Style of a top-level link; overrides the menu's `variant`; links inside content keep the row style */
	variant?: Props["variant"];
	/** Height, padding, and text of a top-level link, or the padding and text of a row inside content; overrides the menu's `size` */
	size?: UiSize;
	/** Corner radius of the link with this exact value; overrides the inherited radius */
	rounded?: UiRounded;
	/** Classes merged onto the link */
	class?: CompPropsWithChild<"a">["class"];
}

export type NavigationMenuProps = Props;
export type NavigationMenuListProps = ListProps;
export type NavigationMenuItemProps = ItemProps;
export type NavigationMenuTriggerProps = TriggerProps;
export type NavigationMenuTriggerAttrs = TriggerAttrs;
export type NavigationMenuContentProps = ContentProps;
export type NavigationMenuLinkProps = LinkProps;
