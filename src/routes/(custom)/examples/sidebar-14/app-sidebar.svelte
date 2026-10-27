<script lang="ts">
	import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarRail, type SidebarProps } from "#lib/components/ui/sidebar/index.js";
	const { ...props }: Omit<SidebarProps, "children"> = $props();
	// Sample docs navigation, grouped by section.
	const data = {
		navMain: [
			{
				title: "Getting Started",
				url: "#",
				items: [
					{ title: "Installation", url: "#" },
					{ title: "Project Structure", url: "#" },
				],
			},
			{
				title: "Build Your Application",
				url: "#",
				items: [
					{ title: "Routing", url: "#" },
					{ title: "Data Fetching", url: "#", isActive: true },
					{ title: "Rendering", url: "#" },
					{ title: "Caching", url: "#" },
					{ title: "Styling", url: "#" },
					{ title: "Optimizing", url: "#" },
					{ title: "Configuring", url: "#" },
					{ title: "Testing", url: "#" },
					{ title: "Authentication", url: "#" },
					{ title: "Deploying", url: "#" },
					{ title: "Upgrading", url: "#" },
					{ title: "Examples", url: "#" },
				],
			},
			{
				title: "API Reference",
				url: "#",
				items: [
					{ title: "Components", url: "#" },
					{ title: "File Conventions", url: "#" },
					{ title: "Functions", url: "#" },
					{ title: "next.config.js Options", url: "#" },
					{ title: "CLI", url: "#" },
					{ title: "Edge Runtime", url: "#" },
				],
			},
			{
				title: "Architecture",
				url: "#",
				items: [
					{ title: "Accessibility", url: "#" },
					{ title: "Fast Refresh", url: "#" },
					{ title: "Next.js Compiler", url: "#" },
					{ title: "Supported Browsers", url: "#" },
					{ title: "Turbopack", url: "#" },
				],
			},
			{
				title: "Community",
				url: "#",
				items: [{ title: "Contribution Guide", url: "#" }],
			},
		],
	};
</script>

<Sidebar {...props}>
	<!-- Table of contents: section links with their pages nested below. -->
	<SidebarContent>
		<SidebarGroup>
			<SidebarGroupLabel>Table of Contents</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu>
					{#each data.navMain as section (section.title)}
						<SidebarMenuItem>
							<SidebarMenuButton href={section.url} class="sectionLink">{section.title}</SidebarMenuButton>
							{#if section.items.length}
								<SidebarMenuSub>
									{#each section.items as item (item.title)}
										<SidebarMenuSubItem>
											<SidebarMenuSubButton href={item.url} isActive={item.isActive}>{item.title}</SidebarMenuSubButton>
										</SidebarMenuSubItem>
									{/each}
								</SidebarMenuSub>
							{/if}
						</SidebarMenuItem>
					{/each}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	</SidebarContent>
	<SidebarRail />
</Sidebar>

<style>
	/* Section links stand out from their pages */
	:global(.sidebar .sidebarMenuButton.sectionLink) {
		font-weight: 500;
	}
</style>
