import type { DataTableState } from "./state.svelte.js";

export { default as DataTable } from "./_.svelte";
export { default as DataTableColumnHeader } from "./column-header.svelte";
export { default as DataTablePagination } from "./pagination.svelte";
export { default as DataTableViewOptions } from "./view-options.svelte";
export { createDataTable, DataTableState } from "./state.svelte.js";

/** One column of the table */
export interface DataTableColumn<T> {
	/** Unique id, used for sorting, filtering, and visibility */
	id: string;
	/** Heading text; also names the column in the view options */
	header: string;
	/** Row key or function that reads the column's value; leave it out for display-only columns, such as actions */
	accessor?: keyof T | ((row: T) => unknown);
	/** Whether the heading sorts the rows on click; defaults to `true` when the column has an accessor */
	sortable?: boolean;
	/** Whether the global filter searches this column; defaults to `true` when the column has an accessor */
	searchable?: boolean;
	/** Whether the view options can hide this column; defaults to `true` */
	hideable?: boolean;
	/** Keeps the heading for screen readers only, such as for an actions column */
	hideHeader?: boolean;
	/** Aligns the heading and cells, such as `right` for amounts */
	align?: "left" | "center" | "right";
	/** Custom order for two values; numbers, dates, and text in natural order by default */
	sortFn?: (a: unknown, b: unknown) => number;
	/** Custom match for a column filter; text that contains the filter, ignoring case, by default */
	filterFn?: (value: unknown, filter: string, row: T) => boolean;
}

/** A row with its stable id */
export interface DataTableRow<T> {
	/** Id from `getRowId`, or the index in the data */
	id: string;
	/** Position in the data */
	index: number;
	/** The row as passed in `data` */
	original: T;
}

/** Column the rows are sorted by */
export interface DataTableSort {
	/** Column id */
	id: string;
	/** Sorts from largest to smallest when true */
	desc: boolean;
}

/** Options for `createDataTable` */
export interface DataTableOptions<T> {
	/** Returns the rows; a getter, so the table follows changes to them */
	data: () => T[];
	/** Column definitions, in display order */
	columns: DataTableColumn<T>[];
	/** Builds a stable id for a row, so the selection survives sorting and data changes; the index by default */
	getRowId?: (row: T, index: number) => string;
	/** Rows per page; defaults to `10` */
	pageSize?: number;
	/** Adds a checkbox column for selecting rows */
	enableRowSelection?: boolean;
	/** Starting sort */
	initialSort?: DataTableSort;
}

/** Table that renders the state's visible columns and the shown page of rows */
export interface Props<T> extends CompProps<"table"> {
	/** State from `createDataTable` */
	table: DataTableState<T>;
	/** Custom content for every cell; receives the row, column, and value. Without it, cells show the value as text */
	cell?: Snippet<[{ row: DataTableRow<T>; column: DataTableColumn<T>; value: unknown }]>;
	/** Content of an extra cell at the start of every row, before the checkbox column, such as a drag handle */
	leading?: Snippet<[{ row: DataTableRow<T> }]>;
	/** Heading of the `leading` column, kept for screen readers only, such as `Reorder` */
	leadingLabel?: string;
	/** Attributes and event handlers spread onto each row, such as drag handlers or data attributes */
	rowProps?: (row: DataTableRow<T>) => CompProps<"tr">;
	/** Text shown when no row matches; defaults to `No results.` */
	emptyText?: string;
	/** Row height, cell padding, and text size on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Classes merged onto the table */
	class?: CompProps<"table">["class"];
}

/** Sortable column heading with an arrow for the sort direction */
export interface ColumnHeaderProps<T> {
	/** State from `createDataTable` */
	table: DataTableState<T>;
	/** Column the heading belongs to */
	column: DataTableColumn<T>;
}

/** Selected count, rows per page, and page buttons under the table */
export interface PaginationProps<T> extends CompProps<"div"> {
	/** State from `createDataTable` */
	table: DataTableState<T>;
	/** Choices for the rows per page; defaults to `[10, 20, 30, 40, 50]` */
	pageSizes?: number[];
	/** Classes merged onto the bar */
	class?: CompProps<"div">["class"];
}

/** Menu that shows and hides the columns */
export interface ViewOptionsProps<T> {
	/** State from `createDataTable` */
	table: DataTableState<T>;
}

export type DataTableProps<T> = Props<T>;
export type DataTableColumnHeaderProps<T> = ColumnHeaderProps<T>;
export type DataTablePaginationProps<T> = PaginationProps<T>;
export type DataTableViewOptionsProps<T> = ViewOptionsProps<T>;
