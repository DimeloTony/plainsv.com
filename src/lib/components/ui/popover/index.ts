import type { ButtonProps } from "#lib/components/ui/button/index.js";
import type { Attachment } from "svelte/attachments";

export { default as Popover } from "./_.svelte";
export { default as PopoverTrigger } from "./trigger.svelte";
export { default as PopoverContent } from "./content.svelte";
export { default as PopoverHeader } from "./header.svelte";
export { default as PopoverTitle } from "./title.svelte";
export { default as PopoverDescription } from "./description.svelte";

/** Side of the trigger the popover opens on */
export type PopoverSide = "top" | "right" | "bottom" | "left";

/** Alignment of the popover along the trigger's edge */
export type PopoverAlign = "start" | "center" | "end";

/** Popover settings shared with every part */
interface PopoverOptions {
	/** Whether the popover is shown; supports `bind:open` */
	open?: boolean;
	/** Called when the popover opens or closes */
	onOpenChange?: (open: boolean) => void;
	/** Preferred side; flips to the opposite side when there is not enough room; defaults to `bottom` */
	side?: PopoverSide;
	/** Alignment along the trigger's edge; defaults to `center` */
	align?: PopoverAlign;
	/** Gap in pixels between the trigger and the popover; defaults to `4` */
	sideOffset?: number;
	/** Padding and text size on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Corner radius of the content; follows `size` when omitted. `pill` is a true pill that can clip the content, so use `3xl` or `4xl` to stay round */
	rounded?: UiRounded;
}

/** Popover props; renders no element of its own */
export type Props = CompPropsWithChildSimple<PopoverOptions>;

/** Props a custom trigger spreads onto the element that opens the popover */
export interface TriggerAttrs {
	/** Id that names the popover when it has no title */
	id: string;
	/** Announces that the trigger opens a dialog */
	"aria-haspopup": "dialog";
	/** Whether the popover is open */
	"aria-expanded": boolean;
	/** Id of the popover while it is open */
	"aria-controls"?: string;
	/** `open` or `closed`, for styling */
	"data-state": "open" | "closed";
	/** Records whether the popover was open when the press started */
	onpointerdown: () => void;
	/** Toggles the popover */
	onclick: (e: MouseEvent) => void;
	/** Registers the element the popover is placed against */
	[key: symbol]: Attachment<HTMLElement>;
}

/** Popover trigger props; renders an outline button unless `trigger` is given */
export interface TriggerProps {
	/** Label for the default trigger button */
	children?: Snippet;
	/** Custom trigger; spread `props` onto the element that opens the popover */
	trigger?: Snippet<[{ props: TriggerAttrs }]>;
	/** Style of the default trigger button; defaults to `outline` */
	variant?: ButtonProps["variant"];
	/** Size of the default trigger button, including the square `icon-*` sizes; follows the popover's `size` when omitted */
	size?: ButtonProps["size"];
	/** Corner radius of the default trigger button; follows its size when omitted */
	rounded?: UiRounded;
	/** Classes merged onto the default trigger button */
	class?: ButtonProps["class"];
}

/** Popover content shown in the top layer beside the trigger */
export interface ContentProps extends CompPropsWithChild<"div"> {
	/** Padding and text of this content; overrides the popover's `size` */
	size?: UiSize;
	/** Corner radius of this content; overrides the popover's `rounded`. `pill` is a true pill that can clip the content, so use `3xl` or `4xl` to stay round */
	rounded?: UiRounded;
	/** Classes merged onto the content */
	class?: CompPropsWithChild<"div">["class"];
}

/** Header that holds the title and description */
export interface HeaderProps extends CompPropsWithChild<"header"> {
	/** Classes merged onto the header */
	class?: CompPropsWithChild<"header">["class"];
}

/** Popover heading; names the content for assistive technology */
export interface TitleProps extends CompPropsWithChild<"h2"> {
	/** Classes merged onto the title */
	class?: CompPropsWithChild<"h2">["class"];
}

/** Muted supporting text under the title; describes the content for assistive technology */
export interface DescriptionProps extends CompPropsWithChild<"p"> {
	/** Classes merged onto the description */
	class?: CompPropsWithChild<"p">["class"];
}

export type PopoverProps = Props;
export type PopoverTriggerProps = TriggerProps;
export type PopoverTriggerAttrs = TriggerAttrs;
export type PopoverContentProps = ContentProps;
export type PopoverHeaderProps = HeaderProps;
export type PopoverTitleProps = TitleProps;
export type PopoverDescriptionProps = DescriptionProps;
