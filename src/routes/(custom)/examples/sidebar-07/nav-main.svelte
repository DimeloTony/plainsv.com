<script lang="ts">
	import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "#lib/components/ui/sidebar/index.js";
	import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "#lib/components/ui/collapsible/index.js";
	import { ChevronRightIcon } from "@lucide/svelte";
	const { items }: Props = $props();
	/** Platform sections that expand into their pages */
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
					<!-- Section button; collapsed to icons, it shows its title in a tooltip. -->
					<CollapsibleTrigger>
						{#snippet trigger({ props })}
							<SidebarMenuButton tooltip={item.title} class="sectionButton" {...props}>
								<item.icon />
								<span>{item.title}</span>
								<ChevronRightIcon class="sectionChevron" />
							</SidebarMenuButton>
						{/snippet}
					</CollapsibleTrigger>
					<CollapsibleContent>
						<SidebarMenuSub>
							{#each item.items ?? [] as page (page.title)}
								<SidebarMenuSubItem>
									<SidebarMenuSubButton href={page.url}><span>{page.title}</span></SidebarMenuSubButton>
								</SidebarMenuSubItem>
							{/each}
						</SidebarMenuSub>
					</CollapsibleContent>
				</Collapsible>
			</SidebarMenuItem>
		{/each}
	</SidebarMenu>
</SidebarGroup>

<style>
	/* Chevron at the end that points down while the section is open */
	:global(.sidebar .sidebarMenuButton.sectionButton .sectionChevron) {
		transition: transform 200ms ease;
		margin-left: auto;
	}

	:global(.sidebar .sidebarMenuButton.sectionButton[data-state="open"] .sectionChevron) {
		transform: rotate(90deg);
	}
</style>
