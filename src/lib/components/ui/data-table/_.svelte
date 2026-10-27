<script lang="ts" generics="T">
	import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "#lib/components/ui/table/index.js";
	import { Checkbox } from "#lib/components/ui/checkbox/index.js";
	import ColumnHeader from "./column-header.svelte";
	import type { Props } from "./index.js";
	const { table, cell, leading, leadingLabel, rowProps, emptyText = "No results.", size = "md", class: className, ...props }: Props<T> = $props();
	// The empty row spans every column, including the leading and checkbox columns.
	const columnCount = $derived(table.visibleColumns.length + (table.enableRowSelection ? 1 : 0) + (leading ? 1 : 0));
</script>

<!-- Table of the shown page; sortable headings toggle the sort, and an optional checkbox column selects rows. -->
<div class="dataTable not-typeset">
	<Table {size} class={className} {...props}>
		<TableHeader>
			<TableRow>
				{#if leading}
					<TableHead style="width: 2rem">
						{#if leadingLabel}
							<span class="dataTableSrOnly">{leadingLabel}</span>
						{/if}
					</TableHead>
				{/if}
				{#if table.enableRowSelection}
					<TableHead style="width: 2rem">
						<Checkbox aria-label="Select all rows on this page" checked={table.isPageSelected} indeterminate={table.isPagePartlySelected} onCheckedChange={(checked) => table.setPageSelected(checked)} />
					</TableHead>
				{/if}
				{#each table.visibleColumns as column (column.id)}
					<TableHead style={column.align ? `text-align: ${column.align}` : undefined} aria-sort={table.sort?.id === column.id ? (table.sort.desc ? "descending" : "ascending") : undefined}>
						{#if column.hideHeader}
							<span class="dataTableSrOnly">{column.header}</span>
						{:else}
							<ColumnHeader {table} {column} />
						{/if}
					</TableHead>
				{/each}
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each table.pageRows as row (row.id)}
				<TableRow {...rowProps?.(row)} data-state={table.selectedRows[row.id] ? "selected" : undefined}>
					{#if leading}
						<TableCell>{@render leading({ row })}</TableCell>
					{/if}
					{#if table.enableRowSelection}
						<TableCell>
							<Checkbox aria-label="Select row {row.index + 1}" checked={!!table.selectedRows[row.id]} onCheckedChange={(checked) => table.setRowSelected(row.id, checked)} />
						</TableCell>
					{/if}
					{#each table.visibleColumns as column (column.id)}
						{@const value = table.getValue(row, column)}
						<TableCell style={column.align ? `text-align: ${column.align}` : undefined}>
							{#if cell}
								{@render cell({ row, column, value })}
							{:else}
								{value ?? ""}
							{/if}
						</TableCell>
					{/each}
				</TableRow>
			{:else}
				<!-- No rows match the filters. -->
				<TableRow>
					<TableCell colspan={columnCount} style="height: 6rem; text-align: center">{emptyText}</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>
</div>

<style>
	/* Bordered frame around the table */
	.dataTable {
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		overflow: hidden;
	}

	/* Heading text kept for screen readers only */
	.dataTableSrOnly {
		position: absolute;
		clip-path: inset(50%);
		margin: -1px;
		padding: 0;
		width: 1px;
		height: 1px;
		overflow: hidden;
		white-space: nowrap;
	}
</style>
