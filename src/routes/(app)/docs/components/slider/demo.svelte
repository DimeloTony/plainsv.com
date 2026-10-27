<script lang="ts">
	import { Slider, type SliderProps } from "#lib/components/ui/slider/index.js";

	const { section = "preview" }: Props = $props();
	const variants: SliderProps["variant"][] = ["default", "destructive"];
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	const roundedValues: UiRounded[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"];
	let priceRange = $state([25, 75]);
	let committedVolume = $state(50);

	/** Live preview for one section of the slider docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "range" | "commit" | "vertical" | "variants" | "sizes" | "rounded" | "disabled";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Uncontrolled slider with a starting value, used at the top of the page. -->
		<Slider defaultValue={[33]} max={100} step={1} aria-label="Volume" />
	{:else if section === "range"}
		<!-- Two thumbs bound to a range, with a step of 5. -->
		<Slider bind:value={priceRange} step={5} thumbLabels={["Minimum price", "Maximum price"]} />
		<p class="demoValue">${priceRange[0]} to ${priceRange[1]}</p>
	{:else if section === "commit"}
		<!-- Updates the label only when a drag ends or a key moves the thumb. -->
		<Slider defaultValue={[50]} aria-label="Volume" onValueCommit={(next) => (committedVolume = next[0])} />
		<p class="demoValue">Committed volume: {committedVolume}</p>
	{:else if section === "vertical"}
		<!-- Vertical sliders fill the height of their parent. -->
		<div class="demoVertical">
			<Slider orientation="vertical" defaultValue={[50]} aria-label="Bass" />
			<Slider orientation="vertical" defaultValue={[25, 75]} thumbLabels={["Low", "High"]} />
		</div>
	{:else if section === "variants"}
		<!-- One slider per visual style. -->
		{#each variants as variant (variant)}
			<Slider {variant} defaultValue={[33]} aria-label="{variant} slider" />
		{/each}
	{:else if section === "sizes"}
		<!-- One slider per size; the radius follows the size. -->
		{#each sizes as size (size)}
			<Slider {size} defaultValue={[33]} aria-label="Size {size} slider" />
		{/each}
	{:else if section === "rounded"}
		<!-- Each rounded value overriding the size radius. -->
		{#each roundedValues as rounded (rounded)}
			<Slider size="lg" {rounded} defaultValue={[33]} aria-label="Rounded {rounded} slider" />
		{/each}
	{:else if section === "disabled"}
		<!-- Dimmed and blocked from pointer and keyboard input. -->
		<Slider disabled defaultValue={[33]} aria-label="Disabled slider" />
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 1rem 0;
	}

	.demoValue {
		margin: 0;
		color: var(--muted-foreground);
		font-size: var(--text-sm);
	}

	.demoVertical {
		display: flex;
		gap: var(--spacing-xl);
		height: 10rem;
	}
</style>
