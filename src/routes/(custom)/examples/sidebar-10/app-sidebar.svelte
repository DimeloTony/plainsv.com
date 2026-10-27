<script lang="ts">
	import { Sidebar, SidebarContent, SidebarHeader, SidebarRail, type SidebarProps } from "#lib/components/ui/sidebar/index.js";
	import { TerminalIcon, AudioLinesIcon, SearchIcon, SparklesIcon, HouseIcon, InboxIcon, CalendarIcon, Settings2Icon, BlocksIcon, Trash2Icon, MessageCircleQuestionIcon } from "@lucide/svelte";
	import TeamSwitcher from "./team-switcher.svelte";
	import NavMain from "./nav-main.svelte";
	import NavFavorites from "./nav-favorites.svelte";
	import NavWorkspaces from "./nav-workspaces.svelte";
	import NavSecondary from "./nav-secondary.svelte";
	const { ...props }: Omit<SidebarProps, "children"> = $props();
	// Sample teams, links, favorites, and workspaces.
	const data = {
		teams: [
			{ name: "Acme Inc", logo: TerminalIcon, plan: "Enterprise" },
			{ name: "Acme Corp.", logo: AudioLinesIcon, plan: "Startup" },
			{ name: "Evil Corp.", logo: TerminalIcon, plan: "Free" },
		],
		navMain: [
			{ title: "Search", url: "#", icon: SearchIcon },
			{ title: "Ask AI", url: "#", icon: SparklesIcon },
			{ title: "Home", url: "#", icon: HouseIcon, isActive: true },
			{ title: "Inbox", url: "#", icon: InboxIcon },
		],
		navSecondary: [
			{ title: "Calendar", url: "#", icon: CalendarIcon },
			{ title: "Settings", url: "#", icon: Settings2Icon },
			{ title: "Templates", url: "#", icon: BlocksIcon },
			{ title: "Trash", url: "#", icon: Trash2Icon },
			{ title: "Help", url: "#", icon: MessageCircleQuestionIcon },
		],
		favorites: [
			{ name: "Project Management & Task Tracking", url: "#", emoji: "📊" },
			{ name: "Family Recipe Collection & Meal Planning", url: "#", emoji: "🍳" },
			{ name: "Fitness Tracker & Workout Routines", url: "#", emoji: "💪" },
			{ name: "Book Notes & Reading List", url: "#", emoji: "📚" },
			{ name: "Sustainable Gardening Tips & Plant Care", url: "#", emoji: "🌱" },
			{ name: "Language Learning Progress & Resources", url: "#", emoji: "🗣️" },
			{ name: "Home Renovation Ideas & Budget Tracker", url: "#", emoji: "🏠" },
			{ name: "Personal Finance & Investment Portfolio", url: "#", emoji: "💰" },
			{ name: "Movie & TV Show Watchlist with Reviews", url: "#", emoji: "🎬" },
			{ name: "Daily Habit Tracker & Goal Setting", url: "#", emoji: "✅" },
		],
		workspaces: [
			{
				name: "Personal Life Management",
				emoji: "🏠",
				pages: [
					{ name: "Daily Journal & Reflection", url: "#", emoji: "📔" },
					{ name: "Health & Wellness Tracker", url: "#", emoji: "🍏" },
					{ name: "Personal Growth & Learning Goals", url: "#", emoji: "🌟" },
				],
			},
			{
				name: "Professional Development",
				emoji: "💼",
				pages: [
					{ name: "Career Objectives & Milestones", url: "#", emoji: "🎯" },
					{ name: "Skill Acquisition & Training Log", url: "#", emoji: "🧠" },
					{ name: "Networking Contacts & Events", url: "#", emoji: "🤝" },
				],
			},
			{
				name: "Creative Projects",
				emoji: "🎨",
				pages: [
					{ name: "Writing Ideas & Story Outlines", url: "#", emoji: "✍️" },
					{ name: "Art & Design Portfolio", url: "#", emoji: "🖼️" },
					{ name: "Music Composition & Practice Log", url: "#", emoji: "🎵" },
				],
			},
			{
				name: "Home Management",
				emoji: "🏡",
				pages: [
					{ name: "Household Budget & Expense Tracking", url: "#", emoji: "💰" },
					{ name: "Home Maintenance Schedule & Tasks", url: "#", emoji: "🔧" },
					{ name: "Family Calendar & Event Planning", url: "#", emoji: "📅" },
				],
			},
			{
				name: "Travel & Adventure",
				emoji: "🧳",
				pages: [
					{ name: "Trip Planning & Itineraries", url: "#", emoji: "🗺️" },
					{ name: "Travel Bucket List & Inspiration", url: "#", emoji: "🌎" },
					{ name: "Travel Journal & Photo Gallery", url: "#", emoji: "📸" },
				],
			},
		],
	};
</script>

<Sidebar class="borderlessSidebar" {...props}>
	<!-- Team switcher and the main links. -->
	<SidebarHeader>
		<TeamSwitcher teams={data.teams} />
		<NavMain items={data.navMain} />
	</SidebarHeader>

	<!-- Favorites, workspaces, and secondary links pushed to the bottom. -->
	<SidebarContent>
		<NavFavorites favorites={data.favorites} />
		<NavWorkspaces workspaces={data.workspaces} />
		<NavSecondary items={data.navSecondary} style="margin-top: auto" />
	</SidebarContent>
	<SidebarRail />
</Sidebar>

<style>
	/* No border between the sidebar and the page */
	:global(.sidebar.sidebarDesktop:has(.borderlessSidebar) .sidebarContainer) {
		border-right: none;
	}
</style>
