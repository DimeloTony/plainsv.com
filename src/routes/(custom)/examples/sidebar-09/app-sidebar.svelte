<script lang="ts">
	import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarInput, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar, type SidebarProps } from "#lib/components/ui/sidebar/index.js";
	import { Label } from "#lib/components/ui/label/index.js";
	import { Switch } from "#lib/components/ui/switch/index.js";
	import { TerminalIcon, InboxIcon, FileIcon, SendIcon, ArchiveXIcon, Trash2Icon } from "@lucide/svelte";
	import NavUser from "./nav-user.svelte";
	const { ...props }: Omit<SidebarProps, "children"> = $props();
	// Sample folders, mails, and user.
	const data = {
		user: { name: "shadcn", email: "m@example.com", initials: "CN" },
		navMain: [
			{ title: "Inbox", url: "#", icon: InboxIcon },
			{ title: "Drafts", url: "#", icon: FileIcon },
			{ title: "Sent", url: "#", icon: SendIcon },
			{ title: "Junk", url: "#", icon: ArchiveXIcon },
			{ title: "Trash", url: "#", icon: Trash2Icon },
		],
		mails: [
			{ name: "William Smith", email: "williamsmith@example.com", subject: "Meeting Tomorrow", date: "09:34 AM", teaser: "Hi team, just a reminder about our meeting tomorrow at 10 AM.\nPlease come prepared with your project updates." },
			{ name: "Alice Smith", email: "alicesmith@example.com", subject: "Re: Project Update", date: "Yesterday", teaser: "Thanks for the update. The progress looks great so far.\nLet's schedule a call to discuss the next steps." },
			{ name: "Bob Johnson", email: "bobjohnson@example.com", subject: "Weekend Plans", date: "2 days ago", teaser: "Hey everyone! I'm thinking of organizing a team outing this weekend.\nWould you be interested in a hiking trip or a beach day?" },
			{ name: "Emily Davis", email: "emilydavis@example.com", subject: "Re: Question about Budget", date: "2 days ago", teaser: "I've reviewed the budget numbers you sent over.\nCan we set up a quick call to discuss some potential adjustments?" },
			{ name: "Michael Wilson", email: "michaelwilson@example.com", subject: "Important Announcement", date: "1 week ago", teaser: "Please join us for an all-hands meeting this Friday at 3 PM.\nWe have some exciting news to share about the company's future." },
			{ name: "Sarah Brown", email: "sarahbrown@example.com", subject: "Re: Feedback on Proposal", date: "1 week ago", teaser: "Thank you for sending over the proposal. I've reviewed it and have some thoughts.\nCould we schedule a meeting to discuss my feedback in detail?" },
			{ name: "David Lee", email: "davidlee@example.com", subject: "New Project Idea", date: "1 week ago", teaser: "I've been brainstorming and came up with an interesting project concept.\nDo you have time this week to discuss its potential impact and feasibility?" },
			{ name: "Olivia Wilson", email: "oliviawilson@example.com", subject: "Vacation Plans", date: "1 week ago", teaser: "Just a heads up that I'll be taking a two-week vacation next month.\nI'll make sure all my projects are up to date before I leave." },
			{ name: "James Martin", email: "jamesmartin@example.com", subject: "Re: Conference Registration", date: "1 week ago", teaser: "I've completed the registration for the upcoming tech conference.\nLet me know if you need any additional information from my end." },
			{ name: "Sophia White", email: "sophiawhite@example.com", subject: "Team Dinner", date: "1 week ago", teaser: "To celebrate our recent project success, I'd like to organize a team dinner.\nAre you available next Friday evening? Please let me know your preferences." },
		],
	};
	const sidebar = useSidebar();
	// The shown folder is local state here; a real app would read it from the URL.
	let activeTitle = $state(data.navMain[0].title);
	let mails = $state(data.mails);

	/** Shows a folder with a shuffled sample of mails, and expands the sidebar so the list is visible. */
	function selectFolder(title: string) {
		activeTitle = title;
		const shuffled = [...data.mails].sort(() => Math.random() - 0.5);
		mails = shuffled.slice(0, Math.max(5, Math.floor(Math.random() * 10) + 1));
		sidebar.setOpen(true);
	}
</script>

<!-- One sidebar that collapses to icons, holding an icon rail and the mail list side by side. -->
<Sidebar collapsible="icon" class="nestedSidebar" {...props}>
	<!-- Icon rail: a static sidebar as wide as the collapsed one, with tooltips for its folders. -->
	<Sidebar collapsible="none" class="iconRail">
		<SidebarHeader>
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton size="lg" href="#" aria-label="Acme Inc">
						<span class="companyLogo"><TerminalIcon /></span>
						<span class="twoLines">
							<strong>Acme Inc</strong>
							<span>Enterprise</span>
						</span>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarHeader>
		<SidebarContent>
			<SidebarGroup>
				<SidebarGroupContent>
					<SidebarMenu>
						{#each data.navMain as item (item.title)}
							<SidebarMenuItem>
								<SidebarMenuButton tooltip={item.title} showTooltip isActive={activeTitle === item.title} onclick={() => selectFolder(item.title)}>
									<item.icon />
									<span>{item.title}</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						{/each}
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		</SidebarContent>
		<SidebarFooter>
			<NavUser user={data.user} />
		</SidebarFooter>
	</Sidebar>

	<!-- Mail list: a static sidebar that fills the rest of the panel or the drawer. -->
	<Sidebar collapsible="none" class="mailPanel">
		<SidebarHeader class="mailHeader">
			<div class="mailHeaderRow">
				<h2 class="mailFolder">{activeTitle}</h2>
				<Label class="unreadsLabel">
					<span>Unreads</span>
					<Switch size="sm" />
				</Label>
			</div>
			<SidebarInput placeholder="Type to search..." aria-label="Search mail" />
		</SidebarHeader>
		<SidebarContent>
			<SidebarGroup style="padding-inline: 0">
				<SidebarGroupContent>
					{#each mails as mail (mail.email)}
						<a href="#{mail.email}" class="mailItem">
							<span class="mailTop">
								<span>{mail.name}</span>
								<span class="mailDate">{mail.date}</span>
							</span>
							<span class="mailSubject">{mail.subject}</span>
							<span class="mailTeaser">{mail.teaser}</span>
						</a>
					{/each}
				</SidebarGroupContent>
			</SidebarGroup>
		</SidebarContent>
	</Sidebar>
</Sidebar>

<style>
	/* The outer panel lays the two sidebars side by side and clips the list while collapsed */
	:global(.sidebar .sidebarInner.nestedSidebar),
	:global(.sidebar.sidebarMobilePanel.nestedSidebar) {
		flex-direction: row;
		overflow: hidden;
	}

	/* Rail exactly as wide as the collapsed sidebar, plus its border */
	:global(.sidebar .sidebar.sidebarStatic.iconRail) {
		flex-shrink: 0;
		border-right: 1px solid var(--sidebar-border);
		width: calc(var(--sidebar-panel-icon-width) + 1px);
	}

	/* Logo and user buttons shrink to squares in the rail */
	:global(.sidebar .iconRail .sidebarMenuButton[data-size="lg"]) {
		padding: 0;
		height: var(--control-height-sm);
	}

	/* The list fills the rest of the panel, beside the rail in the mobile drawer too */
	:global(.sidebar .sidebar.sidebarStatic.mailPanel) {
		flex: 1;
		min-width: 0;
	}

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

	/* Folder title, the unreads switch, and the search */
	:global(.sidebar .sidebarHeader.mailHeader) {
		gap: calc(var(--spacing-md) + var(--spacing-xs) / 2); /* 14px */
		border-bottom: 1px solid var(--sidebar-border);
		padding: var(--spacing-lg);
	}

	.mailHeaderRow {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	.mailFolder {
		margin: 0;
		color: var(--foreground);
		font-weight: 500;
		font-size: var(--text-md);
	}

	.mailHeaderRow :global(.unreadsLabel) {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		font-size: var(--text-sm);
	}

	/* One mail per row, divided by borders */
	.mailItem {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--spacing-sm);
		border-bottom: 1px solid var(--sidebar-border);
		padding: var(--spacing-lg);
		color: inherit;
		font-size: var(--text-sm);
		line-height: 1.25;
		text-decoration: none;
		white-space: nowrap;
	}

	.mailItem:last-child {
		border-bottom: 0;
	}

	.mailItem:hover {
		background-color: var(--sidebar-accent);
		color: var(--sidebar-accent-foreground);
	}

	.mailItem:focus-visible {
		outline: none;
		box-shadow: inset 0 0 0 2px var(--sidebar-ring);
	}

	.mailTop {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		width: 100%;
	}

	.mailDate {
		margin-left: auto;
		font-size: var(--text-xs);
	}

	.mailSubject {
		font-weight: 500;
	}

	/* Two lines of the message, keeping its line breaks */
	.mailTeaser {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		width: min(16.25rem, 100%); /* 260px, or less in a narrow drawer */
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow: hidden;
		font-size: var(--text-xs);
		white-space: break-spaces;
	}
</style>
