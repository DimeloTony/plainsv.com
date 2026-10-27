<script lang="ts">
	import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "#lib/components/ui/sidebar/index.js";
	import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "#lib/components/ui/collapsible/index.js";
	import { ChevronRightIcon } from "@lucide/svelte";
	const { items }: Props = $props();
	/** Platform links, each with an action that expands its pages */
	interface Props {
		/** Sections with an icon, whether they start open, and their pages */
		items: { title: string; url: string; icon: Component; isActive?: boolean; items?: { title: string; url: string }[] }[];
	}
</script>

<SidebarGroup>
	<SidebarGroupLabel>Platform</SidebarGroupLabel>
	<SidebarMenu>
		{#each items as item (item.title)}
			<SidebarMenuItem>
				<Collapsible defaultOpen={item.isActive}>
					<!-- The section is a link; the action beside it expands its pages. -->
					<SidebarMenuButton href={item.url} tooltip={item.title}>
						<item.icon />
						<span>{item.title}</span>
					</SidebarMenuButton>
					{#if item.items?.length}
						<CollapsibleTrigger>
							{#snippet trigger({ props })}
								<SidebarMenuAction class="sectionToggle" aria-label="Toggle {item.title}" {...props}><ChevronRightIcon /></SidebarMenuAction>
							{/snippet}
						</CollapsibleTrigger>
						<CollapsibleContent>
							<SidebarMenuSub>
								{#each item.items as page (page.title)}
									<SidebarMenuSubItem>
										<SidebarMenuSubButton href={page.url}><span>{page.title}</span></SidebarMenuSubButton>
									</SidebarMenuSubItem>
								{/each}
							</SidebarMenuSub>
						</CollapsibleContent>
					{/if}
				</Collapsible>
			</SidebarMenuItem>
		{/each}
	</SidebarMenu>
</SidebarGroup>

<style>
	/* The chevron points down while the pages are shown */
	:global(.sidebar .sidebarMenuAction.sectionToggle) {
		transition: transform 200ms ease;
	}

	:global(.sidebar .sidebarMenuAction.sectionToggle[aria-expanded="true"]) {
		transform: rotate(90deg);
	}
</style>
