<script lang="ts">
	import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis, getPageRange } from "#lib/components/ui/pagination/index.js";

	const { section = "preview" }: Props = $props();
	const pageCount = 20;
	let currentPage = $state(8);
	const pages = $derived(getPageRange(currentPage, pageCount));

	/** Live preview for one section of the pagination docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "controlled" | "sizes";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Static links with an ellipsis, used at the top of the page. -->
		<Pagination>
			<PaginationContent>
				<PaginationItem><PaginationPrevious href="#pagination" /></PaginationItem>
				<PaginationItem><PaginationLink href="#pagination">1</PaginationLink></PaginationItem>
				<PaginationItem><PaginationLink href="#pagination" isActive>2</PaginationLink></PaginationItem>
				<PaginationItem><PaginationLink href="#pagination">3</PaginationLink></PaginationItem>
				<PaginationItem><PaginationEllipsis /></PaginationItem>
				<PaginationItem><PaginationNext href="#pagination" /></PaginationItem>
			</PaginationContent>
		</Pagination>
	{:else if section === "controlled"}
		<!-- Buttons driven by state, with the page range helper. -->
		<Pagination>
			<PaginationContent>
				<PaginationItem><PaginationPrevious disabled={currentPage === 1} onclick={() => currentPage--} /></PaginationItem>
				{#each pages as page, index (index)}
					<PaginationItem>
						{#if page === "ellipsis"}
							<PaginationEllipsis />
						{:else}
							<PaginationLink isActive={page === currentPage} onclick={() => (currentPage = page)}>{page}</PaginationLink>
						{/if}
					</PaginationItem>
				{/each}
				<PaginationItem><PaginationNext disabled={currentPage === pageCount} onclick={() => currentPage++} /></PaginationItem>
			</PaginationContent>
		</Pagination>
		<p class="demoText">Page {currentPage} of {pageCount}</p>
	{:else if section === "sizes"}
		<!-- Small and large links. -->
		{#each ["sm", "lg"] as const as size (size)}
			<Pagination {size}>
				<PaginationContent>
					<PaginationItem><PaginationPrevious href="#pagination" /></PaginationItem>
					<PaginationItem><PaginationLink href="#pagination" isActive>1</PaginationLink></PaginationItem>
					<PaginationItem><PaginationLink href="#pagination">2</PaginationLink></PaginationItem>
					<PaginationItem><PaginationNext href="#pagination" /></PaginationItem>
				</PaginationContent>
			</Pagination>
		{/each}
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-md);
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
