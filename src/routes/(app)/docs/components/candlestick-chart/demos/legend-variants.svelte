<script lang="ts">
	import { CandlestickChart, CandlestickChartInfo, CandlestickChartLegend, CandlestickChartTooltip, type CandlestickChartLegendProps } from "#lib/components/ui/candlestick-chart/index.js";
	import { ToggleGroup, ToggleGroupItem } from "#lib/components/ui/toggle-group/index.js";
	import { daily } from "../data.js";

	const LEGEND_VARIANTS = ["default", "secondary", "outline", "ghost", "card"] as const;
	let legendVariant: LegendVariant = $state("outline");

	/** Whether a toggle value is a part variant, which the info, legend, and tooltip all take. */
	function isLegendVariant(value: string): value is LegendVariant {
		return LEGEND_VARIANTS.some((item) => item === value);
	}

	/** Look shared by the info, legend, and tooltip */
	type LegendVariant = NonNullable<CandlestickChartLegendProps["variant"]>;
</script>

<!-- Every variant on the info, legend, and tooltip of the same chart; hover a candle to see the tooltip. -->
<div class="demoColumn">
	<ToggleGroup type="single" value={legendVariant} onValueChange={(next) => isLegendVariant(next) && (legendVariant = next)} size="sm" variant="outline" aria-label="Part variant">
		{#each LEGEND_VARIANTS as item (item)}
			<ToggleGroupItem value={item}>{item}</ToggleGroupItem>
		{/each}
	</ToggleGroup>
	<CandlestickChart
		data={daily}
		indicators={[
			{ type: "ema", period: 9 },
			{ type: "ema", period: 21 },
			{ type: "sma", period: 50 },
		]}
		volume={false}
		size="sm"
		class="demoChart"
	>
		<CandlestickChartInfo variant={legendVariant} />
		<CandlestickChartLegend variant={legendVariant} position="overlayBottom" rounded="lg" />
		<CandlestickChartTooltip variant={legendVariant} />
	</CandlestickChart>
</div>
