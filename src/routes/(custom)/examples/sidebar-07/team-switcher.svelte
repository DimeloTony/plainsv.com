<script lang="ts">
	import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "#lib/components/ui/sidebar/index.js";
	import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut } from "#lib/components/ui/dropdown-menu/index.js";
	import { ChevronsUpDownIcon, PlusIcon } from "@lucide/svelte";
	const { teams }: Props = $props();
	const sidebar = useSidebar();
	let activeTeam = $state(teams[0]);
	/** Teams the user can switch between */
	interface Props {
		/** Teams with their logo and plan */
		teams: { name: string; logo: Component; plan: string }[];
	}
</script>

<SidebarMenu>
	<SidebarMenuItem>
		<DropdownMenu align="start" side={sidebar.isMobile ? "bottom" : "right"} sideOffset={4}>
			<!-- Active team with its logo and plan. -->
			<DropdownMenuTrigger>
				{#snippet trigger({ props })}
					<SidebarMenuButton size="lg" class="teamButton" {...props}>
						<span class="teamLogo"><activeTeam.logo /></span>
						<span class="twoLines">
							<strong>{activeTeam.name}</strong>
							<span>{activeTeam.plan}</span>
						</span>
						<ChevronsUpDownIcon class="teamChevron" />
					</SidebarMenuButton>
				{/snippet}
			</DropdownMenuTrigger>

			<!-- Teams, then an add action. -->
			<DropdownMenuContent style="min-width: 14rem">
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
						<span class="teamItemLogo"><PlusIcon /></span>
						<span class="addTeam">Add team</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	</SidebarMenuItem>
</SidebarMenu>

<style>
	/* Square team logo */
	.teamLogo {
		display: flex;
		flex-shrink: 0;
		justify-content: center;
		align-items: center;
		border-radius: var(--radius-lg);
		background-color: var(--sidebar-primary);
		width: var(--control-height-sm);
		height: var(--control-height-sm);
		color: var(--sidebar-primary-foreground);
	}

	.teamLogo :global(svg) {
		width: 1rem; /* 16px */
		height: 1rem; /* 16px */
	}

	/* Name above the plan, both truncated */
	.twoLines {
		display: flex;
		flex: 1;
		flex-direction: column;
		min-width: 0;
		line-height: 1.25;
		text-align: left;
	}

	.twoLines strong,
	.twoLines span {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.twoLines strong {
		font-weight: 500;
	}

	.twoLines span {
		font-size: var(--text-xs);
	}

	:global(.sidebar .sidebarMenuButton.teamButton .teamChevron) {
		margin-left: auto;
	}

	/* The button stays highlighted while its menu is open */
	:global(.sidebar .sidebarMenuButton.teamButton[aria-expanded="true"]) {
		background-color: var(--sidebar-accent);
		color: var(--sidebar-accent-foreground);
	}

	/* Bordered logo box in the menu */
	.teamItemLogo {
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		width: var(--control-height-xs);
		height: var(--control-height-xs);
	}

	.addTeam {
		color: var(--muted-foreground);
		font-weight: 500;
	}
</style>
