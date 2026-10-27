<script lang="ts">
	import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "#lib/components/ui/sidebar/index.js";
	import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "#lib/components/ui/collapsible/index.js";
	import { ChevronRightIcon, PlusIcon, EllipsisIcon } from "@lucide/svelte";
	const { workspaces }: Props = $props();
	/** Workspaces that expand into their pages */
	interface Props {
		/** Workspaces with an emoji and their pages */
		workspaces: { name: string; emoji: string; pages: { name: string; url: string; emoji: string }[] }[];
	}
</script>

<SidebarGroup>
	<SidebarGroupLabel>Workspaces</SidebarGroupLabel>
	<SidebarGroupContent>
		<SidebarMenu>
			{#each workspaces as workspace (workspace.name)}
				<SidebarMenuItem>
					<Collapsible>
						<SidebarMenuButton href="#">
							<span>{workspace.emoji}</span>
							<span>{workspace.name}</span>
						</SidebarMenuButton>

						<!-- On hover, a chevron over the emoji expands the pages, and a plus adds one. -->
						<CollapsibleTrigger>
							{#snippet trigger({ props })}
								<SidebarMenuAction showOnHover class="workspaceToggle" aria-label="Toggle {workspace.name}" {...props}><ChevronRightIcon /></SidebarMenuAction>
							{/snippet}
						</CollapsibleTrigger>
						<SidebarMenuAction showOnHover aria-label="Add a page to {workspace.name}"><PlusIcon /></SidebarMenuAction>
						<CollapsibleContent>
							<SidebarMenuSub>
								{#each workspace.pages as page (page.name)}
									<SidebarMenuSubItem>
										<SidebarMenuSubButton href={page.url}>
											<span>{page.emoji}</span>
											<span>{page.name}</span>
										</SidebarMenuSubButton>
									</SidebarMenuSubItem>
								{/each}
							</SidebarMenuSub>
						</CollapsibleContent>
					</Collapsible>
				</SidebarMenuItem>
			{/each}

			<!-- Muted link to the rest of the workspaces. -->
			<SidebarMenuItem>
				<SidebarMenuButton class="moreButton">
					<EllipsisIcon />
					<span>More</span>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	</SidebarGroupContent>
</SidebarGroup>

<style>
	/* The toggle covers the emoji on the start edge, and points down while open */
	:global(.sidebar .sidebarMenuAction.workspaceToggle) {
		right: auto;
		left: var(--spacing-sm);
		transition-property: color, background-color, box-shadow, opacity, transform;
		background-color: var(--sidebar-accent);
		color: var(--sidebar-accent-foreground);
	}

	:global(.sidebar .sidebarMenuAction.workspaceToggle[aria-expanded="true"]) {
		transform: rotate(90deg);
	}

	:global(.sidebar .sidebarMenuButton.moreButton) {
		color: color-mix(in oklab, var(--sidebar-foreground) 70%, transparent);
	}
</style>
