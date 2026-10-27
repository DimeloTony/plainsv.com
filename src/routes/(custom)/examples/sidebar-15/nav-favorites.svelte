<script lang="ts">
	import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, useSidebar } from "#lib/components/ui/sidebar/index.js";
	import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator } from "#lib/components/ui/dropdown-menu/index.js";
	import { EllipsisIcon, StarOffIcon, LinkIcon, ArrowUpRightIcon, Trash2Icon } from "@lucide/svelte";
	const { favorites }: Props = $props();
	const sidebar = useSidebar();
	/** Favorite pages with a menu of actions on each; hidden while collapsed to icons */
	interface Props {
		/** Pages with an emoji */
		favorites: { name: string; url: string; emoji: string }[];
	}
</script>

<SidebarGroup class="favoritesGroup">
	<SidebarGroupLabel>Favorites</SidebarGroupLabel>
	<SidebarMenu>
		{#each favorites as item (item.name)}
			<SidebarMenuItem>
				<SidebarMenuButton href={item.url} title={item.name}>
					<span>{item.emoji}</span>
					<span>{item.name}</span>
				</SidebarMenuButton>

				<!-- Actions menu; opens below on mobile and beside the sidebar on desktop. -->
				<DropdownMenu side={sidebar.isMobile ? "bottom" : "right"} align={sidebar.isMobile ? "end" : "start"}>
					<DropdownMenuTrigger>
						{#snippet trigger({ props })}
							<SidebarMenuAction showOnHover class="favoriteAction" aria-label="More for {item.name}" {...props}><EllipsisIcon /></SidebarMenuAction>
						{/snippet}
					</DropdownMenuTrigger>
					<DropdownMenuContent rounded="lg" style="min-width: 14rem">
						<DropdownMenuGroup>
							<DropdownMenuItem><StarOffIcon /> Remove from Favorites</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem><LinkIcon /> Copy Link</DropdownMenuItem>
							<DropdownMenuItem><ArrowUpRightIcon /> Open in New Tab</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem><Trash2Icon /> Delete</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		{/each}

		<!-- Muted link to the rest of the favorites. -->
		<SidebarMenuItem>
			<SidebarMenuButton class="moreButton">
				<EllipsisIcon />
				<span>More</span>
			</SidebarMenuButton>
		</SidebarMenuItem>
	</SidebarMenu>
</SidebarGroup>

<style>
	/* Collapsed to icons, the favorites hide */
	:global(.sidebar[data-collapsible="icon"] .sidebarGroup.favoritesGroup) {
		display: none;
	}

	/* The action stays highlighted while its menu is open */
	:global(.sidebar .sidebarMenuAction.favoriteAction[aria-expanded="true"]) {
		background-color: var(--muted);
	}

	:global(.sidebar .sidebarMenuButton.moreButton) {
		color: color-mix(in oklab, var(--sidebar-foreground) 70%, transparent);
	}
</style>
