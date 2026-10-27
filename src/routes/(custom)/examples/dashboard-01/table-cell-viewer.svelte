<script lang="ts">
	import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "#lib/components/ui/drawer/index.js";
	import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "#lib/components/ui/select/index.js";
	import { Chart, type ChartConfig } from "#lib/components/ui/chart/index.js";
	import { Separator } from "#lib/components/ui/separator/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { Input } from "#lib/components/ui/input/index.js";
	import { Label } from "#lib/components/ui/label/index.js";
	import { useSidebar } from "#lib/components/ui/sidebar/index.js";
	import { TrendingUpIcon } from "@lucide/svelte";
	import { monthlyVisitorData } from "./chart-data.js";
	import type { Section } from "./types.js";
	const { item }: Props = $props();
	// Unique ids, since every row renders its own drawer.
	const uid = $props.id();
	const chartConfig: ChartConfig<(typeof monthlyVisitorData)[number]> = {
		desktop: { label: "Desktop", color: "var(--primary)" },
		mobile: { label: "Mobile", color: "var(--primary)" },
	};
	const typeOptions = ["Table of Contents", "Executive Summary", "Technical Approach", "Design", "Capabilities", "Focus Documents", "Narrative", "Cover Page"];
	const statusOptions = ["Done", "In Progress", "Not Started"];
	const reviewerOptions = ["Eddie Lake", "Jamik Tashpulatov", "Emily Whalen"];
	const sidebar = useSidebar();

	/** Keeps the demo form on the page. */
	const handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();
	};

	/** Section opened from its row */
	interface Props {
		/** Section shown and edited in the drawer */
		item: Section;
	}
</script>

<!-- The section title opens a drawer from the right, or from the bottom on mobile. -->
<Drawer direction={sidebar.isMobile ? "bottom" : "right"}>
	<DrawerTrigger>
		{#snippet trigger({ props })}
			<Button variant="link" style="padding-inline: 0; width: fit-content; color: var(--foreground); text-align: left" {...props}>{item.header}</Button>
		{/snippet}
	</DrawerTrigger>
	<DrawerContent>
		<DrawerHeader style="gap: var(--spacing-xs)">
			<DrawerTitle>{item.header}</DrawerTitle>
			<DrawerDescription>Showing total visitors for the last 6 months</DrawerDescription>
		</DrawerHeader>

		<div class="drawerBody scroll-fade-y">
			<!-- Visitors chart and a summary, on desktop only. -->
			{#if !sidebar.isMobile}
				<Chart data={monthlyVisitorData} index="month" config={chartConfig} type="area" curve="monotone" stacked legend={false} formatIndex={(month) => String(month).slice(0, 3)} label="Visitors per month" />
				<Separator />
				<div class="drawerSummary">
					<strong>Trending up by 5.2% this month <TrendingUpIcon /></strong>
					<p>Showing total visitors for the last 6 months. This is just some random text to test the layout. It spans multiple lines and should wrap around.</p>
				</div>
				<Separator />
			{/if}

			<!-- Editable section details. -->
			<form class="drawerForm" onsubmit={handleSubmit}>
				<div class="drawerField">
					<Label for="{uid}-header">Header</Label>
					<Input id="{uid}-header" value={item.header} />
				</div>
				<div class="drawerRow">
					<div class="drawerField">
						<Label for="{uid}-type">Type</Label>
						<Select defaultValue={item.type}>
							<SelectTrigger id="{uid}-type" style="width: 100%">
								<SelectValue placeholder="Select a type" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{#each typeOptions as option (option)}
										<SelectItem value={option}>{option}</SelectItem>
									{/each}
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
					<div class="drawerField">
						<Label for="{uid}-status">Status</Label>
						<Select defaultValue={item.status}>
							<SelectTrigger id="{uid}-status" style="width: 100%">
								<SelectValue placeholder="Select a status" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{#each statusOptions as option (option)}
										<SelectItem value={option}>{option}</SelectItem>
									{/each}
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
				</div>
				<div class="drawerRow">
					<div class="drawerField">
						<Label for="{uid}-target">Target</Label>
						<Input id="{uid}-target" value={item.target} />
					</div>
					<div class="drawerField">
						<Label for="{uid}-limit">Limit</Label>
						<Input id="{uid}-limit" value={item.limit} />
					</div>
				</div>
				<div class="drawerField">
					<Label for="{uid}-reviewer">Reviewer</Label>
					<Select defaultValue={item.reviewer}>
						<SelectTrigger id="{uid}-reviewer" style="width: 100%">
							<SelectValue placeholder="Select a reviewer" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								{#each reviewerOptions as option (option)}
									<SelectItem value={option}>{option}</SelectItem>
								{/each}
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
			</form>
		</div>

		<DrawerFooter>
			<Button>Submit</Button>
			<DrawerClose variant="outline">Done</DrawerClose>
		</DrawerFooter>
	</DrawerContent>
</Drawer>

<style>
	.drawerBody {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
		padding-inline: var(--spacing-lg);
		overflow-y: auto;
		font-size: var(--text-sm);
	}

	.drawerSummary {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.drawerSummary strong {
		display: flex;
		gap: var(--spacing-sm);
		font-weight: 500;
		line-height: 1;
	}

	.drawerSummary :global(svg) {
		width: 1rem; /* 16px */
		height: 1rem; /* 16px */
	}

	.drawerSummary p {
		margin: 0;
		color: var(--muted-foreground);
	}

	.drawerForm {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
	}

	/* Two fields side by side */
	.drawerRow {
		display: flex;
		gap: var(--spacing-lg);
	}

	.drawerRow > .drawerField {
		flex: 1;
		min-width: 0;
	}

	.drawerField {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}
</style>
