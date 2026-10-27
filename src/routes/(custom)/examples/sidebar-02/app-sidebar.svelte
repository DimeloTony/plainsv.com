<script lang="ts">
	import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, type SidebarProps } from "#lib/components/ui/sidebar/index.js";
	import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "#lib/components/ui/collapsible/index.js";
	import { ChevronRightIcon } from "@lucide/svelte";
	import SearchForm from "./search-form.svelte";
	import VersionSwitcher from "./version-switcher.svelte";
	const { ...props }: Omit<SidebarProps, "children"> = $props();
	// Sample docs navigation, grouped by section.
	const data = {
		versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
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
	<!-- Version switcher and search. -->
	<SidebarHeader>
		<VersionSwitcher versions={data.versions} defaultVersion={data.versions[0]} />
		<SearchForm />
	</SidebarHeader>

	<!-- One collapsible group per section; the label toggles its links. -->
	<SidebarContent style="gap: 0">
		{#each data.navMain as section (section.title)}
			<Collapsible defaultOpen>
				<SidebarGroup>
					<CollapsibleTrigger>
						{#snippet trigger({ props: triggerProps })}
							<SidebarGroupLabel class="groupToggle" {...triggerProps}>
								{section.title}
								<ChevronRightIcon class="groupChevron" />
							</SidebarGroupLabel>
						{/snippet}
					</CollapsibleTrigger>
					<CollapsibleContent>
						<SidebarGroupContent>
							<SidebarMenu>
								{#each section.items as item (item.title)}
									<SidebarMenuItem>
										<SidebarMenuButton href={item.url} isActive={item.isActive}>{item.title}</SidebarMenuButton>
									</SidebarMenuItem>
								{/each}
							</SidebarMenu>
						</SidebarGroupContent>
					</CollapsibleContent>
				</SidebarGroup>
			</Collapsible>
		{/each}
	</SidebarContent>
	<SidebarRail />
</Sidebar>

<style>
	/* The section toggle uses the full text size and color, like shadcn's collapsible groups */
	:global(.sidebar .sidebarGroupLabel.groupToggle) {
		color: var(--sidebar-foreground);
		font-size: var(--text-sm);
	}

	/* Chevron at the end that points down while the section is open */
	:global(.sidebar .sidebarGroupLabel.groupToggle .groupChevron) {
		transition: transform 200ms ease;
		margin-left: auto;
	}

	:global(.sidebar .sidebarGroupLabel.groupToggle[data-state="open"] .groupChevron) {
		transform: rotate(90deg);
	}
</style>
