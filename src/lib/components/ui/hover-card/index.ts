import type { Attachment } from "svelte/attachments";

export { default as HoverCard } from "./_.svelte";
export { default as HoverCardTrigger } from "./trigger.svelte";
export { default as HoverCardContent } from "./content.svelte";

/** Side of the trigger the card opens on */
export type HoverCardSide = "top" | "right" | "bottom" | "left";

/** Hover card settings shared with every part */
interface HoverCardOptions {
	/** Whether the card is shown; supports `bind:open` */
	open?: boolean;
	/** Called when the card opens or closes */
	onOpenChange?: (open: boolean) => void;
	/** Milliseconds the pointer rests on the trigger before the card opens; defaults to `700` */
	openDelay?: number;
	/** Milliseconds the card stays open after the pointer leaves, so it can reach the card; defaults to `300` */
	closeDelay?: number;
	/** Preferred side; flips to the opposite side when there is not enough room; defaults to `bottom` */
	side?: HoverCardSide;
	/** Alignment along the trigger's edge; defaults to `center` */
	align?: "start" | "center" | "end";
	/** Gap in pixels between the trigger and the card; defaults to `4` */
	sideOffset?: number;
	/** Padding and text size on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Corner radius of the card; follows `size` when omitted. `pill` is a true pill that can clip the content, so use `3xl` or `4xl` to stay round */
	rounded?: UiRounded;
}

/** Hover card props; renders no element of its own */
export type Props = CompPropsWithChildSimple<HoverCardOptions>;

/** Props a custom trigger spreads onto the element that opens the card */
export interface TriggerAttrs {
	/** Opens the card after the delay */
	onpointerenter: (e: PointerEvent) => void;
	/** Closes the card after the delay */
	onpointerleave: () => void;
	/** Opens the card when the trigger gets keyboard focus */
	onfocus: (e: FocusEvent) => void;
	/** Closes the card when focus leaves the trigger */
	onblur: () => void;
	/** Registers the element the card is placed against */
	[key: symbol]: Attachment<HTMLElement>;
}

/** Hover card trigger props; renders a link unless `trigger` is given */
export interface TriggerProps {
	/** Link text for the default trigger */
	children?: Snippet;
	/** Destination of the default link trigger */
	href?: string;
	/** Custom trigger; spread `props` onto the element that opens the card */
	trigger?: Snippet<[{ props: TriggerAttrs }]>;
}

/** Card shown in the top layer beside the trigger */
export interface ContentProps extends CompPropsWithChild<"div"> {
	/** Padding and text of this card; overrides the hover card's `size` */
	size?: UiSize;
	/** Corner radius of this card; overrides the hover card's `rounded`. `pill` is a true pill that can clip the content, so use `3xl` or `4xl` to stay round */
	rounded?: UiRounded;
	/** Classes merged onto the card */
	class?: CompPropsWithChild<"div">["class"];
}

export type HoverCardProps = Props;
export type HoverCardTriggerProps = TriggerProps;
export type HoverCardTriggerAttrs = TriggerAttrs;
export type HoverCardContentProps = ContentProps;
