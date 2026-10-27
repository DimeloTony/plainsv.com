<script lang="ts">
	import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, type SidebarProps } from "#lib/components/ui/sidebar/index.js";
	import { GalleryVerticalEndIcon } from "@lucide/svelte";
	import NavMain from "./nav-main.svelte";
	import SidebarOptInForm from "./sidebar-opt-in-form.svelte";
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
					{ title: "Data Fetching", url: "#" },
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
		],
	};
</script>

<Sidebar {...props}>
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

	<!-- Sections that open their pages in a dropdown. -->
	<SidebarContent>
		<NavMain items={data.navMain} />
	</SidebarContent>

	<!-- Newsletter card. -->
	<SidebarFooter>
		<div class="optInWrap">
			<SidebarOptInForm />
		</div>
	</SidebarFooter>
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

	.optInWrap {
		padding: var(--spacing-xs);
	}
</style>
