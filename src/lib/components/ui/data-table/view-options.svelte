<script lang="ts" generics="T">
	import { Settings2Icon } from "@lucide/svelte";
	import { Button } from "#lib/components/ui/button/index.js";
	import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "#lib/components/ui/dropdown-menu/index.js";
	import type { ViewOptionsProps } from "./index.js";
	const { table }: ViewOptionsProps<T> = $props();
	const hideableColumns = $derived(table.columns.filter((column) => column.hideable !== false));
</script>

<!-- Menu of checkboxes, one per column that can be hidden. -->
<DropdownMenu align="end" size="sm">
	<DropdownMenuTrigger>
		{#snippet trigger({ props })}
			<Button variant="outline" size="sm" {...props}><Settings2Icon />View</Button>
		{/snippet}
	</DropdownMenuTrigger>
	<DropdownMenuContent>
		<DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
		<DropdownMenuSeparator />
		{#each hideableColumns as column (column.id)}
			<DropdownMenuCheckboxItem checked={!table.hiddenColumns[column.id]} onCheckedChange={(checked) => table.setColumnVisible(column.id, checked)}>
				{column.header}
			</DropdownMenuCheckboxItem>
		{/each}
	</DropdownMenuContent>
</DropdownMenu>
