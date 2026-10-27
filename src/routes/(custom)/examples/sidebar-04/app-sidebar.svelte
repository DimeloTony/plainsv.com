<script lang="ts">
	import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, type SidebarProps } from "#lib/components/ui/sidebar/index.js";
	import { GalleryVerticalEndIcon } from "@lucide/svelte";
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

<Sidebar variant="floating" {...props}>
	<!-- Docs logo and version. -->
	<SidebarHeader>
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton size="lg" href="#">
					<span class="docsLogo"><GalleryVerticalEndIcon /></span>
					<span class="docsTitle">
						<strong>Documentation</strong>
						<span>v1.0.0</span>
					</span>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	</SidebarHeader>

	<!-- Section links with their pages nested below. -->
	<SidebarContent>
		<SidebarGroup>
			<SidebarMenu class="sectionMenu">
				{#each data.navMain as section (section.title)}
					<SidebarMenuItem>
						<SidebarMenuButton href={section.url} class="sectionLink">{section.title}</SidebarMenuButton>
						{#if section.items.length}
							<SidebarMenuSub class="flatSub">
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
		</SidebarGroup>
	</SidebarContent>
</Sidebar>

<style>
	/* Square docs logo */
	.docsLogo {
		display: flex;
		flex-shrink: 0;
		justify-content: center;
		align-items: center;
		border-radius: var(--radius-lg);
		background-color: var(--sidebar-primary);
		width: var(--control-height-sm);
		height: var(--control-height-sm);
		color: var(--sidebar-primary-foreground);
	}

	.docsLogo :global(svg) {
		width: 1rem; /* 16px */
		height: 1rem; /* 16px */
	}

	/* Name above the version */
	.docsTitle {
		display: flex;
		flex-direction: column;
		gap: calc(var(--spacing-xs) / 2);
		line-height: 1;
	}

	.docsTitle strong {
		font-weight: 500;
	}

	/* Section links stand out from their pages */
	:global(.sidebar .sidebarMenuButton.sectionLink) {
		font-weight: 500;
	}

	/* More room between sections */
	:global(.sidebar .sidebarMenu.sectionMenu) {
		gap: var(--spacing-sm);
	}

	/* Pages sit under their section without the indent line */
	:global(.sidebar .sidebarMenuSub.flatSub) {
		margin-left: 0;
		border-left: 0;
		padding-inline: calc(var(--spacing-xs) * 1.5);
	}
</style>
