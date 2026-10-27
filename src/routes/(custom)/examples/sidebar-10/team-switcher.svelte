<script lang="ts">
	import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "#lib/components/ui/sidebar/index.js";
	import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut } from "#lib/components/ui/dropdown-menu/index.js";
	import { ChevronDownIcon, PlusIcon } from "@lucide/svelte";
	const { teams }: Props = $props();
	let activeTeam = $state(teams[0]);
	/** Compact switcher between teams */
	interface Props {
		/** Teams with their logo and plan */
		teams: { name: string; logo: Component; plan: string }[];
	}
</script>

<SidebarMenu>
	<SidebarMenuItem>
		<DropdownMenu align="start" side="bottom" sideOffset={4}>
			<!-- Active team as a small logo and name. -->
			<DropdownMenuTrigger>
				{#snippet trigger({ props })}
					<SidebarMenuButton class="teamButton" {...props}>
						<span class="teamLogo"><activeTeam.logo /></span>
						<span class="teamName">{activeTeam.name}</span>
						<ChevronDownIcon class="teamChevron" />
					</SidebarMenuButton>
				{/snippet}
			</DropdownMenuTrigger>

			<!-- Teams, then an add action. -->
			<DropdownMenuContent rounded="lg" style="min-width: 16rem">
				<DropdownMenuGroup>
					<DropdownMenuLabel>Teams</DropdownMenuLabel>
					{#each teams as team, index (team.name)}
						<DropdownMenuItem onSelect={() => (activeTeam = team)}>
							<span class="teamItemLogo"><team.logo /></span>
							{team.name}
							<DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
						</DropdownMenuItem>
					{/each}
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<span class="teamItemLogo addTeamLogo"><PlusIcon /></span>
						<span class="addTeam">Add team</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	</SidebarMenuItem>
</SidebarMenu>

<style>
	/* Button only as wide as its content */
	:global(.sidebar .sidebarMenuButton.teamButton) {
		padding-inline: calc(var(--spacing-xs) * 1.5);
		width: fit-content;
	}

	/* Small square team logo */
	.teamLogo {
		display: flex;
		flex-shrink: 0;
		justify-content: center;
		align-items: center;
		border-radius: var(--radius-md);
		background-color: var(--sidebar-primary);
		width: 1.25rem; /* 20px */
		height: 1.25rem; /* 20px */
		color: var(--sidebar-primary-foreground);
	}

	.teamLogo :global(svg) {
		width: 0.75rem; /* 12px */
		height: 0.75rem; /* 12px */
	}

	.teamName {
		overflow: hidden;
		font-weight: 500;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	:global(.sidebar .sidebarMenuButton.teamButton .teamChevron) {
		opacity: 50%;
	}

	/* Bordered logo box in the menu */
	.teamItemLogo {
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1px solid var(--border);
		border-radius: var(--radius-xs);
		width: var(--control-height-xs);
		height: var(--control-height-xs);
	}

	.addTeamLogo {
		border-radius: var(--radius-md);
		background-color: var(--background);
	}

	.addTeam {
		color: var(--muted-foreground);
		font-weight: 500;
	}
</style>
