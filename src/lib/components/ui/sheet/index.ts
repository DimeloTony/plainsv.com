import type { ButtonProps } from "#lib/components/ui/button/index.js";
export { default as Sheet } from "./_.svelte";
export { default as SheetTrigger } from "./trigger.svelte";
export { default as SheetContent } from "./content.svelte";
export { default as SheetHeader } from "./header.svelte";
export { default as SheetTitle } from "./title.svelte";
export { default as SheetDescription } from "./description.svelte";
export { default as SheetFooter } from "./footer.svelte";
export { default as SheetClose } from "./close.svelte";

/** Sheet trigger props; renders a default button unless `trigger` is given */
export interface TriggerProps {
	/** Label for the default trigger button */
	children?: Snippet;
	/** Custom trigger; spread `props` onto the element that opens the sheet */
	trigger?: Snippet<[{ props: { onclick: () => void } }]>;
	/** Style of the default trigger button; defaults to `default` */
	variant?: ButtonProps["variant"];
	/** Size of the default trigger button, including the square `icon-*` sizes; defaults to `md` */
	size?: ButtonProps["size"];
	/** Corner radius of the default trigger button; follows its size when omitted */
	rounded?: UiRounded;
	/** Classes merged onto the default trigger button */
	class?: ButtonProps["class"];
}

/** Sheet close props; renders a default outline button unless `trigger` is given */
export interface CloseProps {
	/** Label for the default close button */
	children?: Snippet;
	/** Custom close trigger; spread `props` onto the element that closes the sheet */
	trigger?: Snippet<[{ props: { onclick: () => void } }]>;
	/** Style of the default close button; defaults to `outline` */
	variant?: ButtonProps["variant"];
	/** Size of the default close button, including the square `icon-*` sizes; defaults to `md` */
	size?: ButtonProps["size"];
	/** Corner radius of the default close button; follows its size when omitted */
	rounded?: UiRounded;
	/** Classes merged onto the default close button */
	class?: ButtonProps["class"];
}

/** Sheet content props */
export interface ContentProps {
	/** Content rendered inside the sheet panel */
	children: Snippet;
}

/** Sheet header that holds the title and description */
export interface HeaderProps extends CompPropsWithChild<"header"> {
	/** Classes merged onto the header */
	class?: CompPropsWithChild<"header">["class"];
}

/** Sheet heading; labels the sheet for assistive technology */
export interface TitleProps extends CompPropsWithChild<"h2"> {
	/** Classes merged onto the title */
	class?: CompPropsWithChild<"h2">["class"];
}

/** Muted supporting text under the title; describes the sheet for assistive technology */
export interface DescriptionProps extends CompPropsWithChild<"p"> {
	/** Classes merged onto the description */
	class?: CompPropsWithChild<"p">["class"];
}

/** Sheet footer pinned to the end of the panel, for actions */
export interface FooterProps extends CompPropsWithChild<"footer"> {
	/** Classes merged onto the footer */
	class?: CompPropsWithChild<"footer">["class"];
}

/** Sheet props; renders a modal `<dialog>` with a panel that slides in from one edge while open */
export interface Props extends CompProps<"dialog"> {
	/** Whether the sheet is shown; supports `bind:open` */
	open?: boolean;
	/** Edge of the viewport the panel slides in from; defaults to `right` */
	side?: "top" | "right" | "bottom" | "left";
	/** Visual style of the panel */
	variant?: "default" | "secondary" | "outline";
	/** Panel padding, gap, and side panel width on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Radius of the panel's two inner corners; square when omitted. `pill` is a true pill that can clip the content, so use `3xl` or `4xl` to stay round */
	rounded?: UiRounded;
	/** Whether to show the close button in the panel corner; defaults to `true` */
	closeButton?: boolean;
	/** The `SheetTrigger` and `SheetContent` parts */
	children: Snippet;
}

export type SheetProps = Props;
export type SheetTriggerProps = TriggerProps;
export type SheetCloseProps = CloseProps;
export type SheetContentProps = ContentProps;
export type SheetHeaderProps = HeaderProps;
export type SheetTitleProps = TitleProps;
export type SheetDescriptionProps = DescriptionProps;
export type SheetFooterProps = FooterProps;
