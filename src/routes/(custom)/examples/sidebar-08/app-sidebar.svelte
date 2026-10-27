<script lang="ts">
	import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, type SidebarProps } from "#lib/components/ui/sidebar/index.js";
	import { TerminalIcon, SquareTerminalIcon, BotIcon, BookOpenIcon, Settings2Icon, LifeBuoyIcon, SendIcon, FrameIcon, ChartPieIcon, MapIcon } from "@lucide/svelte";
	import NavMain from "./nav-main.svelte";
	import NavProjects from "./nav-projects.svelte";
	import NavSecondary from "./nav-secondary.svelte";
	import NavUser from "./nav-user.svelte";
	const { ...props }: Omit<SidebarProps, "children"> = $props();
	// Sample navigation, projects, secondary links, and user.
	const data = {
		user: { name: "shadcn", email: "m@example.com", initials: "CN" },
		navMain: [
			{
				title: "Playground",
				url: "#",
				icon: SquareTerminalIcon,
				isActive: true,
				items: [
					{ title: "History", url: "#" },
					{ title: "Starred", url: "#" },
					{ title: "Settings", url: "#" },
				],
			},
			{
				title: "Models",
				url: "#",
				icon: BotIcon,
				items: [
					{ title: "Genesis", url: "#" },
					{ title: "Explorer", url: "#" },
					{ title: "Quantum", url: "#" },
				],
			},
			{
				title: "Documentation",
				url: "#",
				icon: BookOpenIcon,
				items: [
					{ title: "Introduction", url: "#" },
					{ title: "Get Started", url: "#" },
					{ title: "Tutorials", url: "#" },
					{ title: "Changelog", url: "#" },
				],
			},
			{
				title: "Settings",
				url: "#",
				icon: Settings2Icon,
				items: [
					{ title: "General", url: "#" },
					{ title: "Team", url: "#" },
					{ title: "Billing", url: "#" },
					{ title: "Limits", url: "#" },
				],
			},
		],
		navSecondary: [
			{ title: "Support", url: "#", icon: LifeBuoyIcon },
			{ title: "Feedback", url: "#", icon: SendIcon },
		],
		projects: [
			{ name: "Design Engineering", url: "#", icon: FrameIcon },
			{ name: "Sales & Marketing", url: "#", icon: ChartPieIcon },
			{ name: "Travel", url: "#", icon: MapIcon },
		],
	};
</script>

<Sidebar variant="inset" {...props}>
	<!-- Company logo and plan. -->
	<SidebarHeader>
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton size="lg" href="#">
					<span class="companyLogo"><TerminalIcon /></span>
					<span class="twoLines">
						<strong>Acme Inc</strong>
						<span>Enterprise</span>
					</span>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	</SidebarHeader>

	<!-- Platform sections, projects, and secondary links pushed to the bottom. -->
	<SidebarContent>
		<NavMain items={data.navMain} />
		<NavProjects projects={data.projects} />
		<NavSecondary items={data.navSecondary} style="margin-top: auto" />
	</SidebarContent>

	<!-- Signed-in user with an account menu. -->
	<SidebarFooter>
		<NavUser user={data.user} />
	</SidebarFooter>
</Sidebar>

<style>
	/* Square company logo */
	.companyLogo {
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

	.companyLogo :global(svg) {
		width: 1rem; /* 16px */
		height: 1rem; /* 16px */
	}

	/* Name above the plan, both truncated */
	.twoLines {
		display: flex;
		flex: 1;
		flex-direction: column;
		min-width: 0;
		line-height: 1.25;
		text-align: left;
	}

	.twoLines strong,
	.twoLines span {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.twoLines strong {
		font-weight: 500;
	}

	.twoLines span {
		font-size: var(--text-xs);
	}
</style>
