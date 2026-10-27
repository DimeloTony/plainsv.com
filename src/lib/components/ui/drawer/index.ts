import type { ButtonProps } from "#lib/components/ui/button/index.js";

export { default as Drawer } from "./_.svelte";
export { default as DrawerTrigger } from "./trigger.svelte";
export { default as DrawerContent } from "./content.svelte";
export { default as DrawerHeader } from "./header.svelte";
export { default as DrawerTitle } from "./title.svelte";
export { default as DrawerDescription } from "./description.svelte";
export { default as DrawerFooter } from "./footer.svelte";
export { default as DrawerClose } from "./close.svelte";

/** Edge of the screen the drawer slides in from */
export type DrawerDirection = "top" | "right" | "bottom" | "left";

/** Drawer settings shared with every part */
interface DrawerOptions {
	/** Whether the drawer is shown; supports `bind:open` */
	open?: boolean;
	/** Called when the drawer opens or closes */
	onOpenChange?: (open: boolean) => void;
	/** Edge the drawer slides in from; drag it back toward that edge to close it; defaults to `bottom` */
	direction?: DrawerDirection;
	/** Padding, text size, and side drawer width on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Radius of the corners facing the page; defaults to `lg` like shadcn. `pill` is a true pill that can clip the content, so use `3xl` or `4xl` to stay round */
	rounded?: UiRounded;
}

/** Drawer props; renders no element of its own */
export type Props = CompPropsWithChildSimple<DrawerOptions>;

/** Props a custom trigger spreads onto the element that opens the drawer */
export interface TriggerAttrs {
	/** Announces that the trigger opens a dialog */
	"aria-haspopup": "dialog";
	/** Opens the drawer */
	onclick: () => void;
}

/** Drawer trigger props; renders an outline button unless `trigger` is given */
export interface TriggerProps {
	/** Label for the default trigger button */
	children?: Snippet;
	/** Style of the default trigger button; defaults to `outline` */
	variant?: ButtonProps["variant"];
	/** Custom trigger; spread `props` onto the element that opens the drawer */
	trigger?: Snippet<[{ props: TriggerAttrs }]>;
	/** Size of the default trigger button, including the square `icon-*` sizes; defaults to `md` */
	size?: ButtonProps["size"];
	/** Corner radius of the default trigger button; follows its size when omitted */
	rounded?: UiRounded;
	/** Classes merged onto the default trigger button */
	class?: ButtonProps["class"];
}

/** Panel shown in the modal while the drawer is open */
export interface ContentProps extends CompPropsWithChild<"div"> {
	/** Classes merged onto the panel */
	class?: CompPropsWithChild<"div">["class"];
}

/** Holds the title and description */
export interface HeaderProps extends CompPropsWithChild<"header"> {
	/** Classes merged onto the header */
	class?: CompPropsWithChild<"header">["class"];
}

/** Heading that names the drawer */
export interface TitleProps extends CompPropsWithChild<"h2"> {
	/** Classes merged onto the title */
	class?: CompPropsWithChild<"h2">["class"];
}

/** Muted text that describes the drawer */
export interface DescriptionProps extends CompPropsWithChild<"p"> {
	/** Classes merged onto the description */
	class?: CompPropsWithChild<"p">["class"];
}

/** Actions at the bottom of the drawer */
export interface FooterProps extends CompPropsWithChild<"footer"> {
	/** Classes merged onto the footer */
	class?: CompPropsWithChild<"footer">["class"];
}

/** Drawer close props; renders an outline button unless `trigger` is given */
export interface CloseProps {
	/** Label for the default close button */
	children?: Snippet;
	/** Style of the default close button; defaults to `outline` */
	variant?: ButtonProps["variant"];
	/** Custom close trigger; spread `props` onto the element that closes the drawer */
	trigger?: Snippet<[{ props: { onclick: () => void } }]>;
	/** Size of the default close button, including the square `icon-*` sizes; defaults to `md` */
	size?: ButtonProps["size"];
	/** Corner radius of the default close button; follows its size when omitted */
	rounded?: UiRounded;
	/** Classes merged onto the default close button */
	class?: ButtonProps["class"];
}

export type DrawerProps = Props;
export type DrawerTriggerProps = TriggerProps;
export type DrawerTriggerAttrs = TriggerAttrs;
export type DrawerContentProps = ContentProps;
export type DrawerHeaderProps = HeaderProps;
export type DrawerTitleProps = TitleProps;
export type DrawerDescriptionProps = DescriptionProps;
export type DrawerFooterProps = FooterProps;
export type DrawerCloseProps = CloseProps;
