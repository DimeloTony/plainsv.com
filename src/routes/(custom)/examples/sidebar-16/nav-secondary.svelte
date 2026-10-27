<script lang="ts">
	import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "#lib/components/ui/sidebar/index.js";
	const { items, ...props }: Props = $props();
	/** Small secondary links, such as support and feedback */
	interface Props extends CompProps<"div"> {
		/** Links with their icons */
		items: { title: string; url: string; icon: Component }[];
	}
</script>

<SidebarGroup {...props}>
	<SidebarGroupContent>
		<SidebarMenu>
			{#each items as item (item.title)}
				<SidebarMenuItem>
					<SidebarMenuButton size="sm" href={item.url}>
						<item.icon />
						<span>{item.title}</span>
					</SidebarMenuButton>
				</SidebarMenuItem>
			{/each}
		</SidebarMenu>
	</SidebarGroupContent>
</SidebarGroup>
