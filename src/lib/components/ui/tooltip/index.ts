import type { ButtonProps } from "#lib/components/ui/button/index.js";
import type { Attachment } from "svelte/attachments";

export { default as Tooltip } from "./_.svelte";
export { default as TooltipTrigger } from "./trigger.svelte";
export { default as TooltipContent } from "./content.svelte";

/** Side of the trigger the tooltip opens on */
export type TooltipSide = "top" | "right" | "bottom" | "left";

/** Tooltip settings shared with the trigger and content */
interface TooltipOptions {
	/** Whether the tooltip is shown; supports `bind:open` */
	open?: boolean;
	/** Milliseconds the pointer rests on the trigger before the tooltip opens; defaults to `0` */
	delay?: number;
	/** Milliseconds the tooltip stays open after the pointer leaves the trigger or content; defaults to `150` */
	closeDelay?: number;
	/** Preferred side; flips to the opposite side when there is not enough room */
	side?: TooltipSide;
	/** Alignment along the trigger's edge; defaults to `center` */
	align?: "start" | "center" | "end";
	/** Whether to show the arrow that points at the trigger; defaults to `true` */
	arrow?: boolean;
	/** Gap in pixels between the trigger and the tooltip, including the arrow; defaults to `8`, or `4` without the arrow */
	sideOffset?: number;
	/** Visual style of the tooltip */
	variant?: "default" | "secondary" | "outline" | "destructive";
	/** Padding and text size on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Corner radius; follows `size` when omitted. `pill` is a pill on one line and keeps round corners when the text wraps */
	rounded?: UiRounded;
}

/** Tooltip props; renders no element of its own */
export type Props = CompPropsWithChildSimple<TooltipOptions>;

/** Props a custom trigger spreads onto the element that shows the tooltip */
export interface TriggerAttrs {
	/** Links the trigger to the tooltip text while it is open */
	"aria-describedby"?: string;
	/** Opens the tooltip after the delay when a mouse or pen rests on the trigger */
	onpointerenter: (e: PointerEvent) => void;
	/** Closes the tooltip after `closeDelay` unless the pointer reaches the content */
	onpointerleave: () => void;
	/** Closes the tooltip when the trigger is pressed */
	onpointerdown: () => void;
	/** Opens the tooltip on keyboard focus */
	onfocus: (e: FocusEvent) => void;
	/** Closes the tooltip when focus leaves */
	onblur: () => void;
	/** Registers the element the tooltip is placed against */
	[key: symbol]: Attachment<HTMLElement>;
}

/** Tooltip trigger props; renders an outline button unless `trigger` is given */
export interface TriggerProps {
	/** Label for the default trigger button */
	children?: Snippet;
	/** Custom trigger; spread `props` onto the element that shows the tooltip */
	trigger?: Snippet<[{ props: TriggerAttrs }]>;
	/** Style of the default trigger button; defaults to `outline` */
	variant?: ButtonProps["variant"];
	/** Size of the default trigger button, including the square `icon-*` sizes; defaults to `md` */
	size?: ButtonProps["size"];
	/** Corner radius of the default trigger button; follows its size when omitted */
	rounded?: UiRounded;
	/** Classes merged onto the default trigger button */
	class?: ButtonProps["class"];
}

/** Tooltip content props; shown in the top layer beside the trigger */
export interface ContentProps extends CompPropsWithChild<"div"> {
	/** Style of this tooltip; overrides the `Tooltip`'s `variant` */
	variant?: Props["variant"];
	/** Padding and text of this tooltip; overrides the `Tooltip`'s `size` */
	size?: UiSize;
	/** Corner radius of this tooltip; overrides the `Tooltip`'s `rounded` */
	rounded?: UiRounded;
	/** Classes merged onto the tooltip */
	class?: CompPropsWithChild<"div">["class"];
}

export type TooltipProps = Props;
export type TooltipTriggerProps = TriggerProps;
export type TooltipContentProps = ContentProps;
