<script lang="ts">
	import { Badge, type BadgeProps } from "#lib/components/ui/badge/index.js";
	import { BadgeCheckIcon, ArrowUpRightIcon } from "@lucide/svelte";

	const { section = "preview" }: Props = $props();
	const variants: BadgeProps["variant"][] = ["default", "secondary", "destructive", "outline", "ghost", "link"];
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	const roundedValues: UiRounded[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"];

	/** Live preview for one section of the badge docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "variants" | "icons" | "count" | "link" | "sizes" | "rounded";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Default badge used at the top of the page. -->
		<Badge>Badge</Badge>
	{:else if section === "variants"}
		<!-- One badge per variant. -->
		{#each variants as variant (variant)}
			<Badge {variant}>{variant}</Badge>
		{/each}
	{:else if section === "icons"}
		<!-- Icons before the label scale with the size. -->
		<Badge variant="secondary"><BadgeCheckIcon />Verified</Badge>
		<Badge variant="outline">Beta</Badge>
	{:else if section === "count"}
		<!-- Pill counters with tabular digits. -->
		<Badge rounded="pill" style="font-variant-numeric: tabular-nums">8</Badge>
		<Badge rounded="pill" variant="destructive" style="font-variant-numeric: tabular-nums">99</Badge>
		<Badge rounded="pill" variant="outline" style="font-variant-numeric: tabular-nums">20+</Badge>
	{:else if section === "link"}
		<!-- Link badges get hover styles. -->
		<Badge href="/docs/components">Components<ArrowUpRightIcon /></Badge>
		<Badge href="/docs/components" variant="outline">Components<ArrowUpRightIcon /></Badge>
	{:else if section === "sizes"}
		<!-- One badge per size; the radius follows the size. -->
		{#each sizes as size (size)}
			<Badge {size}>Size {size}</Badge>
		{/each}
	{:else if section === "rounded"}
		<!-- Each rounded value overriding the size radius. -->
		{#each roundedValues as rounded (rounded)}
			<Badge {rounded}>Rounded {rounded}</Badge>
		{/each}
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--spacing-sm);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 1rem 0;
	}
</style>
