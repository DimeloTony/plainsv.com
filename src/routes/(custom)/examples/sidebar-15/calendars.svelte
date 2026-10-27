<script lang="ts">
	import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from "#lib/components/ui/sidebar/index.js";
	import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "#lib/components/ui/collapsible/index.js";
	import { ChevronRightIcon, CheckIcon } from "@lucide/svelte";
	const { calendars }: Props = $props();
	/** Calendar lists whose label opens and closes them */
	interface Props {
		/** Lists with the calendars in each */
		calendars: { name: string; items: string[] }[];
	}
</script>

{#each calendars as calendar, index (calendar.name)}
	<SidebarGroup>
		<Collapsible defaultOpen={index === 0}>
			<!-- The label is the toggle. -->
			<CollapsibleTrigger>
				{#snippet trigger({ props })}
					<SidebarGroupLabel class="calendarsToggle" {...props}>
						{calendar.name}
						<ChevronRightIcon class="calendarsChevron" />
					</SidebarGroupLabel>
				{/snippet}
			</CollapsibleTrigger>
			<CollapsibleContent>
				<SidebarGroupContent>
					<SidebarMenu>
						{#each calendar.items as item, itemIndex (item)}
							<!-- The first two calendars of each list are shown. -->
							<SidebarMenuItem>
								<SidebarMenuButton>
									<span class="calendarCheck" data-active={itemIndex < 2 || undefined}><CheckIcon /></span>
									<span>{item}</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						{/each}
					</SidebarMenu>
				</SidebarGroupContent>
			</CollapsibleContent>
		</Collapsible>
	</SidebarGroup>
	<SidebarSeparator style="margin-inline: 0" />
{/each}

<style>
	/* The toggle uses the full text size and color */
	:global(.sidebar .sidebarGroupLabel.calendarsToggle) {
		color: var(--sidebar-foreground);
		font-size: var(--text-sm);
	}

	/* Chevron at the end that points down while the list is open */
	:global(.sidebar .sidebarGroupLabel.calendarsToggle .calendarsChevron) {
		transition: transform 200ms ease;
		margin-left: auto;
	}

	:global(.sidebar .sidebarGroupLabel.calendarsToggle[data-state="open"] .calendarsChevron) {
		transform: rotate(90deg);
	}

	/* Check box that fills with the primary color while the calendar is shown */
	.calendarCheck {
		display: flex;
		flex-shrink: 0;
		justify-content: center;
		align-items: center;
		border: 1px solid var(--sidebar-border);
		border-radius: var(--radius-xs);
		width: 1rem; /* 16px */
		height: 1rem; /* 16px */
		color: var(--sidebar-primary-foreground);
	}

	.calendarCheck :global(svg) {
		display: none;
		width: 0.75rem; /* 12px */
		height: 0.75rem; /* 12px */
	}

	.calendarCheck[data-active] {
		border-color: var(--sidebar-primary);
		background-color: var(--sidebar-primary);
	}

	.calendarCheck[data-active] :global(svg) {
		display: block;
	}
</style>
