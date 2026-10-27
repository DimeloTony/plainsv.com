<script lang="ts">
	import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardFooter } from "#lib/components/ui/card/index.js";
	import { Badge } from "#lib/components/ui/badge/index.js";
	import { TrendingUpIcon, TrendingDownIcon } from "@lucide/svelte";
	// Sample stats with their change and a short note.
	const stats = [
		{ label: "Total Revenue", value: "$1,250.00", change: "+12.5%", isUp: true, summary: "Trending up this month", note: "Visitors for the last 6 months" },
		{ label: "New Customers", value: "1,234", change: "-20%", isUp: false, summary: "Down 20% this period", note: "Acquisition needs attention" },
		{ label: "Active Accounts", value: "45,678", change: "+12.5%", isUp: true, summary: "Strong user retention", note: "Engagement exceed targets" },
		{ label: "Growth Rate", value: "4.5%", change: "+4.5%", isUp: true, summary: "Steady performance increase", note: "Meets growth projections" },
	];
</script>

<!-- One card per stat; one, two, or four per row as the content widens. -->
<div class="sectionCards">
	{#each stats as stat (stat.label)}
		{@const TrendIcon = stat.isUp ? TrendingUpIcon : TrendingDownIcon}
		<Card>
			<CardHeader>
				<CardDescription>{stat.label}</CardDescription>
				<CardTitle class="statValue">{stat.value}</CardTitle>
				<CardAction>
					<Badge variant="outline"><TrendIcon />{stat.change}</Badge>
				</CardAction>
			</CardHeader>
			<CardFooter class="statFooter">
				<span class="statSummary">{stat.summary} <TrendIcon /></span>
				<span class="statNote">{stat.note}</span>
			</CardFooter>
		</Card>
	{/each}
</div>

<style>
	.sectionCards {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-lg);
		padding-inline: var(--spacing-lg);
	}

	/* Each card is a container, so its value grows on wider cards; a faint primary tint fades up from the bottom */
	.sectionCards > :global(.card) {
		flex: 1 1 100%;
		container-type: inline-size;
		box-shadow: 0 1px 2px 0 color-mix(in oklab, var(--foreground) 5%, transparent);
		background: linear-gradient(to top, color-mix(in oklab, var(--primary) 5%, var(--card)), var(--card));
	}

	.sectionCards :global(.statValue) {
		font-weight: 600;
		font-size: 1.5rem; /* 24px */
		line-height: 2rem; /* 32px */
		font-variant-numeric: tabular-nums;
	}

	.sectionCards :global(.cardFooter.statFooter) {
		flex-direction: column;
		align-items: flex-start;
		gap: calc(var(--spacing-xs) * 1.5);
		font-size: var(--text-sm);
	}

	.statSummary {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		overflow: hidden;
		font-weight: 500;
		white-space: nowrap;
	}

	.statSummary :global(svg) {
		width: 1rem; /* 16px */
		height: 1rem; /* 16px */
	}

	.statNote {
		color: var(--muted-foreground);
	}

	@media (min-width: 64rem) {
		.sectionCards {
			padding-inline: var(--spacing-xl);
		}
	}

	/* Bigger value once the card is at least 250px wide */
	@container (min-width: 15.625rem) {
		.sectionCards :global(.statValue) {
			font-size: 1.875rem; /* 30px */
			line-height: 2.25rem; /* 36px */
		}
	}

	/* Two cards per row on medium content widths */
	@container dashboardMain (min-width: 36rem) {
		.sectionCards > :global(.card) {
			flex-basis: calc(50% - var(--spacing-lg));
		}
	}

	/* Four cards per row on wide content */
	@container dashboardMain (min-width: 64rem) {
		.sectionCards > :global(.card) {
			flex-basis: calc(25% - var(--spacing-lg));
		}
	}
</style>
