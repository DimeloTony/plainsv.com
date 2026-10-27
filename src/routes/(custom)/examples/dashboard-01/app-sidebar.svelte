<script lang="ts">
	import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, type SidebarProps } from "#lib/components/ui/sidebar/index.js";
	import { LayoutDashboardIcon, ListIcon, ChartBarIcon, FolderIcon, UsersIcon, Settings2Icon, CircleHelpIcon, SearchIcon, DatabaseIcon, FileChartColumnIcon, FileIcon, CommandIcon } from "@lucide/svelte";
	import NavMain from "./nav-main.svelte";
	import NavDocuments from "./nav-documents.svelte";
	import NavSecondary from "./nav-secondary.svelte";
	import NavUser from "./nav-user.svelte";
	const { ...props }: Omit<SidebarProps, "children"> = $props();
	// Sample user and navigation.
	const data = {
		user: { name: "shadcn", email: "m@example.com", initials: "CN" },
		navMain: [
			{ title: "Dashboard", url: "#", icon: LayoutDashboardIcon },
			{ title: "Lifecycle", url: "#", icon: ListIcon },
			{ title: "Analytics", url: "#", icon: ChartBarIcon },
			{ title: "Projects", url: "#", icon: FolderIcon },
			{ title: "Team", url: "#", icon: UsersIcon },
		],
		navSecondary: [
			{ title: "Settings", url: "#", icon: Settings2Icon },
			{ title: "Get Help", url: "#", icon: CircleHelpIcon },
			{ title: "Search", url: "#", icon: SearchIcon },
		],
		documents: [
			{ name: "Data Library", url: "#", icon: DatabaseIcon },
			{ name: "Reports", url: "#", icon: FileChartColumnIcon },
			{ name: "Word Assistant", url: "#", icon: FileIcon },
		],
	};
</script>

<Sidebar collapsible="offcanvas" {...props}>
	<!-- Brand. -->
	<SidebarHeader>
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton href="#" class="brandButton">
					<CommandIcon />
					<span class="brandName">Acme Inc.</span>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	</SidebarHeader>

	<!-- Main links, documents, and secondary links pushed to the bottom. -->
	<SidebarContent>
		<NavMain items={data.navMain} />
		<NavDocuments items={data.documents} />
		<NavSecondary items={data.navSecondary} style="margin-top: auto" />
	</SidebarContent>

	<!-- Signed-in user with an account menu. -->
	<SidebarFooter>
		<NavUser user={data.user} />
	</SidebarFooter>
</Sidebar>

<style>
	/* Brand button with a larger icon and title */
	:global(.sidebar .sidebarMenuButton.brandButton) {
		padding: calc(var(--spacing-xs) * 1.5);
	}

	:global(.sidebar .sidebarMenuButton.brandButton > svg) {
		width: 1.25rem; /* 20px */
		height: 1.25rem; /* 20px */
	}

	.brandName {
		font-weight: 600;
		font-size: var(--text-md);
	}
</style>
