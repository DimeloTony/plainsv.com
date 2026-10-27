import type { ButtonProps } from "#lib/components/ui/button/index.js";

export { default as Pagination } from "./_.svelte";
export { default as PaginationContent } from "./content.svelte";
export { default as PaginationItem } from "./item.svelte";
export { default as PaginationLink } from "./link.svelte";
export { default as PaginationPrevious } from "./previous.svelte";
export { default as PaginationNext } from "./next.svelte";
export { default as PaginationEllipsis } from "./ellipsis.svelte";
export { getPageRange } from "./utils.js";

/** Page navigation; a `nav` landmark that sets the size of its links */
export interface Props extends CompPropsWithChild<"nav"> {
	/** Link size on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Classes merged onto the nav */
	class?: CompPropsWithChild<"nav">["class"];
}

/** List of page items */
export interface ContentProps extends CompPropsWithChild<"ul"> {
	/** Classes merged onto the list */
	class?: CompPropsWithChild<"ul">["class"];
}

/** One entry in the list */
export interface ItemProps extends CompPropsWithChild<"li"> {
	/** Classes merged onto the item */
	class?: CompPropsWithChild<"li">["class"];
}

/** Omits keys from each member of a union, so the button and link forms of `ButtonProps` stay apart */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

/** Button or link attributes the pagination parts pass to `Button` */
export type ButtonAttrs = DistributiveOmit<ButtonProps, "size" | "variant" | "children">;

/** Page link; a `Button` that renders an `<a>` with `href`, or a `button` with `onclick` */
export type LinkProps = DistributiveOmit<ButtonProps, "size" | "variant"> & {
	/** Marks the current page with an outline and `aria-current="page"` */
	isActive?: boolean;
	/** Size of this square link; overrides the pagination's `size` */
	size?: UiSize;
};

/** Link to the previous or next page, with a chevron and a label that hides on narrow screens */
export type StepProps = ButtonAttrs & {
	/** Label beside the chevron; defaults to `Previous` or `Next` */
	children?: Snippet;
	/** Size of this link; overrides the pagination's `size` */
	size?: UiSize;
};

/** Gap in the page numbers */
export interface EllipsisProps extends CompProps<"span"> {
	/** Classes merged onto the ellipsis */
	class?: CompProps<"span">["class"];
}

/** One entry from `getPageRange`: a page number, or a gap */
export type PageRangeItem = number | "ellipsis";

export type PaginationProps = Props;
export type PaginationContentProps = ContentProps;
export type PaginationItemProps = ItemProps;
export type PaginationLinkProps = LinkProps;
export type PaginationPreviousProps = StepProps;
export type PaginationNextProps = StepProps;
export type PaginationEllipsisProps = EllipsisProps;
