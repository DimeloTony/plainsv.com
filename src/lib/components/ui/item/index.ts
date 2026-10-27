export { default as Item } from "./_.svelte";
export { default as ItemGroup } from "./group.svelte";
export { default as ItemSeparator } from "./separator.svelte";
export { default as ItemMedia } from "./media.svelte";
export { default as ItemContent } from "./content.svelte";
export { default as ItemTitle } from "./title.svelte";
export { default as ItemDescription } from "./description.svelte";
export { default as ItemActions } from "./actions.svelte";
export { default as ItemHeader } from "./header.svelte";
export { default as ItemFooter } from "./footer.svelte";

/** Props shared by the div and link forms */
interface ItemBaseProps {
	/** `default` is transparent; `outline` draws a border; `muted` fills the background */
	variant?: "default" | "outline" | "muted";
	/** Padding, gap, and text size on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Corner radius; follows `size` when omitted. `pill` is a true pill that can clip the content, so use `3xl` or `4xl` to stay round */
	rounded?: UiRounded;
}

/** Row with media, content, and actions; renders an `<a>` when `href` is set */
export type Props = ItemBaseProps & ((CompPropsWithChild<"div"> & { href?: undefined }) | (CompPropsWithChild<"a"> & { href: string }));

/** List of items; its items are announced as list items */
export interface GroupProps extends CompPropsWithChild<"div"> {
	/** Classes merged onto the group */
	class?: CompPropsWithChild<"div">["class"];
}

/** Line between items in a group */
export interface SeparatorProps extends CompProps<"div"> {
	/** Classes merged onto the separator */
	class?: CompProps<"div">["class"];
}

/** Icon, avatar, or image at the start of the item */
export interface MediaProps extends CompPropsWithChild<"div"> {
	/** `default` shows the media as is; `icon` puts an icon in a bordered square; `image` crops an image to a square */
	variant?: "default" | "icon" | "image";
	/** Classes merged onto the media */
	class?: CompPropsWithChild<"div">["class"];
}

/** Title and description; fills the room between the media and the actions */
export interface ContentProps extends CompPropsWithChild<"div"> {
	/** Classes merged onto the content */
	class?: CompPropsWithChild<"div">["class"];
}

/** Item heading */
export interface TitleProps extends CompPropsWithChild<"div"> {
	/** Classes merged onto the title */
	class?: CompPropsWithChild<"div">["class"];
}

/** Muted text under the title, clamped to two lines */
export interface DescriptionProps extends CompPropsWithChild<"p"> {
	/** Classes merged onto the description */
	class?: CompPropsWithChild<"p">["class"];
}

/** Buttons or badges at the end of the item */
export interface ActionsProps extends CompPropsWithChild<"div"> {
	/** Classes merged onto the actions */
	class?: CompPropsWithChild<"div">["class"];
}

/** Full-width row above the content, such as an image */
export interface HeaderProps extends CompPropsWithChild<"div"> {
	/** Classes merged onto the header */
	class?: CompPropsWithChild<"div">["class"];
}

/** Full-width row below the content */
export interface FooterProps extends CompPropsWithChild<"div"> {
	/** Classes merged onto the footer */
	class?: CompPropsWithChild<"div">["class"];
}

export type ItemProps = Props;
export type ItemGroupProps = GroupProps;
export type ItemSeparatorProps = SeparatorProps;
export type ItemMediaProps = MediaProps;
export type ItemContentProps = ContentProps;
export type ItemTitleProps = TitleProps;
export type ItemDescriptionProps = DescriptionProps;
export type ItemActionsProps = ActionsProps;
export type ItemHeaderProps = HeaderProps;
export type ItemFooterProps = FooterProps;
