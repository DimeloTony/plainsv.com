<script lang="ts">
	import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, SidebarSeparator, type SidebarProps } from "#lib/components/ui/sidebar/index.js";
	import { PlusIcon } from "@lucide/svelte";
	import NavUser from "./nav-user.svelte";
	import DatePicker from "./date-picker.svelte";
	import Calendars from "./calendars.svelte";
	const { ...props }: Omit<SidebarProps, "children"> = $props();
	// Sample user and calendar lists.
	const data = {
		user: { name: "shadcn", email: "m@example.com", initials: "CN" },
		calendars: [
			{ name: "My Calendars", items: ["Personal", "Work", "Family"] },
			{ name: "Favorites", items: ["Holidays", "Birthdays"] },
			{ name: "Other", items: ["Travel", "Reminders", "Deadlines"] },
		],
	};
</script>

<Sidebar {...props}>
	<!-- Signed-in user, as tall as the page header. -->
	<SidebarHeader class="userHeader">
		<NavUser user={data.user} />
	</SidebarHeader>

	<!-- Month calendar and the calendar lists. -->
	<SidebarContent>
		<DatePicker />
		<SidebarSeparator style="margin-inline: 0" />
		<Calendars calendars={data.calendars} />
	</SidebarContent>

	<!-- New calendar action. -->
	<SidebarFooter>
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton>
					<PlusIcon />
					<span>New Calendar</span>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	</SidebarFooter>
	<SidebarRail />
</Sidebar>

<style>
	:global(.sidebar .sidebarHeader.userHeader) {
		justify-content: center;
		border-bottom: 1px solid var(--sidebar-border);
		height: 4rem; /* 64px */
	}
</style>
