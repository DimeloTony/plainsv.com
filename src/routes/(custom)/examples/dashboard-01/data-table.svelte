<script lang="ts">
	import { tick } from "svelte";
	import { DataTable, createDataTable, DataTablePagination, type DataTableColumn, type DataTableRow } from "#lib/components/ui/data-table/index.js";
	import { Tabs, TabsList, TabsTrigger, TabsContent } from "#lib/components/ui/tabs/index.js";
	import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "#lib/components/ui/select/index.js";
	import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuSeparator } from "#lib/components/ui/dropdown-menu/index.js";
	import { Badge } from "#lib/components/ui/badge/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { Input } from "#lib/components/ui/input/index.js";
	import { Label } from "#lib/components/ui/label/index.js";
	import { toast } from "#lib/components/ui/toaster/index.js";
	import { GripVerticalIcon, CircleCheckIcon, LoaderIcon, EllipsisVerticalIcon, Columns3Icon, ChevronDownIcon, PlusIcon } from "@lucide/svelte";
	import TableCellViewer from "./table-cell-viewer.svelte";
	import type { Section } from "./types.js";
	const { data }: Props = $props();
	// Views of the document; only the outline has content in this example.
	const views = [
		{ value: "outline", label: "Outline" },
		{ value: "past-performance", label: "Past Performance", count: 3 },
		{ value: "key-personnel", label: "Key Personnel", count: 2 },
		{ value: "focus-documents", label: "Focus Documents" },
	];
	// Plain headings, like shadcn's dashboard; the rows keep the order they are dragged into.
	const columns: DataTableColumn<Section>[] = [
		{ id: "header", header: "Header", accessor: "header", sortable: false, hideable: false },
		{ id: "type", header: "Section Type", accessor: "type", sortable: false },
		{ id: "status", header: "Status", accessor: "status", sortable: false },
		{ id: "target", header: "Target", accessor: "target", sortable: false, align: "right" },
		{ id: "limit", header: "Limit", accessor: "limit", sortable: false, align: "right" },
		{ id: "reviewer", header: "Reviewer", accessor: "reviewer", sortable: false },
		{ id: "actions", header: "Actions", hideable: false, hideHeader: true },
	];
	// Columns listed in the columns menu.
	const hideableColumns = columns.filter((column) => column.accessor && column.hideable !== false);
	// The rows are local state, so dragging can reorder them.
	let sections = $state(data);
	let view = $state("outline");
	let draggingId: number | null = $state(null);
	const table = createDataTable({ data: () => sections, columns, getRowId: (row) => String(row.id), enableRowSelection: true });

	/** Moves a section into the position of another section. */
	function moveSection(fromId: number, toId: number) {
		const from = sections.findIndex((section) => section.id === fromId);
		const to = sections.findIndex((section) => section.id === toId);
		// If either row is missing or both are the same row: nothing to move.
		if (from === -1 || to === -1 || from === to) return;
		const next = [...sections];
		const [moved] = next.splice(from, 1);
		next.splice(to, 0, moved);
		sections = next;
	}

	/** Starts dragging a row by its handle, with the whole row as the drag image. */
	function handleDragStart(e: DragEvent & { currentTarget: HTMLElement }, id: number) {
		draggingId = id;
		// If the browser gives no data transfer: drag without a custom image.
		if (!e.dataTransfer) return;
		e.dataTransfer.effectAllowed = "move";
		// Firefox only starts a drag that carries data.
		e.dataTransfer.setData("text/plain", String(id));
		const row = e.currentTarget.closest("tr");
		if (row) e.dataTransfer.setDragImage(row, 16, row.offsetHeight / 2);
	}

	/** Moves the dragged row into the hovered row's place while dragging. */
	function handleDragOver(e: DragEvent, id: number) {
		// If no row is being dragged, such as a file from the desktop: ignore it.
		if (draggingId === null) return;
		e.preventDefault();
		moveSection(draggingId, id);
	}

	/** Moves a row up or down with the arrow keys on its handle, keeping focus on the handle. */
	async function handleHandleKeydown(e: KeyboardEvent, id: number) {
		const offset = e.key === "ArrowUp" ? -1 : e.key === "ArrowDown" ? 1 : 0;
		// If another key was pressed: leave it to the browser.
		if (!offset) return;
		e.preventDefault();
		const neighbor = sections[sections.findIndex((section) => section.id === id) + offset];
		// If the row is already first or last: nothing to move.
		if (!neighbor) return;
		moveSection(id, neighbor.id);
		// Moving the row can drop focus, so put it back on the same handle.
		await tick();
		document.querySelector<HTMLElement>(`[data-drag-handle="${id}"]`)?.focus();
	}

	/** Lets a row take the dragged row's place, and marks the row being dragged. */
	function getRowProps(row: DataTableRow<Section>) {
		return {
			"data-dragging": draggingId === row.original.id || undefined,
			ondragover: (e: DragEvent) => handleDragOver(e, row.original.id),
			ondrop: (e: DragEvent) => e.preventDefault(),
		};
	}

	/** Pretends to save an inline edit and shows its progress in a toast. */
	function handleSave(e: SubmitEvent, section: Section) {
		e.preventDefault();
		toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), { loading: `Saving ${section.header}`, success: "Done", error: "Error" });
	}

	/** Rows of the document outline */
	interface Props {
		/** Sections to list, in their starting order */
		data: Section[];
	}
</script>

<div class="sectionsView">
	<Tabs value={view} onValueChange={(value) => (view = value)} class="sectionsTabs">
		<!-- Toolbar: a view select on narrow content or tabs on wide content, then the column and add buttons. -->
		<div class="sectionsToolbar">
			<Label for="view-selector" class="srOnly">View</Label>
			<Select value={view} onValueChange={(value) => (view = value)} size="sm">
				<SelectTrigger id="view-selector" class="viewSelect">
					<SelectValue placeholder="Select a view" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{#each views as option (option.value)}
							<SelectItem value={option.value}>{option.label}</SelectItem>
						{/each}
					</SelectGroup>
				</SelectContent>
			</Select>
			<TabsList class="viewTabs">
				{#each views as option (option.value)}
					<TabsTrigger value={option.value}>
						{option.label}
						{#if option.count}
							<Badge variant="secondary" size="xs" rounded="pill" class="tabCount">{option.count}</Badge>
						{/if}
					</TabsTrigger>
				{/each}
			</TabsList>
			<div class="toolbarActions">
				<DropdownMenu align="end">
					<DropdownMenuTrigger>
						{#snippet trigger({ props })}
							<Button variant="outline" size="sm" {...props}><Columns3Icon /> Columns <ChevronDownIcon /></Button>
						{/snippet}
					</DropdownMenuTrigger>
					<DropdownMenuContent style="min-width: 8rem">
						{#each hideableColumns as column (column.id)}
							<DropdownMenuCheckboxItem checked={!table.hiddenColumns[column.id]} onCheckedChange={(checked) => table.setColumnVisible(column.id, checked)}>{column.header}</DropdownMenuCheckboxItem>
						{/each}
					</DropdownMenuContent>
				</DropdownMenu>
				<Button variant="outline" size="sm" aria-label="Add Section"><PlusIcon /><span class="addLabel">Add Section</span></Button>
			</div>
		</div>

		<!-- Outline view: the sections table with drag handles, selection, and inline edits. -->
		<TabsContent value="outline" class="sectionsContent">
			<div class="sectionsTable">
				<DataTable {table} leadingLabel="Reorder" rowProps={getRowProps}>
					<!-- Drag handle; the arrow keys move the row too. -->
					{#snippet leading({ row })}
						<button type="button" class="dragHandle" draggable="true" data-drag-handle={row.original.id} aria-label="Drag to reorder, or use the up and down arrows" ondragstart={(e) => handleDragStart(e, row.original.id)} ondragend={() => (draggingId = null)} onkeydown={(e) => handleHandleKeydown(e, row.original.id)}>
							<GripVerticalIcon />
						</button>
					{/snippet}
					{#snippet cell({ row, column })}
						{@const section = row.original}
						{#if column.id === "header"}
							<TableCellViewer item={section} />
						{:else if column.id === "type"}
							<span class="typeCell"><Badge variant="outline" class="mutedBadge">{section.type}</Badge></span>
						{:else if column.id === "status"}
							<Badge variant="outline" class="mutedBadge">
								{#if section.status === "Done"}
									<CircleCheckIcon class="doneIcon" />
								{:else}
									<LoaderIcon />
								{/if}
								{section.status}
							</Badge>
						{:else if column.id === "target" || column.id === "limit"}
							<!-- Inline edit; Enter saves it. -->
							<form onsubmit={(e) => handleSave(e, section)}>
								<Label for="{section.id}-{column.id}" class="srOnly">{column.header}</Label>
								<Input id="{section.id}-{column.id}" size="sm" class="inlineInput" value={column.id === "target" ? section.target : section.limit} />
							</form>
						{:else if column.id === "reviewer"}
							{#if section.reviewer !== "Assign reviewer"}
								{section.reviewer}
							{:else}
								<Label for="{section.id}-reviewer" class="srOnly">Reviewer</Label>
								<Select size="sm">
									<SelectTrigger id="{section.id}-reviewer" class="reviewerSelect">
										<SelectValue placeholder="Assign reviewer" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
											<SelectItem value="Jamik Tashpulatov">Jamik Tashpulatov</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
							{/if}
						{:else if column.id === "actions"}
							<DropdownMenu align="end">
								<DropdownMenuTrigger>
									{#snippet trigger({ props })}
										<Button variant="ghost" size="icon-sm" class="rowMenuButton" aria-label="Open menu" {...props}><EllipsisVerticalIcon /></Button>
									{/snippet}
								</DropdownMenuTrigger>
								<DropdownMenuContent style="min-width: 8rem">
									<DropdownMenuItem>Edit</DropdownMenuItem>
									<DropdownMenuItem>Make a copy</DropdownMenuItem>
									<DropdownMenuItem>Favorite</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						{/if}
					{/snippet}
				</DataTable>
			</div>
			<DataTablePagination {table} />
		</TabsContent>

		<!-- The other views are placeholders. -->
		{#each views.slice(1) as option (option.value)}
			<TabsContent value={option.value} class="sectionsContent">
				<div class="placeholderView"></div>
			</TabsContent>
		{/each}
	</Tabs>
</div>

<style>
	/* Text kept for screen readers only */
	.sectionsView :global(.srOnly) {
		position: absolute;
		clip-path: inset(50%);
		margin: -1px;
		padding: 0;
		width: 1px;
		height: 1px;
		overflow: hidden;
		white-space: nowrap;
	}

	.sectionsView :global(.tabs.sectionsTabs) {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xl);
		width: 100%;
	}

	/* Toolbar above the table */
	.sectionsToolbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-inline: var(--spacing-lg);
	}

	.sectionsToolbar :global(.tabsList.viewTabs) {
		display: none;
	}

	.toolbarActions {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
	}

	.addLabel {
		display: none;
	}

	/* Count badges in the tabs */
	.sectionsToolbar :global(.badge.tabCount) {
		justify-content: center;
		background-color: color-mix(in oklab, var(--muted-foreground) 30%, transparent);
		padding-inline: var(--spacing-xs);
		min-width: 1.25rem; /* 20px */
		height: 1.25rem; /* 20px */
	}

	/* Each view fills the width with the side padding */
	.sectionsView :global(.tabsContent.sectionsContent) {
		display: flex;
		position: relative;
		flex-direction: column;
		gap: var(--spacing-lg);
		padding-inline: var(--spacing-lg);
		overflow: auto;
	}

	/* The data table draws the frame; shadcn rounds it one step more */
	.sectionsTable :global(.dataTable) {
		border-radius: var(--radius-lg);
	}

	.sectionsTable :global(thead) {
		position: sticky;
		top: 0;
		z-index: 1;
		background-color: var(--muted);
	}

	/* A dragged row floats a little above the others */
	.sectionsTable :global(tr[data-dragging]) {
		position: relative;
		opacity: 80%;
		z-index: 1;
	}

	/* Small ghost button that starts a drag */
	.dragHandle {
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: grab;
		border-radius: var(--radius-md);
		width: 1.75rem; /* 28px */
		height: 1.75rem; /* 28px */
		color: var(--muted-foreground);
	}

	.dragHandle:active {
		cursor: grabbing;
	}

	.dragHandle:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
	}

	.dragHandle :global(svg) {
		width: 0.75rem; /* 12px */
		height: 0.75rem; /* 12px */
	}

	.typeCell {
		display: block;
		width: 8rem; /* 128px */
	}

	.sectionsTable :global(.badge.mutedBadge) {
		padding-inline: calc(var(--spacing-xs) * 1.5);
		color: var(--muted-foreground);
	}

	.sectionsTable :global(.doneIcon) {
		fill: var(--chart-2);
		color: var(--background);
	}

	/* Borderless input that shows its frame on hover and focus */
	.sectionsTable :global(td .input.inlineInput) {
		display: block;
		margin-left: auto;
		box-shadow: none;
		border-color: transparent;
		background-color: transparent;
		width: 4rem; /* 64px */
		text-align: right;
	}

	.sectionsTable :global(td .input.inlineInput:hover) {
		background-color: color-mix(in oklab, var(--input) 30%, transparent);
	}

	.sectionsTable :global(td .input.inlineInput:focus-visible) {
		border-color: var(--ring);
		background-color: var(--background);
	}

	.sectionsTable :global(.reviewerSelect) {
		width: 9.5rem; /* 152px */
	}

	/* The row menu button stays highlighted while its menu is open */
	.sectionsTable :global(.button.rowMenuButton) {
		color: var(--muted-foreground);
	}

	.sectionsTable :global(.button.rowMenuButton[aria-expanded="true"]) {
		background-color: var(--muted);
	}

	/* Empty dashed box for the placeholder views */
	.placeholderView {
		flex: 1;
		border: 1px dashed var(--border);
		border-radius: var(--radius-lg);
		aspect-ratio: 16 / 9;
		width: 100%;
	}

	@media (min-width: 64rem) {
		.sectionsToolbar,
		.sectionsView :global(.tabsContent.sectionsContent) {
			padding-inline: var(--spacing-xl);
		}

		.addLabel {
			display: inline;
		}
	}

	/* Tabs replace the view select once the content is 56rem wide */
	@container dashboardMain (min-width: 56rem) {
		.sectionsToolbar :global(.tabsList.viewTabs) {
			display: flex;
		}

		.sectionsToolbar :global(.viewSelect) {
			display: none;
		}
	}
</style>
