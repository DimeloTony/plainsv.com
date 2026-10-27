export { default as Table } from "./_.svelte";
export { default as TableHeader } from "./header.svelte";
export { default as TableBody } from "./body.svelte";
export { default as TableFooter } from "./footer.svelte";
export { default as TableRow } from "./row.svelte";
export { default as TableHead } from "./head.svelte";
export { default as TableCell } from "./cell.svelte";
export { default as TableCaption } from "./caption.svelte";

/** Data table inside a container that scrolls sideways when the table is too wide */
export interface Props extends CompPropsWithChild<"table"> {
	/** Row height, cell padding, and text size on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Classes merged onto the `table`; the scroll container is the root element */
	class?: CompPropsWithChild<"table">["class"];
}

/** Header rows; renders a `thead` */
export interface HeaderProps extends CompPropsWithChild<"thead"> {
	/** Classes merged onto the header */
	class?: CompPropsWithChild<"thead">["class"];
}

/** Body rows; renders a `tbody` */
export interface BodyProps extends CompPropsWithChild<"tbody"> {
	/** Classes merged onto the body */
	class?: CompPropsWithChild<"tbody">["class"];
}

/** Summary rows, such as totals; renders a `tfoot` */
export interface FooterProps extends CompPropsWithChild<"tfoot"> {
	/** Classes merged onto the footer */
	class?: CompPropsWithChild<"tfoot">["class"];
}

/** One row; set `data-state="selected"` to highlight it */
export interface RowProps extends CompPropsWithChild<"tr"> {
	/** Classes merged onto the row */
	class?: CompPropsWithChild<"tr">["class"];
}

/** Column heading cell; renders a `th` */
export interface HeadProps extends CompPropsWithChild<"th"> {
	/** Classes merged onto the heading */
	class?: CompPropsWithChild<"th">["class"];
}

/** Data cell; renders a `td` */
export interface CellProps extends CompPropsWithChild<"td"> {
	/** Classes merged onto the cell */
	class?: CompPropsWithChild<"td">["class"];
}

/** Title of the table, shown under it */
export interface CaptionProps extends CompPropsWithChild<"caption"> {
	/** Classes merged onto the caption */
	class?: CompPropsWithChild<"caption">["class"];
}

export type TableProps = Props;
export type TableHeaderProps = HeaderProps;
export type TableBodyProps = BodyProps;
export type TableFooterProps = FooterProps;
export type TableRowProps = RowProps;
export type TableHeadProps = HeadProps;
export type TableCellProps = CellProps;
export type TableCaptionProps = CaptionProps;
