export { default as Breadcrumb } from "./_.svelte";
export { default as BreadcrumbList } from "./list.svelte";
export { default as BreadcrumbItem } from "./item.svelte";
export { default as BreadcrumbLink } from "./link.svelte";
export { default as BreadcrumbPage } from "./page.svelte";
export { default as BreadcrumbSeparator } from "./separator.svelte";
export { default as BreadcrumbEllipsis } from "./ellipsis.svelte";

/** Breadcrumb root; a `nav` landmark that sets the size of its parts */
export interface Props extends CompPropsWithChild<"nav"> {
	/** Text, gap, and icon size on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Classes merged onto the nav */
	class?: CompPropsWithChild<"nav">["class"];
}

/** Ordered list that holds the items and separators */
export interface ListProps extends CompPropsWithChild<"ol"> {
	/** Classes merged onto the list */
	class?: CompPropsWithChild<"ol">["class"];
}

/** One step in the trail */
export interface ItemProps extends CompPropsWithChild<"li"> {
	/** Classes merged onto the item */
	class?: CompPropsWithChild<"li">["class"];
}

/** Link to an earlier page in the trail */
export interface LinkProps extends CompPropsWithChild<"a"> {
	/** Classes merged onto the link */
	class?: CompPropsWithChild<"a">["class"];
}

/** Current page; the last step, which is not a link */
export interface PageProps extends CompPropsWithChild<"span"> {
	/** Classes merged onto the page */
	class?: CompPropsWithChild<"span">["class"];
}

/** Divider between items; renders a chevron by default */
export interface SeparatorProps extends CompProps<"li"> {
	/** Custom divider content in place of the chevron */
	children?: Snippet;
	/** Classes merged onto the separator */
	class?: CompProps<"li">["class"];
}

/** Placeholder for collapsed items; renders an ellipsis icon */
export interface EllipsisProps extends CompProps<"span"> {
	/** Classes merged onto the ellipsis */
	class?: CompProps<"span">["class"];
}

export type BreadcrumbProps = Props;
export type BreadcrumbListProps = ListProps;
export type BreadcrumbItemProps = ItemProps;
export type BreadcrumbLinkProps = LinkProps;
export type BreadcrumbPageProps = PageProps;
export type BreadcrumbSeparatorProps = SeparatorProps;
export type BreadcrumbEllipsisProps = EllipsisProps;
