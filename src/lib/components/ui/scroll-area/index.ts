export { default as ScrollArea } from "./_.svelte";

/** Scrolling box with thin themed scrollbars that look the same on every platform */
export interface Props extends CompPropsWithChild<"div"> {
	/** Directions the content scrolls in; defaults to `vertical` */
	orientation?: "vertical" | "horizontal" | "both";
	/** `hover` shows the scrollbars while hovered or scrolling; `scroll` only while scrolling; `always` keeps them shown; defaults to `hover` */
	type?: "hover" | "scroll" | "always";
	/** Scrolling element, for reading or setting the scroll position; supports `bind:viewport` */
	viewport?: HTMLDivElement;
	/** Scrollbar thickness on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Corner radius of the box; square when omitted. `pill` is a true pill that can clip the content, so use `3xl` or `4xl` to stay round */
	rounded?: UiRounded;
	/** Classes merged onto the box; set its height or max height here */
	class?: CompPropsWithChild<"div">["class"];
}

export type ScrollAreaProps = Props;
