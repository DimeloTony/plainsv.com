<script lang="ts">
	import { Chart, type ChartConfig } from "#lib/components/ui/chart/index.js";

	const { section = "preview" }: Props = $props();
	const data = [
		{ month: "January", desktop: 186, mobile: 80 },
		{ month: "February", desktop: 305, mobile: 200 },
		{ month: "March", desktop: 237, mobile: 120 },
		{ month: "April", desktop: 73, mobile: 190 },
		{ month: "May", desktop: 209, mobile: 130 },
		{ month: "June", desktop: 214, mobile: 140 },
	];
	const config: ChartConfig<(typeof data)[number]> = { desktop: { label: "Desktop" }, mobile: { label: "Mobile" } };
	const browsers = [
		{ browser: "Chrome", visitors: 275 },
		{ browser: "Safari", visitors: 200 },
		{ browser: "Firefox", visitors: 187 },
		{ browser: "Edge", visitors: 173 },
		{ browser: "Other", visitors: 90 },
	];
	const skills = [
		{ skill: "Speed", alice: 86, bob: 64 },
		{ skill: "Power", alice: 72, bob: 90 },
		{ skill: "Range", alice: 58, bob: 80 },
		{ skill: "Defense", alice: 80, bob: 55 },
		{ skill: "Stamina", alice: 92, bob: 70 },
	];
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	const roundeds: UiRounded[] = ["xs", "md", "pill"];
	const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
	let hiddenSeries: string[] = $state([]);

	/** Live preview for one section of the chart docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "stacked" | "horizontal" | "line" | "area" | "gradient" | "colors" | "format" | "tooltip" | "legend" | "table" | "sizes" | "rounded" | "pie" | "donut" | "radar" | "radial";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Grouped bars used at the top of the page. -->
		<Chart {data} index="month" {config} formatIndex={(month) => String(month).slice(0, 3)} label="Visitors per month" class="demoChart" />
	{:else if section === "stacked"}
		<!-- Stacked bars. -->
		<Chart {data} index="month" {config} stacked formatIndex={(month) => String(month).slice(0, 3)} class="demoChart" />
	{:else if section === "horizontal"}
		<!-- One series of horizontal bars; a single series needs no legend. -->
		<Chart data={browsers} index="browser" config={{ visitors: { label: "Visitors" } }} orientation="horizontal" class="demoChart" />
	{:else if section === "line"}
		<!-- Lines, straight and curved. -->
		<Chart {data} index="month" {config} type="line" dots formatIndex={(month) => String(month).slice(0, 3)} class="demoHalf" />
		<Chart {data} index="month" {config} type="line" curve="monotone" formatIndex={(month) => String(month).slice(0, 3)} class="demoHalf" />
	{:else if section === "area"}
		<!-- Overlapping and stacked areas. -->
		<Chart {data} index="month" {config} type="area" curve="monotone" formatIndex={(month) => String(month).slice(0, 3)} class="demoHalf" />
		<Chart {data} index="month" {config} type="area" curve="monotone" stacked formatIndex={(month) => String(month).slice(0, 3)} class="demoHalf" />
	{:else if section === "gradient"}
		<!-- Overlapping and stacked areas that fade toward the axis. -->
		<Chart {data} index="month" {config} type="area" curve="monotone" gradient formatIndex={(month) => String(month).slice(0, 3)} class="demoHalf" />
		<Chart {data} index="month" {config} type="area" curve="monotone" stacked gradient formatIndex={(month) => String(month).slice(0, 3)} class="demoHalf" />
	{:else if section === "colors"}
		<!-- Custom series colors from the theme. -->
		<Chart {data} index="month" config={{ desktop: { label: "Desktop", color: "var(--chart-3)" }, mobile: { label: "Mobile", color: "var(--chart-5)" } }} formatIndex={(month) => String(month).slice(0, 3)} class="demoChart" />
	{:else if section === "format"}
		<!-- Currency values. -->
		<Chart {data} index="month" config={{ desktop: { label: "Revenue" } }} type="area" formatValue={(value) => currency.format(value * 10)} formatIndex={(month) => String(month).slice(0, 3)} class="demoChart" />
	{:else if section === "tooltip"}
		<!-- Custom tooltip with a total. -->
		<Chart {data} index="month" {config} stacked formatIndex={(month) => String(month).slice(0, 3)} class="demoChart">
			{#snippet tooltip({ label, items })}
				<strong>{label}</strong>
				<span>Total: {items.reduce((sum, item) => sum + (Number.isNaN(item.value) ? 0 : item.value), 0)}</span>
			{/snippet}
		</Chart>
	{:else if section === "legend"}
		<!-- Legend bound to state. -->
		<div class="demoColumn">
			<Chart {data} index="month" {config} type="line" bind:hiddenSeries formatIndex={(month) => String(month).slice(0, 3)} class="demoChart" />
			<p>Hidden: <code>{hiddenSeries.join(", ") || "none"}</code></p>
		</div>
	{:else if section === "table"}
		<!-- Chart with its data table shown. -->
		<Chart {data} index="month" {config} table formatIndex={(month) => String(month).slice(0, 3)} class="demoChart" />
	{:else if section === "sizes"}
		<!-- One chart per size. -->
		{#each sizes as size (size)}
			<Chart data={browsers.slice(0, 4)} index="browser" config={{ visitors: { label: "Visitors" } }} {size} class="demoHalf" />
		{/each}
	{:else if section === "rounded"}
		<!-- One chart per bar radius. -->
		{#each roundeds as rounded (rounded)}
			<Chart data={browsers.slice(0, 4)} index="browser" config={{ visitors: { label: "Visitors" } }} {rounded} size="sm" class="demoThird" />
		{/each}
	{:else if section === "pie"}
		<!-- One slice per browser. -->
		<Chart data={browsers} index="browser" config={{ visitors: { label: "Visitors" } }} type="pie" class="demoHalf" />
	{:else if section === "donut"}
		<!-- Donut with the total in its hole. -->
		<Chart data={browsers} index="browser" config={{ visitors: { label: "Visitors" } }} type="donut" class="demoHalf">
			{#snippet center({ formattedTotal })}
				<strong class="demoTotal">{formattedTotal}</strong>
				<span class="demoTotalLabel">Visitors</span>
			{/snippet}
		</Chart>
	{:else if section === "radar"}
		<!-- One shape per player. -->
		<Chart data={skills} index="skill" config={{ alice: { label: "Alice" }, bob: { label: "Bob" } }} type="radar" class="demoHalf" />
		<Chart data={skills} index="skill" config={{ alice: { label: "Alice" } }} type="radar" dots class="demoHalf" />
	{:else if section === "radial"}
		<!-- One ring per browser. -->
		<Chart data={browsers} index="browser" config={{ visitors: { label: "Visitors" } }} type="radial" class="demoHalf" />
		<Chart data={browsers.slice(0, 3)} index="browser" config={{ visitors: { label: "Visitors" } }} type="radial" rounded="pill" categories={{ Chrome: { label: "Google Chrome", color: "var(--chart-3)" } }} class="demoHalf" />
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: var(--spacing-xl);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 1rem 0;
	}

	.demoColumn {
		display: flex;
		flex: 1 1 100%;
		flex-direction: column;
		gap: var(--spacing-sm);
		font-size: var(--text-sm);
	}

	.demo :global(.demoChart) {
		flex: 1 1 100%;
	}

	.demo :global(.demoHalf) {
		flex: 1 1 18rem; /* 288px */
	}

	.demoTotal {
		font-size: var(--text-md);
		line-height: var(--line-height-md);
	}

	.demoTotalLabel {
		color: var(--muted-foreground);
	}

	.demo :global(.demoThird) {
		flex: 1 1 12rem; /* 192px */
	}
</style>
