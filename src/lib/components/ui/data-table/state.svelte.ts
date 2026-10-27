import type { DataTableColumn, DataTableOptions, DataTableRow, DataTableSort } from "./index.js";

/** Reads a column's value from a row through its accessor. */
function readValue<T>(row: T, column: DataTableColumn<T>): unknown {
	// If the column has no accessor: it shows no value, such as an actions column.
	if (!column.accessor) return undefined;
	if (typeof column.accessor === "function") return column.accessor(row);
	return row[column.accessor];
}

/** Orders two values: numbers and dates by size, everything else as text with numbers in natural order. */
function compareValues(a: unknown, b: unknown) {
	// Empty values sort last.
	if (a == null || a === "") return b == null || b === "" ? 0 : 1;
	if (b == null || b === "") return -1;
	if (typeof a === "number" && typeof b === "number") return a - b;
	if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
	return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
}

/** Whether a value contains the filter text, ignoring case. */
const includesText = (value: unknown, filter: string) =>
	String(value ?? "")
		.toLowerCase()
		.includes(filter.toLowerCase());

/** Sorting, filtering, pagination, column visibility, and row selection for a list of rows */
export class DataTableState<T> {
	/** Column the rows are sorted by, and the direction */
	sort?: DataTableSort = $state();
	/** Text that any searchable column must contain */
	globalFilter = $state("");
	/** Text each column must contain, by column id */
	columnFilters: Record<string, string> = $state({});
	/** Zero-based index of the shown page */
	pageIndex = $state(0);
	/** Rows per page */
	pageSize = $state(10);
	/** Hidden columns, by column id */
	hiddenColumns: Record<string, boolean> = $state({});
	/** Selected rows, by row id */
	selectedRows: Record<string, boolean> = $state({});
	/** Whether rows can be selected with a checkbox column */
	enableRowSelection = $state(false);
	/** Reads the current rows */
	#getData: () => T[];
	/** Column definitions */
	columns: DataTableColumn<T>[];
	/** Builds a stable id for a row */
	#getRowId: (row: T, index: number) => string;

	/** Every row, wrapped with its id and index */
	allRows: DataTableRow<T>[] = $derived.by(() => this.#getData().map((original, index) => ({ id: this.#getRowId(original, index), index, original })));
	/** Rows that pass the global and column filters */
	filteredRows: DataTableRow<T>[] = $derived.by(() => {
		const columnFilters = Object.entries(this.columnFilters).filter(([, value]) => value);
		const searchable = this.columns.filter((column) => column.accessor && column.searchable !== false);
		return this.allRows.filter((row) => {
			// If a global filter is set: some searchable column must contain it.
			if (this.globalFilter && !searchable.some((column) => includesText(readValue(row.original, column), this.globalFilter))) return false;
			// Every column filter must match its column.
			return columnFilters.every(([id, filter]) => {
				const column = this.columns.find((candidate) => candidate.id === id);
				// If the filtered column does not exist: ignore its filter.
				if (!column) return true;
				const value = readValue(row.original, column);
				return column.filterFn ? column.filterFn(value, filter, row.original) : includesText(value, filter);
			});
		});
	});
	/** Filtered rows in sort order */
	sortedRows: DataTableRow<T>[] = $derived.by(() => {
		const sort = this.sort;
		const column = sort && this.columns.find((candidate) => candidate.id === sort.id);
		// If there is no sort: keep the data order.
		if (!sort || !column) return this.filteredRows;
		const compare = column.sortFn ?? compareValues;
		const direction = sort.desc ? -1 : 1;
		return [...this.filteredRows].sort((a, b) => compare(readValue(a.original, column), readValue(b.original, column)) * direction);
	});
	/** Number of pages; at least one, so an empty table still shows page 1 of 1 */
	pageCount = $derived(Math.max(Math.ceil(this.sortedRows.length / this.pageSize), 1));
	/** Rows on the shown page */
	pageRows: DataTableRow<T>[] = $derived(this.sortedRows.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize));
	/** Columns that are not hidden */
	visibleColumns: DataTableColumn<T>[] = $derived.by(() => this.columns.filter((column) => !this.hiddenColumns[column.id]));
	/** Rows that are selected, across every page */
	selectedRowList: DataTableRow<T>[] = $derived(this.allRows.filter((row) => this.selectedRows[row.id]));

	constructor(options: DataTableOptions<T>) {
		this.#getData = options.data;
		this.columns = options.columns;
		this.#getRowId = options.getRowId ?? ((_, index) => String(index));
		this.pageSize = options.pageSize ?? 10;
		this.enableRowSelection = options.enableRowSelection ?? false;
		this.sort = options.initialSort;
	}

	/** Reads a column's value from a row. */
	getValue(row: DataTableRow<T>, column: DataTableColumn<T>) {
		return readValue(row.original, column);
	}

	/** Cycles a column through ascending, descending, and unsorted. */
	toggleSort(id: string) {
		if (this.sort?.id !== id) this.sort = { id, desc: false };
		else if (!this.sort.desc) this.sort = { id, desc: true };
		else this.sort = undefined;
		this.pageIndex = 0;
	}

	/** Sets the text every searchable column is matched against, and returns to the first page. */
	setGlobalFilter(value: string) {
		this.globalFilter = value;
		this.pageIndex = 0;
	}

	/** Sets the text one column must contain, and returns to the first page. */
	setColumnFilter(id: string, value: string) {
		this.columnFilters[id] = value;
		this.pageIndex = 0;
	}

	/** Shows a page, kept inside the page range. */
	setPage(index: number) {
		this.pageIndex = Math.min(Math.max(index, 0), this.pageCount - 1);
	}

	/** Changes the rows per page and keeps the first shown row on screen. */
	setPageSize(size: number) {
		const firstRow = this.pageIndex * this.pageSize;
		this.pageSize = size;
		this.setPage(Math.floor(firstRow / size));
	}

	/** Shows or hides a column. */
	setColumnVisible(id: string, visible: boolean) {
		this.hiddenColumns[id] = !visible;
	}

	/** Selects or clears one row. */
	setRowSelected(id: string, selected: boolean) {
		this.selectedRows[id] = selected;
	}

	/** Selects or clears every row on the shown page. */
	setPageSelected(selected: boolean) {
		for (const row of this.pageRows) this.selectedRows[row.id] = selected;
	}

	/** Whether every row on the shown page is selected */
	get isPageSelected() {
		return this.pageRows.length > 0 && this.pageRows.every((row) => this.selectedRows[row.id]);
	}

	/** Whether some, but not all, rows on the shown page are selected */
	get isPagePartlySelected() {
		return !this.isPageSelected && this.pageRows.some((row) => this.selectedRows[row.id]);
	}
}

/** Creates the state for a data table; pass `data` as a getter so the table follows changes to it. */
export function createDataTable<T>(options: DataTableOptions<T>) {
	return new DataTableState(options);
}
