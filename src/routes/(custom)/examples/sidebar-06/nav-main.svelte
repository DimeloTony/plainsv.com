<script lang="ts">
	import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "#lib/components/ui/sidebar/index.js";
	import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "#lib/components/ui/dropdown-menu/index.js";
	import { EllipsisIcon } from "@lucide/svelte";
	const { items }: Props = $props();
	const sidebar = useSidebar();
	/** Sections whose pages open in a dropdown */
	interface Props {
		/** Sections with their pages */
		items: { title: string; url: string; items?: { title: string; url: string }[] }[];
	}
</script>

<SidebarGroup>
	<SidebarMenu>
		{#each items as item (item.title)}
			<SidebarMenuItem>
				<!-- The pages open below on mobile and beside the sidebar on desktop. -->
				<DropdownMenu side={sidebar.isMobile ? "bottom" : "right"} align={sidebar.isMobile ? "end" : "start"}>
					<DropdownMenuTrigger>
						{#snippet trigger({ props })}
							<SidebarMenuButton class="sectionButton" {...props}>
								<span>{item.title}</span>
								<EllipsisIcon class="sectionEllipsis" />
							</SidebarMenuButton>
						{/snippet}
					</DropdownMenuTrigger>
					{#if item.items?.length}
						<DropdownMenuContent rounded="lg" style="min-width: 14rem">
							{#each item.items as page (page.title)}
								<DropdownMenuItem href={page.url}>{page.title}</DropdownMenuItem>
							{/each}
						</DropdownMenuContent>
					{/if}
				</DropdownMenu>
			</SidebarMenuItem>
		{/each}
	</SidebarMenu>
</SidebarGroup>

<style>
	:global(.sidebar .sidebarMenuButton.sectionButton .sectionEllipsis) {
		margin-left: auto;
	}

	/* The section stays highlighted while its pages are open */
	:global(.sidebar .sidebarMenuButton.sectionButton[aria-expanded="true"]) {
		background-color: var(--muted);
	}
</style>
