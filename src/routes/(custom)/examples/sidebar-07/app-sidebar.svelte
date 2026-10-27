<script lang="ts">
	import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, type SidebarProps } from "#lib/components/ui/sidebar/index.js";
	import { GalleryVerticalEndIcon, AudioLinesIcon, TerminalIcon, SquareTerminalIcon, BotIcon, BookOpenIcon, Settings2Icon, FrameIcon, ChartPieIcon, MapIcon } from "@lucide/svelte";
	import TeamSwitcher from "./team-switcher.svelte";
	import NavMain from "./nav-main.svelte";
	import NavProjects from "./nav-projects.svelte";
	import NavUser from "./nav-user.svelte";
	const { ...props }: Omit<SidebarProps, "children"> = $props();
	// Sample teams, navigation, projects, and user.
	const data = {
		user: { name: "shadcn", email: "m@example.com", initials: "CN" },
		teams: [
			{ name: "Acme Inc", logo: GalleryVerticalEndIcon, plan: "Enterprise" },
			{ name: "Acme Corp.", logo: AudioLinesIcon, plan: "Startup" },
			{ name: "Evil Corp.", logo: TerminalIcon, plan: "Free" },
		],
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
		projects: [
			{ name: "Design Engineering", url: "#", icon: FrameIcon },
			{ name: "Sales & Marketing", url: "#", icon: ChartPieIcon },
			{ name: "Travel", url: "#", icon: MapIcon },
		],
	};
</script>

<Sidebar collapsible="icon" {...props}>
	<!-- Team switcher. -->
	<SidebarHeader>
		<TeamSwitcher teams={data.teams} />
	</SidebarHeader>

	<!-- Platform sections and projects. -->
	<SidebarContent>
		<NavMain items={data.navMain} />
		<NavProjects projects={data.projects} />
	</SidebarContent>

	<!-- Signed-in user with an account menu. -->
	<SidebarFooter>
		<NavUser user={data.user} />
	</SidebarFooter>
	<SidebarRail />
</Sidebar>
