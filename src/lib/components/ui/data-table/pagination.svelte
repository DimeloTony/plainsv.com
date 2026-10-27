<script lang="ts" generics="T">
	import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from "@lucide/svelte";
	import { Button } from "#lib/components/ui/button/index.js";
	import { NativeSelect, NativeSelectOption } from "#lib/components/ui/native-select/index.js";
	import type { PaginationProps } from "./index.js";
	const { table, pageSizes = [10, 20, 30, 40, 50], class: className, ...props }: PaginationProps<T> = $props();
	const selectId = $props.id();
	const isFirstPage = $derived(table.pageIndex === 0);
	const isLastPage = $derived(table.pageIndex >= table.pageCount - 1);
</script>

<!-- Selected count on the start, rows per page and page buttons on the end. -->
<div class={["dataTablePagination not-typeset", className]} {...props}>
	<p class="dataTablePaginationCount">
		{#if table.enableRowSelection}
			{table.selectedRowList.length} of {table.filteredRows.length} row(s) selected.
		{:else}
			{table.filteredRows.length} row(s).
		{/if}
	</p>
	<div class="dataTablePaginationControls">
		<div class="dataTablePaginationSize">
			<label for={selectId}>Rows per page</label>
			<NativeSelect id={selectId} size="sm" value={table.pageSize} onchange={(e) => table.setPageSize(Number(e.currentTarget.value))}>
				{#each pageSizes as pageSize (pageSize)}
					<NativeSelectOption value={pageSize}>{pageSize}</NativeSelectOption>
				{/each}
			</NativeSelect>
		</div>
		<p class="dataTablePaginationPage" aria-live="polite">Page {table.pageIndex + 1} of {table.pageCount}</p>
		<div class="dataTablePaginationButtons">
			<Button variant="outline" size="icon-sm" aria-label="Go to first page" disabled={isFirstPage} onclick={() => table.setPage(0)}><ChevronsLeftIcon /></Button>
			<Button variant="outline" size="icon-sm" aria-label="Go to previous page" disabled={isFirstPage} onclick={() => table.setPage(table.pageIndex - 1)}><ChevronLeftIcon /></Button>
			<Button variant="outline" size="icon-sm" aria-label="Go to next page" disabled={isLastPage} onclick={() => table.setPage(table.pageIndex + 1)}><ChevronRightIcon /></Button>
			<Button variant="outline" size="icon-sm" aria-label="Go to last page" disabled={isLastPage} onclick={() => table.setPage(table.pageCount - 1)}><ChevronsRightIcon /></Button>
		</div>
	</div>
</div>

<style>
	/* Base bar; wraps on narrow screens */
	.dataTablePagination {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: var(--spacing-md);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	.dataTablePaginationCount {
		margin: 0;
		color: var(--muted-foreground);
	}

	.dataTablePaginationControls,
	.dataTablePaginationSize,
	.dataTablePaginationButtons {
		display: flex;
		align-items: center;
	}

	.dataTablePaginationControls {
		flex-wrap: wrap;
		gap: var(--spacing-lg);
	}

	.dataTablePaginationSize {
		gap: var(--spacing-sm);
		font-weight: 500;
	}

	.dataTablePaginationPage {
		margin: 0;
		font-weight: 500;
	}

	.dataTablePaginationButtons {
		gap: var(--spacing-sm);
	}
</style>
