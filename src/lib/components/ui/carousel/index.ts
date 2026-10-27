import type { ButtonProps } from "#lib/components/ui/button/index.js";

export { default as Carousel } from "./_.svelte";
export { default as CarouselContent } from "./content.svelte";
export { default as CarouselItem } from "./item.svelte";
export { default as CarouselPrevious } from "./previous.svelte";
export { default as CarouselNext } from "./next.svelte";

/** Slides that scroll and snap one at a time, with buttons, keys, and mouse dragging */
export interface Props extends CompPropsWithChild<"div"> {
	/** `horizontal` scrolls sideways; `vertical` scrolls up and down and needs a height on the content; defaults to `horizontal` */
	orientation?: "horizontal" | "vertical";
	/** Number of slides shown at once; defaults to `1` */
	perView?: number;
	/** Wraps around from the last slide to the first and back */
	loop?: boolean;
	/** Index of the slide at the start of the view; supports `bind:selectedIndex`, and setting it scrolls there */
	selectedIndex?: number;
	/** Called with the index of the slide at the start of the view when it changes */
	onSelectedIndexChange?: (index: number) => void;
	/** Gap between slides and size of the buttons on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Classes merged onto the carousel */
	class?: CompPropsWithChild<"div">["class"];
}

/** Scrolling viewport that holds the slides */
export interface ContentProps extends CompPropsWithChild<"div"> {
	/** Classes merged onto the slide track */
	class?: CompPropsWithChild<"div">["class"];
}

/** One slide */
export interface ItemProps extends CompPropsWithChild<"div"> {
	/** Classes merged onto the slide */
	class?: CompPropsWithChild<"div">["class"];
}

/** Outline icon button that scrolls to the previous or next slide; disabled at the ends unless `loop` is set */
export type StepProps = Partial<Omit<Extract<ButtonProps, { href?: undefined }>, "size" | "href">> & {
	/** Size of the button, including the square `icon-*` sizes; follows the carousel's `size` when omitted */
	size?: ButtonProps["size"];
};

export type CarouselProps = Props;
export type CarouselContentProps = ContentProps;
export type CarouselItemProps = ItemProps;
export type CarouselPreviousProps = StepProps;
export type CarouselNextProps = StepProps;
