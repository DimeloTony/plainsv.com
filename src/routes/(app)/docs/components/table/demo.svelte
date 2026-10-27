<script lang="ts">
	import { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption, type TableProps } from "#lib/components/ui/table/index.js";
	import { Checkbox } from "#lib/components/ui/checkbox/index.js";
	import { Badge } from "#lib/components/ui/badge/index.js";

	const { section = "preview" }: Props = $props();
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	const invoices = [
		{ id: "INV001", status: "Paid", method: "Credit Card", amount: 250 },
		{ id: "INV002", status: "Pending", method: "PayPal", amount: 150 },
		{ id: "INV003", status: "Unpaid", method: "Bank Transfer", amount: 350 },
		{ id: "INV004", status: "Paid", method: "Credit Card", amount: 450 },
		{ id: "INV005", status: "Paid", method: "PayPal", amount: 550 },
	];
	const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
	const total = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
	let selectedIds: string[] = $state(["INV002"]);
	const isAllSelected = $derived(selectedIds.length === invoices.length);

	/** Adds or removes one invoice from the selection. */
	const toggleInvoice = (id: string, checked: boolean) => (selectedIds = checked ? [...selectedIds, id] : selectedIds.filter((selectedId) => selectedId !== id));

	/** Live preview for one section of the table docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "selection" | "sizes";
	}
</script>

<!-- Invoice table with a caption and a total footer, reused by the preview and sizes sections. -->
{#snippet invoiceTable(props: Omit<TableProps, "children">)}
	<Table {...props}>
		<TableCaption>A list of your recent invoices.</TableCaption>
		<TableHeader>
			<TableRow>
				<TableHead style="width: 6rem">Invoice</TableHead>
				<TableHead>Status</TableHead>
				<TableHead>Method</TableHead>
				<TableHead style="text-align: right">Amount</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each invoices as invoice (invoice.id)}
				<TableRow>
					<TableCell style="font-weight: 500">{invoice.id}</TableCell>
					<TableCell>{invoice.status}</TableCell>
					<TableCell>{invoice.method}</TableCell>
					<TableCell style="text-align: right">{currency.format(invoice.amount)}</TableCell>
				</TableRow>
			{/each}
		</TableBody>
		<TableFooter>
			<TableRow>
				<TableCell colspan={3}>Total</TableCell>
				<TableCell style="text-align: right">{currency.format(total)}</TableCell>
			</TableRow>
		</TableFooter>
	</Table>
{/snippet}

<div class="demo">
	{#if section === "preview"}
		{@render invoiceTable({})}
	{:else if section === "selection"}
		<!-- Checkbox column; selected rows are highlighted with data-state. -->
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead style="width: 2rem">
						<Checkbox aria-label="Select all invoices" checked={isAllSelected} indeterminate={selectedIds.length > 0 && !isAllSelected} onCheckedChange={(checked) => (selectedIds = checked ? invoices.map((invoice) => invoice.id) : [])} />
					</TableHead>
					<TableHead>Invoice</TableHead>
					<TableHead>Status</TableHead>
					<TableHead style="text-align: right">Amount</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#each invoices as invoice (invoice.id)}
					{@const isSelected = selectedIds.includes(invoice.id)}
					<TableRow data-state={isSelected ? "selected" : undefined}>
						<TableCell>
							<Checkbox aria-label="Select {invoice.id}" checked={isSelected} onCheckedChange={(checked) => toggleInvoice(invoice.id, checked)} />
						</TableCell>
						<TableCell style="font-weight: 500">{invoice.id}</TableCell>
						<TableCell><Badge variant={invoice.status === "Paid" ? "secondary" : "outline"}>{invoice.status}</Badge></TableCell>
						<TableCell style="text-align: right">{currency.format(invoice.amount)}</TableCell>
					</TableRow>
				{/each}
			</TableBody>
		</Table>
		<p class="demoText">{selectedIds.length} of {invoices.length} selected</p>
	{:else if section === "sizes"}
		<!-- Compact and spacious tables. -->
		{#each sizes as size (size)}
			{@render invoiceTable({ size })}
		{/each}
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--spacing-xl);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 1rem 0;
	}

	.demoText {
		margin: 0;
		color: var(--muted-foreground);
		font-size: var(--text-sm);
	}
</style>
