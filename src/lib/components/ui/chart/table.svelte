<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	const { visible = false }: Props = $props();
	const ctx = useCompCtx();

	/** Data table that mirrors the chart */
	interface Props {
		/** Shows the table on screen; screen readers get it either way */
		visible?: boolean;
	}
</script>

<!-- Every value in the chart, including hidden series, so no value depends on hovering. -->
<div class="chartTableWrap scroll-fade-x" data-visible={visible || undefined}>
	<table class="chartTable">
		<thead>
			<tr>
				<th scope="col">{ctx.index}</th>
				{#each ctx.series as series (series.key)}
					<th scope="col">{series.label}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each ctx.data as row, position (position)}
				<tr>
					<th scope="row">{ctx.labels[position]}</th>
					{#each ctx.series as series (series.key)}
						<td>{ctx.formatFull(ctx.getValue(row, series.key))}</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	/* Hidden from view, but read by screen readers */
	.chartTableWrap {
		position: absolute;
		clip-path: inset(50%);
		width: 1px;
		height: 1px;
		overflow: hidden;
		white-space: nowrap;
	}

	/* Shown on screen with the `table` prop */
	.chartTableWrap[data-visible] {
		position: static;
		clip-path: none;
		width: auto;
		height: auto;
		overflow-x: auto;
	}

	.chartTable {
		border-collapse: collapse;
		width: 100%;
		font-variant-numeric: tabular-nums;
	}

	.chartTable th,
	.chartTable td {
		border-bottom: 1px solid var(--border);
		padding: var(--spacing-xs) var(--spacing-sm);
		text-align: end;
	}

	/* Category column and header row */
	.chartTable th {
		color: var(--muted-foreground);
		font-weight: 500;
	}

	.chartTable th[scope="row"],
	.chartTable thead th:first-child {
		text-align: start;
	}
</style>
