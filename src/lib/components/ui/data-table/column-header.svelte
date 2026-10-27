<script lang="ts" generics="T">
	import { ArrowUpIcon, ArrowDownIcon, ChevronsUpDownIcon } from "@lucide/svelte";
	import { Button } from "#lib/components/ui/button/index.js";
	import type { ColumnHeaderProps } from "./index.js";
	const { table, column }: ColumnHeaderProps<T> = $props();
	// Columns sort by default when they have a value to sort by.
	const isSortable = $derived(column.sortable ?? !!column.accessor);
	const direction = $derived(table.sort?.id === column.id ? (table.sort.desc ? "desc" : "asc") : undefined);
</script>

<!-- A sortable heading is a ghost button with the direction arrow; other headings are plain text. -->
{#if isSortable}
	<Button variant="ghost" size="sm" class="dataTableSortButton" onclick={() => table.toggleSort(column.id)}>
		{column.header}
		{#if direction === "asc"}
			<ArrowUpIcon aria-hidden="true" />
		{:else if direction === "desc"}
			<ArrowDownIcon aria-hidden="true" />
		{:else}
			<ChevronsUpDownIcon aria-hidden="true" />
		{/if}
	</Button>
{:else}
	{column.header}
{/if}

<style>
	/* The button's padding lines its text up with the cells below */
	:global(.dataTableSortButton) {
		margin-inline: calc(var(--spacing-sm) * -1);
	}
</style>
