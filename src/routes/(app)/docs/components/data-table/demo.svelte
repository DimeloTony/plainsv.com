<script lang="ts">
	import { DataTable, DataTableColumnHeader, DataTablePagination, DataTableViewOptions, createDataTable, type DataTableColumn, type DataTableRow } from "#lib/components/ui/data-table/index.js";
	import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "#lib/components/ui/table/index.js";
	import { Input } from "#lib/components/ui/input/index.js";
	import { Badge } from "#lib/components/ui/badge/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { GripVerticalIcon, Trash2Icon } from "@lucide/svelte";

	const { section = "preview" }: Props = $props();
	const statuses = ["pending", "processing", "success", "failed"] as const;
	const payments: Payment[] = Array.from({ length: 36 }, (_, index) => ({
		id: `pay-${String(index + 1).padStart(3, "0")}`,
		email: ["ken99", "abe45", "monserrat44", "silas22", "carmella"][index % 5] + `${index}@example.com`,
		status: statuses[index % statuses.length],
		amount: Math.round(((index * 137) % 900) + 50),
	}));
	const columns: DataTableColumn<Payment>[] = [
		{ id: "status", header: "Status", accessor: "status" },
		{ id: "email", header: "Email", accessor: "email" },
		{ id: "amount", header: "Amount", accessor: "amount", align: "right" },
	];
	const table = createDataTable({ data: () => payments, columns, getRowId: (row) => row.id, enableRowSelection: true, pageSize: 10 });
	// Status is fixed and always shown; email is searched; amount sorts but is not searched.
	const optionColumns: DataTableColumn<Payment>[] = [
		{ id: "status", header: "Status", accessor: "status", sortable: false, hideable: false },
		{ id: "email", header: "Email", accessor: "email" },
		{ id: "amount", header: "Amount", accessor: "amount", align: "right", searchable: false },
	];
	const optionsTable = createDataTable({ data: () => payments, columns: optionColumns, getRowId: (row) => row.id, pageSize: 5, initialSort: { id: "amount", desc: true } });
	const customTable = createDataTable({ data: () => payments.slice(0, 5), columns, getRowId: (row) => row.id });
	const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
	// Rows that can be dragged into a new order, with a remove button whose heading is for screen readers only.
	const orderColumns: DataTableColumn<Payment>[] = [
		{ id: "email", header: "Email", accessor: "email", sortable: false },
		{ id: "amount", header: "Amount", accessor: "amount", align: "right", sortable: false },
		{ id: "actions", header: "Actions", hideable: false, hideHeader: true },
	];
	let orderedPayments = $state(payments.slice(0, 5));
	let draggingId: string | null = $state(null);
	const orderTable = createDataTable({ data: () => orderedPayments, columns: orderColumns, getRowId: (row) => row.id });

	/** Moves a payment into the place of another payment. */
	function movePayment(fromId: string, toId: string) {
		const from = orderedPayments.findIndex((payment) => payment.id === fromId);
		const to = orderedPayments.findIndex((payment) => payment.id === toId);
		// If either row is missing or both are the same row: nothing to move.
		if (from === -1 || to === -1 || from === to) return;
		const next = [...orderedPayments];
		next.splice(to, 0, ...next.splice(from, 1));
		orderedPayments = next;
	}

	/** Starts dragging a row by its handle. */
	function handleDragStart(e: DragEvent, id: string) {
		draggingId = id;
		// Firefox only starts a drag that carries data.
		e.dataTransfer?.setData("text/plain", id);
	}

	/** Moves a row up or down with the arrow keys on its handle. */
	function handleHandleKeydown(e: KeyboardEvent, id: string) {
		const offset = e.key === "ArrowUp" ? -1 : e.key === "ArrowDown" ? 1 : 0;
		const neighbor = orderedPayments[orderedPayments.findIndex((payment) => payment.id === id) + offset];
		// If another key was pressed, or the row is already at that end: leave it.
		if (!offset || !neighbor) return;
		e.preventDefault();
		movePayment(id, neighbor.id);
	}

	/** Lets a row take the dragged row's place. */
	function getRowProps(row: DataTableRow<Payment>) {
		return {
			ondragover: (e: DragEvent) => {
				// If no row is being dragged: ignore it.
				if (draggingId === null) return;
				e.preventDefault();
				movePayment(draggingId, row.original.id);
			},
			ondrop: (e: DragEvent) => e.preventDefault(),
		};
	}

	/** Live preview for one section of the data table docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "columns" | "rows" | "custom";
	}

	/** One payment row */
	interface Payment {
		/** Stable id */
		id: string;
		/** Customer email */
		email: string;
		/** Payment status */
		status: (typeof statuses)[number];
		/** Amount in dollars */
		amount: number;
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Filter and column menu above the table, pagination below it. -->
		<div class="demoToolbar">
			<Input size="sm" placeholder="Filter emails..." aria-label="Filter emails" value={table.columnFilters.email ?? ""} oninput={(e) => table.setColumnFilter("email", e.currentTarget.value)} style="max-width: 16rem" />
			<DataTableViewOptions {table} />
		</div>
		<DataTable {table}>
			{#snippet cell({ row, column, value })}
				{#if column.id === "status"}
					<Badge variant={row.original.status === "failed" ? "destructive" : row.original.status === "success" ? "secondary" : "outline"}>{value}</Badge>
				{:else if column.id === "amount"}
					<span style="font-weight: 500">{currency.format(Number(value))}</span>
				{:else}
					{value}
				{/if}
			{/snippet}
		</DataTable>
		<DataTablePagination {table} />
	{:else if section === "columns"}
		<!-- Global search, a starting sort, column options, empty text, and custom page sizes. -->
		<div class="demoToolbar">
			<Input size="sm" placeholder="Search..." aria-label="Search payments" value={optionsTable.globalFilter} oninput={(e) => optionsTable.setGlobalFilter(e.currentTarget.value)} style="max-width: 16rem" />
			<DataTableViewOptions table={optionsTable} />
		</div>
		<DataTable table={optionsTable} emptyText="No payments match your search." />
		<DataTablePagination table={optionsTable} pageSizes={[5, 15, 30]} />
	{:else if section === "rows"}
		<!-- Drag handles in a leading cell, drag handlers on each row, and a hidden actions heading. -->
		<DataTable table={orderTable} leadingLabel="Reorder" rowProps={getRowProps}>
			{#snippet leading({ row })}
				<button type="button" class="demoHandle" draggable="true" aria-label="Drag to reorder, or use the up and down arrows" ondragstart={(e) => handleDragStart(e, row.original.id)} ondragend={() => (draggingId = null)} onkeydown={(e) => handleHandleKeydown(e, row.original.id)}>
					<GripVerticalIcon />
				</button>
			{/snippet}
			{#snippet cell({ row, column, value })}
				{#if column.id === "actions"}
					<Button variant="ghost" size="icon-sm" aria-label="Remove {row.original.email}" onclick={() => (orderedPayments = orderedPayments.filter((payment) => payment.id !== row.original.id))}><Trash2Icon /></Button>
				{:else if column.id === "amount"}
					{currency.format(Number(value))}
				{:else}
					{value}
				{/if}
			{/snippet}
		</DataTable>
	{:else if section === "custom"}
		<!-- Own table markup with sortable headings from the same state. -->
		<Table>
			<TableHeader>
				<TableRow>
					{#each customTable.visibleColumns as column (column.id)}
						<TableHead style={column.align ? `text-align: ${column.align}` : undefined}><DataTableColumnHeader table={customTable} {column} /></TableHead>
					{/each}
				</TableRow>
			</TableHeader>
			<TableBody>
				{#each customTable.pageRows as row (row.id)}
					<TableRow>
						{#each customTable.visibleColumns as column (column.id)}
							<TableCell style={column.align ? `text-align: ${column.align}` : undefined}>{customTable.getValue(row, column)}</TableCell>
						{/each}
					</TableRow>
				{/each}
			</TableBody>
		</Table>
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 1rem 0;
	}

	.demoToolbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--spacing-sm);
	}

	/* Small muted button that starts a drag */
	.demoHandle {
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: grab;
		border-radius: var(--radius-md);
		width: 1.75rem; /* 28px */
		height: 1.75rem; /* 28px */
		color: var(--muted-foreground);
	}

	.demoHandle:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
	}

	.demoHandle :global(svg) {
		width: 0.75rem; /* 12px */
		height: 0.75rem; /* 12px */
	}
</style>
