<script lang="ts">
	import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem } from "#lib/components/ui/sidebar/index.js";
	const { items, ...props }: Props = $props();
	/** Secondary links, such as settings and help, with optional counts */
	interface Props extends CompProps<"div"> {
		/** Links with their icons and an optional badge */
		items: { title: string; url: string; icon: Component; badge?: string }[];
	}
</script>

<SidebarGroup {...props}>
	<SidebarGroupContent>
		<SidebarMenu>
			{#each items as item (item.title)}
				<SidebarMenuItem>
					<SidebarMenuButton href={item.url}>
						<item.icon />
						<span>{item.title}</span>
					</SidebarMenuButton>
					{#if item.badge}
						<SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
					{/if}
				</SidebarMenuItem>
			{/each}
		</SidebarMenu>
	</SidebarGroupContent>
</SidebarGroup>
