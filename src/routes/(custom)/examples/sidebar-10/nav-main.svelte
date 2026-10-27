<script lang="ts">
	import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "#lib/components/ui/sidebar/index.js";
	const { items }: Props = $props();
	/** Main links under the team switcher */
	interface Props {
		/** Links with their icons, one marked as the current page */
		items: { title: string; url: string; icon: Component; isActive?: boolean }[];
	}
</script>

<SidebarMenu>
	{#each items as item (item.title)}
		<SidebarMenuItem>
			<SidebarMenuButton href={item.url} isActive={item.isActive}>
				<item.icon />
				<span>{item.title}</span>
			</SidebarMenuButton>
		</SidebarMenuItem>
	{/each}
</SidebarMenu>
