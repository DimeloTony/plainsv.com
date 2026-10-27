<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	const { visible = false }: Props = $props();
	const ctx = useCompCtx();
	const hasSessions = $derived(ctx.sessions.length > 0 || ctx.highlights.length > 0);

	/** Table of the candles on screen */
	interface Props {
		/** Shows the table on screen; screen readers get it either way */
		visible?: boolean;
	}
</script>

<!-- The candles on screen with every value, so no value depends on hovering; it follows zoom and pan. -->
<div class="candlestickChartTableWrap scroll-fade-x" data-visible={visible || undefined}>
	<table class="candlestickChartTable">
		<thead>
			<tr>
				<th scope="col">Time</th>
				{#if hasSessions}
					<th scope="col">Session</th>
				{/if}
				<th scope="col">Open</th>
				<th scope="col">High</th>
				<th scope="col">Low</th>
				<th scope="col">Close</th>
				{#if ctx.showVolume}
					<th scope="col">Volume</th>
				{/if}
				{#each ctx.visibleSeries as item (item.label)}
					<th scope="col">{item.label}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each ctx.visibleIndexes as index (index)}
				{@const candle = ctx.data[index]}
				<tr>
					<th scope="row">{ctx.formatCandleTime(index)}</th>
					{#if hasSessions}
						<td>{ctx.getSessionLabel(index) ?? "Regular"}</td>
					{/if}
					<td>{ctx.formatPriceValue(candle.open)}</td>
					<td>{ctx.formatPriceValue(candle.high)}</td>
					<td>{ctx.formatPriceValue(candle.low)}</td>
					<td>{ctx.formatPriceValue(candle.close)}</td>
					{#if ctx.showVolume}
						<td>{ctx.formatVolumeValue(candle.volume)}</td>
					{/if}
					{#each ctx.visibleSeries as item (item.label)}
						<td>{ctx.formatPriceValue(item.line[index])}</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	/* Hidden from view, but read by screen readers */
	.candlestickChartTableWrap {
		position: absolute;
		clip-path: inset(50%);
		width: 1px;
		height: 1px;
		overflow: hidden;
		white-space: nowrap;
	}

	/* Shown on screen with the `table` prop; tall tables scroll */
	.candlestickChartTableWrap[data-visible] {
		position: static;
		clip-path: none;
		width: auto;
		height: auto;
		max-height: 16rem; /* 256px */
		overflow: auto;
	}

	.candlestickChartTable {
		border-collapse: collapse;
		width: 100%;
		font-variant-numeric: tabular-nums;
	}

	.candlestickChartTable th,
	.candlestickChartTable td {
		border-bottom: 1px solid var(--border);
		padding: var(--spacing-xs) var(--spacing-sm);
		text-align: end;
	}

	/* Time column and header row */
	.candlestickChartTable th {
		color: var(--muted-foreground);
		font-weight: 500;
	}

	.candlestickChartTable th[scope="row"],
	.candlestickChartTable thead th:first-child {
		text-align: start;
	}
</style>
