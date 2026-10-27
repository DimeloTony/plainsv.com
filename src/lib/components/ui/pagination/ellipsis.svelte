<script lang="ts">
	import { getContext } from "svelte";
	import { EllipsisIcon } from "@lucide/svelte";
	import type { EllipsisProps } from "./index.js";
	const { class: className, ...props }: EllipsisProps = $props();
	const getSize = getContext<() => UiSize>("pagination-size");
</script>

<!-- Gap in the page numbers; screen readers hear "More pages". -->
<span class={["paginationEllipsis", className]} data-size={getSize()} {...props}>
	<EllipsisIcon aria-hidden="true" />
	<span class="paginationEllipsisLabel">More pages</span>
</span>

<style>
	/* Base ellipsis; as large as a page link */
	.paginationEllipsis {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.paginationEllipsis :global(svg) {
		width: 1rem; /* 16px */
		height: 1rem; /* 16px */
	}

	/* Label read by screen readers only */
	.paginationEllipsisLabel {
		position: absolute;
		clip-path: inset(50%);
		margin: -1px;
		padding: 0;
		width: 1px;
		height: 1px;
		overflow: hidden;
		white-space: nowrap;
	}

	/* =============== Sizes =============== */

	/* Large */
	.paginationEllipsis[data-size="lg"] {
		width: var(--control-height-lg);
		height: var(--control-height-lg);
	}

	/* Medium — default */
	.paginationEllipsis[data-size="md"] {
		width: var(--control-height-md);
		height: var(--control-height-md);
	}

	/* Small */
	.paginationEllipsis[data-size="sm"] {
		width: var(--control-height-sm);
		height: var(--control-height-sm);
	}

	/* Extra small */
	.paginationEllipsis[data-size="xs"] {
		width: var(--control-height-xs);
		height: var(--control-height-xs);
	}
</style>
