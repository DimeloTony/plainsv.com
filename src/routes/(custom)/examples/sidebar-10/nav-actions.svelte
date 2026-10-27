<script lang="ts">
	import { Popover, PopoverTrigger, PopoverContent } from "#lib/components/ui/popover/index.js";
	import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "#lib/components/ui/sidebar/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { Settings2Icon, FileTextIcon, LinkIcon, CopyIcon, CornerUpRightIcon, Trash2Icon, CornerUpLeftIcon, ChartLineIcon, GalleryVerticalEndIcon, TrashIcon, BellIcon, ArrowUpIcon, ArrowDownIcon, StarIcon, EllipsisIcon } from "@lucide/svelte";
	// Page actions in groups, divided by borders.
	const groups = [
		[
			{ label: "Customize Page", icon: Settings2Icon },
			{ label: "Turn into wiki", icon: FileTextIcon },
		],
		[
			{ label: "Copy Link", icon: LinkIcon },
			{ label: "Duplicate", icon: CopyIcon },
			{ label: "Move to", icon: CornerUpRightIcon },
			{ label: "Move to Trash", icon: Trash2Icon },
		],
		[
			{ label: "Undo", icon: CornerUpLeftIcon },
			{ label: "View analytics", icon: ChartLineIcon },
			{ label: "Version History", icon: GalleryVerticalEndIcon },
			{ label: "Show delete pages", icon: TrashIcon },
			{ label: "Notifications", icon: BellIcon },
		],
		[
			{ label: "Import", icon: ArrowUpIcon },
			{ label: "Export", icon: ArrowDownIcon },
		],
	];
	let isOpen = $state(false);

	// The menu opens once the page loads, to show it off in this example.
	$effect(() => {
		isOpen = true;
	});
</script>

<div class="navActions">
	<span class="editedAt">Edit Oct 08</span>
	<Button variant="ghost" size="icon-sm" aria-label="Add to favorites"><StarIcon /></Button>

	<!-- Page actions in a static sidebar inside a popover. -->
	<Popover bind:open={isOpen} align="end">
		<PopoverTrigger>
			{#snippet trigger({ props })}
				<Button variant="ghost" size="icon-sm" class="actionsButton" aria-label="Page actions" {...props}><EllipsisIcon /></Button>
			{/snippet}
		</PopoverTrigger>
		<PopoverContent rounded="lg" style="width: 14rem; padding: 0; overflow: hidden">
			<Sidebar collapsible="none" class="actionsSidebar">
				<SidebarContent>
					{#each groups as group, index (index)}
						<SidebarGroup class="actionsGroup">
							<SidebarGroupContent>
								<SidebarMenu>
									{#each group as item (item.label)}
										<SidebarMenuItem>
											<SidebarMenuButton>
												<item.icon />
												<span>{item.label}</span>
											</SidebarMenuButton>
										</SidebarMenuItem>
									{/each}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					{/each}
				</SidebarContent>
			</Sidebar>
		</PopoverContent>
	</Popover>
</div>

<style>
	.navActions {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		font-size: var(--text-sm);
	}

	/* The edit date only shows on wider screens */
	.editedAt {
		display: none;
		color: var(--muted-foreground);
		font-weight: 500;
	}

	@media (min-width: 48rem) {
		.editedAt {
			display: inline-block;
		}
	}

	.navActions :global(.button.actionsButton[aria-expanded="true"]) {
		background-color: var(--accent);
	}

	/* The sidebar fills the popover on a transparent background */
	:global(.popoverContent .sidebar.sidebarStatic.actionsSidebar) {
		background-color: transparent;
		width: 100%;
	}

	/* Groups divided by borders */
	:global(.actionsSidebar .sidebarGroup.actionsGroup) {
		border-bottom: 1px solid var(--border);
	}

	:global(.actionsSidebar .sidebarGroup.actionsGroup:last-child) {
		border-bottom: none;
	}
</style>
