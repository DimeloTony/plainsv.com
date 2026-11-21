<script lang="ts">
	import { CandlestickChart, CandlestickChartLegend, CandlestickChartTooltip, type CandlestickChartProps } from "#lib/components/ui/candlestick-chart/index.js";
	import { ToggleGroup, ToggleGroupItem } from "#lib/components/ui/toggle-group/index.js";
	import { daily } from "../data.js";

	const VARIANTS = ["solid", "hollow", "ohlc", "line", "area"] as const;
	let variant: Variant = $state("solid");

	/** Whether a toggle value is a chart variant. */
	function isVariant(value: string): value is Variant {
		return VARIANTS.some((item) => item === value);
	}

	/** Chart price style */
	type Variant = NonNullable<CandlestickChartProps["variant"]>;
</script>

<!-- Every price style on the same data. -->
<div class="demoColumn">
	<ToggleGroup type="single" value={variant} onValueChange={(next) => isVariant(next) && (variant = next)} size="sm" variant="outline" aria-label="Price style">
		{#each VARIANTS as item (item)}
			<ToggleGroupItem value={item}>{item}</ToggleGroupItem>
		{/each}
	</ToggleGroup>
	<CandlestickChart data={daily} {variant} size="sm" class="demoChart">
		<CandlestickChartLegend />
		<CandlestickChartTooltip />
	</CandlestickChart>
</div>
