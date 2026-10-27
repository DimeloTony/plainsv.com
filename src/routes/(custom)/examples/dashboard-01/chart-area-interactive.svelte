<script lang="ts">
	import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent } from "#lib/components/ui/card/index.js";
	import { Chart, type ChartConfig } from "#lib/components/ui/chart/index.js";
	import { ToggleGroup, ToggleGroupItem } from "#lib/components/ui/toggle-group/index.js";
	import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "#lib/components/ui/select/index.js";
	import { useSidebar } from "#lib/components/ui/sidebar/index.js";
	import { visitorData } from "./chart-data.js";
	// Both series share the primary color and stack into one total.
	const chartConfig: ChartConfig<(typeof visitorData)[number]> = {
		desktop: { label: "Desktop", color: "var(--primary)" },
		mobile: { label: "Mobile", color: "var(--primary)" },
	};
	// The sample data ends on this day, so the ranges count back from it.
	const REFERENCE_DATE = new Date("2024-06-30T00:00:00");
	const RANGE_DAYS: Record<string, number> = { "90d": 90, "30d": 30, "7d": 7 };
	const sidebar = useSidebar();
	let timeRange = $state("90d");
	const filteredData = $derived.by(() => {
		const startDate = new Date(REFERENCE_DATE);
		startDate.setDate(startDate.getDate() - (RANGE_DAYS[timeRange] ?? 90));
		return visitorData.filter((item) => parseDay(item.date) >= startDate);
	});

	// Small screens start on the shortest range, so the chart stays readable.
	$effect(() => {
		if (sidebar.isMobile) timeRange = "7d";
	});

	/** Reads a `YYYY-MM-DD` string as local midnight, so the label never shifts a day. */
	function parseDay(value: string) {
		return new Date(`${value}T00:00:00`);
	}

	/** Formats a day as a short month and day, such as "Apr 1". */
	function formatDay(value: unknown) {
		return parseDay(String(value)).toLocaleDateString("en-US", { month: "short", day: "numeric" });
	}
</script>

<!-- The card is a container, so its controls switch with its own width. -->
<div class="visitorsChart">
	<Card>
		<CardHeader>
			<CardTitle>Total Visitors</CardTitle>
			<CardDescription>
				<span class="longText">Total for the last 3 months</span>
				<span class="shortText">Last 3 months</span>
			</CardDescription>

			<!-- Range picker: toggle buttons on wide cards, a select on narrow ones. -->
			<CardAction>
				<ToggleGroup variant="outline" class="rangeToggle" value={timeRange} onValueChange={(value) => (timeRange = value || "90d")}>
					<ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
					<ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
					<ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
				</ToggleGroup>
				<Select value={timeRange} onValueChange={(value) => (timeRange = value)} size="sm">
					<SelectTrigger class="rangeSelect" aria-label="Select a range">
						<SelectValue placeholder="Last 3 months" />
					</SelectTrigger>
					<SelectContent rounded="xl">
						<SelectItem value="90d" rounded="lg">Last 3 months</SelectItem>
						<SelectItem value="30d" rounded="lg">Last 30 days</SelectItem>
						<SelectItem value="7d" rounded="lg">Last 7 days</SelectItem>
					</SelectContent>
				</Select>
			</CardAction>
		</CardHeader>

		<!-- Stacked desktop and mobile visitors per day. -->
		<CardContent>
			<Chart data={filteredData} index="date" config={chartConfig} type="area" curve="monotone" stacked gradient legend={false} formatIndex={formatDay} label="Total visitors per day" style="--chart-height: 15.625rem" />
		</CardContent>
	</Card>
</div>

<style>
	.visitorsChart {
		container: visitorsChart / inline-size;
	}

	.longText,
	.visitorsChart :global(.rangeToggle) {
		display: none;
	}

	.visitorsChart :global(.rangeSelect) {
		width: 10rem; /* 160px */
	}

	/* Full description once the card is 540px wide */
	@container visitorsChart (min-width: 33.75rem) {
		.longText {
			display: inline;
		}

		.shortText {
			display: none;
		}
	}

	/* Toggle buttons replace the select once the card is 767px wide */
	@container visitorsChart (min-width: 47.9375rem) {
		.visitorsChart :global(.rangeToggle) {
			display: flex;
		}

		.visitorsChart :global(.rangeSelect) {
			display: none;
		}
	}
</style>
