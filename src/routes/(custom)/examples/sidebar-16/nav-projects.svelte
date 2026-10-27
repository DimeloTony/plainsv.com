<script lang="ts">
	import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, useSidebar } from "#lib/components/ui/sidebar/index.js";
	import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "#lib/components/ui/dropdown-menu/index.js";
	import { EllipsisIcon, FolderIcon, ShareIcon, Trash2Icon } from "@lucide/svelte";
	const { projects }: Props = $props();
	const sidebar = useSidebar();
	/** Project links with a menu of actions on each; hidden while collapsed to icons */
	interface Props {
		/** Projects with their icons */
		projects: { name: string; url: string; icon: Component }[];
	}
</script>

<SidebarGroup class="projectsGroup">
	<SidebarGroupLabel>Projects</SidebarGroupLabel>
	<SidebarMenu>
		{#each projects as item (item.name)}
			<SidebarMenuItem>
				<SidebarMenuButton href={item.url}>
					<item.icon />
					<span>{item.name}</span>
				</SidebarMenuButton>

				<!-- Actions menu; opens below on mobile and beside the sidebar on desktop. -->
				<DropdownMenu side={sidebar.isMobile ? "bottom" : "right"} align={sidebar.isMobile ? "end" : "start"}>
					<DropdownMenuTrigger>
						{#snippet trigger({ props })}
							<SidebarMenuAction showOnHover class="projectAction" aria-label="More for {item.name}" {...props}><EllipsisIcon /></SidebarMenuAction>
						{/snippet}
					</DropdownMenuTrigger>
					<DropdownMenuContent style="min-width: 12rem">
						<DropdownMenuItem><FolderIcon /> View Project</DropdownMenuItem>
						<DropdownMenuItem><ShareIcon /> Share Project</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem><Trash2Icon /> Delete Project</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		{/each}

		<!-- Link to the rest of the projects. -->
		<SidebarMenuItem>
			<SidebarMenuButton>
				<EllipsisIcon />
				<span>More</span>
			</SidebarMenuButton>
		</SidebarMenuItem>
	</SidebarMenu>
</SidebarGroup>

<style>
	/* Collapsed to icons, the projects hide */
	:global(.sidebar[data-collapsible="icon"] .sidebarGroup.projectsGroup) {
		display: none;
	}

	/* The action stays highlighted while its menu is open */
	:global(.sidebar .sidebarMenuAction.projectAction[aria-expanded="true"]) {
		background-color: var(--muted);
	}
</style>
