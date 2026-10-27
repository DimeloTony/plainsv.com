<script lang="ts">
	import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, useSidebar } from "#lib/components/ui/sidebar/index.js";
	import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "#lib/components/ui/dropdown-menu/index.js";
	import { EllipsisIcon, FolderIcon, ShareIcon, Trash2Icon } from "@lucide/svelte";
	const { items }: Props = $props();
	const sidebar = useSidebar();
	/** Document links with a menu of actions on each */
	interface Props {
		/** Documents with their icons */
		items: { name: string; url: string; icon: Component }[];
	}
</script>

<SidebarGroup>
	<SidebarGroupLabel>Documents</SidebarGroupLabel>
	<SidebarMenu>
		{#each items as item (item.name)}
			<SidebarMenuItem>
				<SidebarMenuButton href={item.url}>
					<item.icon />
					<span>{item.name}</span>
				</SidebarMenuButton>

				<!-- Actions menu; opens below on mobile and beside the sidebar on desktop. -->
				<DropdownMenu side={sidebar.isMobile ? "bottom" : "right"} align={sidebar.isMobile ? "end" : "start"}>
					<DropdownMenuTrigger>
						{#snippet trigger({ props })}
							<SidebarMenuAction showOnHover class="documentAction" aria-label="More for {item.name}" {...props}><EllipsisIcon /></SidebarMenuAction>
						{/snippet}
					</DropdownMenuTrigger>
					<DropdownMenuContent style="min-width: 6rem">
						<DropdownMenuItem><FolderIcon /> Open</DropdownMenuItem>
						<DropdownMenuItem><ShareIcon /> Share</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem variant="destructive"><Trash2Icon /> Delete</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		{/each}

		<!-- Muted link to the rest of the documents. -->
		<SidebarMenuItem>
			<SidebarMenuButton class="moreButton">
				<EllipsisIcon />
				<span>More</span>
			</SidebarMenuButton>
		</SidebarMenuItem>
	</SidebarMenu>
</SidebarGroup>

<style>
	/* The action stays highlighted while its menu is open */
	:global(.sidebar .sidebarMenuAction.documentAction[aria-expanded="true"]) {
		background-color: var(--muted);
	}

	:global(.sidebar .sidebarMenuButton.moreButton) {
		color: color-mix(in oklab, var(--sidebar-foreground) 70%, transparent);
	}
</style>
