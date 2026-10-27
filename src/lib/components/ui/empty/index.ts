export { default as Empty } from "./_.svelte";
export { default as EmptyHeader } from "./header.svelte";
export { default as EmptyMedia } from "./media.svelte";
export { default as EmptyTitle } from "./title.svelte";
export { default as EmptyDescription } from "./description.svelte";
export { default as EmptyContent } from "./content.svelte";

/** Empty state for a list, search, or page with nothing to show */
export interface Props extends CompPropsWithChild<"div"> {
	/** `default` has no border; `outline` draws a dashed border */
	variant?: "default" | "outline";
	/** Padding, gap, and text size on the shared scale; defaults to `lg` */
	size?: UiSize;
	/** Corner radius of the outline; follows `size` when omitted. `pill` is a true pill that can clip the content, so use `3xl` or `4xl` to stay round */
	rounded?: UiRounded;
	/** Classes merged onto the empty state */
	class?: CompPropsWithChild<"div">["class"];
}

/** Holds the media, title, and description */
export interface HeaderProps extends CompPropsWithChild<"header"> {
	/** Classes merged onto the header */
	class?: CompPropsWithChild<"header">["class"];
}

/** Icon, image, or avatar shown above the title */
export interface MediaProps extends CompPropsWithChild<"div"> {
	/** `default` shows the media as is; `icon` puts an icon on a muted square */
	variant?: "default" | "icon";
	/** Classes merged onto the media */
	class?: CompPropsWithChild<"div">["class"];
}

/** Heading of the empty state */
export interface TitleProps extends CompPropsWithChild<"h3"> {
	/** Classes merged onto the title */
	class?: CompPropsWithChild<"h3">["class"];
}

/** Muted text that explains what to do next; links inside are underlined */
export interface DescriptionProps extends CompPropsWithChild<"p"> {
	/** Classes merged onto the description */
	class?: CompPropsWithChild<"p">["class"];
}

/** Actions, such as buttons or a search input */
export interface ContentProps extends CompPropsWithChild<"div"> {
	/** Classes merged onto the content */
	class?: CompPropsWithChild<"div">["class"];
}

export type EmptyProps = Props;
export type EmptyHeaderProps = HeaderProps;
export type EmptyMediaProps = MediaProps;
export type EmptyTitleProps = TitleProps;
export type EmptyDescriptionProps = DescriptionProps;
export type EmptyContentProps = ContentProps;
