<script lang="ts">
	import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarRail, type SidebarProps } from "#lib/components/ui/sidebar/index.js";
	import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "#lib/components/ui/collapsible/index.js";
	import { GalleryVerticalEndIcon, PlusIcon, MinusIcon } from "@lucide/svelte";
	import SearchForm from "./search-form.svelte";
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
	<!-- Docs logo, version, and search. -->
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
		<SearchForm />
	</SidebarHeader>

	<!-- Sections that expand into their pages; the second one starts open. -->
	<SidebarContent>
		<SidebarGroup>
			<SidebarMenu>
				{#each data.navMain as section, index (section.title)}
					<SidebarMenuItem>
						<Collapsible defaultOpen={index === 1}>
							<CollapsibleTrigger>
								{#snippet trigger({ props: triggerProps })}
									<SidebarMenuButton class="sectionToggle" {...triggerProps}>
										{section.title}
										<PlusIcon class="sectionPlus" />
										<MinusIcon class="sectionMinus" />
									</SidebarMenuButton>
								{/snippet}
							</CollapsibleTrigger>
							{#if section.items.length}
								<CollapsibleContent>
									<SidebarMenuSub>
										{#each section.items as item (item.title)}
											<SidebarMenuSubItem>
												<SidebarMenuSubButton href={item.url} isActive={item.isActive}>{item.title}</SidebarMenuSubButton>
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
	</SidebarContent>
	<SidebarRail />
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

	/* Plus while the section is closed, minus while it is open, both at the end */
	:global(.sidebarMenuButton.sectionToggle .sectionPlus),
	:global(.sidebarMenuButton.sectionToggle .sectionMinus) {
		margin-left: auto;
	}

	:global(.sidebarMenuButton.sectionToggle .sectionMinus),
	:global(.sidebarMenuButton.sectionToggle[aria-expanded="true"] .sectionPlus) {
		display: none;
	}

	:global(.sidebarMenuButton.sectionToggle[aria-expanded="true"] .sectionMinus) {
		display: block;
	}
</style>
