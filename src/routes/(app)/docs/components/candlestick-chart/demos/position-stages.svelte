<script lang="ts">
	import { CandlestickChart, CandlestickChartLegend, CandlestickChartTooltip, getDraftPosition, type CandlestickChartPosition } from "#lib/components/ui/candlestick-chart/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { daily } from "../data.js";

	// Trades set up from the Long and Short buttons, and the timers that fake each order's fill.
	const FILL_DELAY_MS = 1500;
	let stagedPositions: CandlestickChartPosition[] = $state([]);
	let stageStatus = $state("Press Long or Short to set up a trade");
	const fillTimers = new Set<ReturnType<typeof setTimeout>>();

	// Stop faking fills when the demo goes away.
	$effect(() => () => fillTimers.forEach((timer) => clearTimeout(timer)));

	/** Adds a draft trade at the latest close to adjust on the chart. */
	function startPosition(side: CandlestickChartPosition["side"]) {
		const draft = getDraftPosition(daily, { id: `trade-${stagedPositions.length + 1}`, side });
		// If there are no candles: there is no price to start from.
		if (!draft) return;
		stagedPositions = [...stagedPositions, draft];
		stageStatus = `Drafting a ${side}: drag the lines, then press ✓`;
	}

	/** Marks the trade pending, then opens it after a fake fill, like a broker would. */
	function confirmPosition(position: CandlestickChartPosition) {
		setStage(position.id, "pending");
		stageStatus = `Waiting for ${position.id} to fill…`;
		const timer = setTimeout(() => {
			fillTimers.delete(timer);
			setStage(position.id, "open");
			stageStatus = `${position.id} filled`;
		}, FILL_DELAY_MS);
		fillTimers.add(timer);
	}

	/** Drops a discarded draft, or a cancelled pending or open trade. */
	function discardPosition(position: CandlestickChartPosition) {
		stagedPositions = stagedPositions.filter((item) => item.id !== position.id);
		stageStatus = `${position.id} removed`;
	}

	/** Moves one staged trade to a new stage. */
	function setStage(id: string, stage: NonNullable<CandlestickChartPosition["stage"]>) {
		stagedPositions = stagedPositions.map((item) => (item.id === id ? { ...item, stage } : item));
	}
</script>

<!-- Set up a trade from the buttons, adjust its lines, confirm it with ✓, and watch it wait and then fill. -->
<div class="demoColumn">
	<div class="demoLiveHeader">
		<Button size="sm" variant="outline" onclick={() => startPosition("long")}>Long</Button>
		<Button size="sm" variant="outline" onclick={() => startPosition("short")}>Short</Button>
		<span class="demoLiveChange">{stageStatus}</span>
	</div>
	<CandlestickChart data={daily} bind:positions={stagedPositions} onPositionConfirm={confirmPosition} onPositionCancel={discardPosition} range={[daily.length - 70, daily.length + 20]} volume={false} class="demoChart">
		<CandlestickChartLegend />
		<CandlestickChartTooltip />
	</CandlestickChart>
</div>

<style>
	/* Long and Short buttons with the trade status in one row */
	.demoLiveHeader {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
	}

	.demoLiveChange {
		flex: 1;
		color: var(--muted-foreground);
	}
</style>
