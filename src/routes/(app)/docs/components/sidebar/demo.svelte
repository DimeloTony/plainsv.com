<script lang="ts">
	import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarGroupAction, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuAction, SidebarMenuBadge, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton, SidebarMenuSkeleton, SidebarSeparator, SidebarInput } from "#lib/components/ui/sidebar/index.js";
	import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "#lib/components/ui/collapsible/index.js";
	import { HouseIcon, InboxIcon, CalendarIcon, SearchIcon, SettingsIcon, PlusIcon, EllipsisIcon, FolderIcon, ChevronsUpDownIcon, ChevronRightIcon } from "@lucide/svelte";

	const { section = "preview" }: Props = $props();
	const items = [
		{ title: "Home", icon: HouseIcon, badge: undefined },
		{ title: "Inbox", icon: InboxIcon, badge: 24 },
		{ title: "Calendar", icon: CalendarIcon, badge: undefined },
		{ title: "Search", icon: SearchIcon, badge: undefined },
		{ title: "Settings", icon: SettingsIcon, badge: undefined },
	];
	let activeItem = $state("Home");
	// Sections whose label opens and closes their links.
	const sections = [
		{ title: "Getting Started", links: ["Installation", "Project Structure"] },
		{ title: "Build Your Application", links: ["Routing", "Data Fetching", "Rendering"] },
		{ title: "API Reference", links: ["Components", "Functions"] },
	];

	/** Live preview for one section of the sidebar docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "menuButtons" | "collapsibleGroups" | "skeleton";
	}
</script>

<div class="demo">
	<div class="demoFrame">
		<SidebarProvider shortcut={false} style="min-height: 100%">
			<Sidebar collapsible="none">
				{#if section === "preview"}
					<!-- Team header, search, two groups, and a user footer. -->
					<SidebarHeader>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton size="lg">
									<span class="demoLogo">P</span>
									<span class="demoTeam"><strong>PlainSv</strong><span>Enterprise</span></span>
									<ChevronsUpDownIcon style="margin-left: auto" />
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
						<SidebarInput placeholder="Search..." aria-label="Search" />
					</SidebarHeader>
					<SidebarContent>
						<SidebarGroup>
							<SidebarGroupLabel>Application</SidebarGroupLabel>
							<SidebarGroupContent>
								<SidebarMenu>
									{#each items as item (item.title)}
										<SidebarMenuItem>
											<SidebarMenuButton isActive={activeItem === item.title} onclick={() => (activeItem = item.title)}>
												<item.icon />
												<span>{item.title}</span>
											</SidebarMenuButton>
											{#if item.badge}<SidebarMenuBadge>{item.badge}</SidebarMenuBadge>{/if}
										</SidebarMenuItem>
									{/each}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
						<SidebarSeparator />
						<SidebarGroup>
							<SidebarGroupLabel>Projects</SidebarGroupLabel>
							<SidebarGroupAction aria-label="Add project"><PlusIcon /></SidebarGroupAction>
							<SidebarGroupContent>
								<SidebarMenu>
									<SidebarMenuItem>
										<SidebarMenuButton>
											<FolderIcon />
											<span>Design engineering</span>
										</SidebarMenuButton>
										<SidebarMenuAction showOnHover aria-label="More"><EllipsisIcon /></SidebarMenuAction>
										<SidebarMenuSub>
											<SidebarMenuSubItem><SidebarMenuSubButton href="/docs/components" isActive><span>Overview</span></SidebarMenuSubButton></SidebarMenuSubItem>
											<SidebarMenuSubItem><SidebarMenuSubButton href="/docs/components"><span>Roadmap</span></SidebarMenuSubButton></SidebarMenuSubItem>
										</SidebarMenuSub>
									</SidebarMenuItem>
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					</SidebarContent>
					<SidebarFooter>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton>
									<span class="demoAvatar">AT</span>
									<span>Account</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarFooter>
				{:else if section === "menuButtons"}
					<!-- Button sizes, the outline variant, an active link, a hover action, and a badge. -->
					<SidebarContent>
						<SidebarGroup>
							<SidebarGroupLabel>Sizes</SidebarGroupLabel>
							<SidebarMenu>
								{#each ["sm", "md", "lg"] as const as size (size)}
									<SidebarMenuItem>
										<SidebarMenuButton {size}>
											<FolderIcon />
											<span>Size {size}</span>
										</SidebarMenuButton>
									</SidebarMenuItem>
								{/each}
							</SidebarMenu>
						</SidebarGroup>
						<SidebarGroup>
							<SidebarGroupLabel>States</SidebarGroupLabel>
							<SidebarMenu>
								<SidebarMenuItem>
									<SidebarMenuButton href="/docs/components/sidebar" isActive>
										<HouseIcon />
										<span>Active link</span>
									</SidebarMenuButton>
								</SidebarMenuItem>
								<SidebarMenuItem>
									<SidebarMenuButton variant="outline">
										<SettingsIcon />
										<span>Outline</span>
									</SidebarMenuButton>
								</SidebarMenuItem>
								<SidebarMenuItem>
									<SidebarMenuButton>
										<FolderIcon />
										<span>Hover for action</span>
									</SidebarMenuButton>
									<SidebarMenuAction showOnHover aria-label="More"><EllipsisIcon /></SidebarMenuAction>
								</SidebarMenuItem>
								<SidebarMenuItem>
									<SidebarMenuButton>
										<InboxIcon />
										<span>With badge</span>
									</SidebarMenuButton>
									<SidebarMenuBadge>8</SidebarMenuBadge>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarGroup>
					</SidebarContent>
				{:else if section === "collapsibleGroups"}
					<!-- Each label is the trigger that opens and closes its group. -->
					<SidebarContent style="gap: 0">
						{#each sections as group (group.title)}
							<Collapsible defaultOpen>
								<SidebarGroup>
									<CollapsibleTrigger>
										{#snippet trigger({ props })}
											<SidebarGroupLabel class="demoGroupToggle" {...props}>
												{group.title}
												<ChevronRightIcon class="demoGroupChevron" />
											</SidebarGroupLabel>
										{/snippet}
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarGroupContent>
											<SidebarMenu>
												{#each group.links as link (link)}
													<SidebarMenuItem>
														<SidebarMenuButton isActive={link === "Data Fetching"}>{link}</SidebarMenuButton>
													</SidebarMenuItem>
												{/each}
											</SidebarMenu>
										</SidebarGroupContent>
									</CollapsibleContent>
								</SidebarGroup>
							</Collapsible>
						{/each}
					</SidebarContent>
				{:else if section === "skeleton"}
					<!-- Placeholders while the menu loads. -->
					<SidebarContent>
						<SidebarGroup>
							<SidebarGroupLabel>Projects</SidebarGroupLabel>
							<SidebarMenu aria-busy="true">
								{#each Array.from({ length: 5 }, (_, index) => index) as index (index)}
									<SidebarMenuItem><SidebarMenuSkeleton showIcon /></SidebarMenuItem>
								{/each}
							</SidebarMenu>
						</SidebarGroup>
					</SidebarContent>
				{/if}
			</Sidebar>
			<div class="demoMain">Main content</div>
		</SidebarProvider>
	</div>
</div>

<style>
	/* Chevron at the end of a group toggle that points down while the group is open */
	.demo :global(.demoGroupChevron) {
		transition: transform 200ms ease;
		margin-left: auto;
	}

	.demo :global(.demoGroupToggle[data-state="open"] .demoGroupChevron) {
		transform: rotate(90deg);
	}

	.demo {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: var(--spacing-sm);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 1rem 0;
	}

	.demoFrame {
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		height: 30rem;
		overflow: hidden;
	}

	.demoMain {
		display: flex;
		flex: 1;
		justify-content: center;
		align-items: center;
		color: var(--muted-foreground);
		font-size: var(--text-sm);
	}

	.demoLogo,
	.demoAvatar {
		display: flex;
		flex-shrink: 0;
		justify-content: center;
		align-items: center;
		border-radius: var(--radius-md);
		background-color: var(--sidebar-primary);
		width: var(--control-height-sm);
		height: var(--control-height-sm);
		color: var(--sidebar-primary-foreground);
		font-weight: 600;
		font-size: var(--text-xs);
	}

	.demoAvatar {
		border-radius: var(--radius-pill);
		background-color: var(--muted);
		width: 1.5rem;
		height: 1.5rem;
		color: var(--foreground);
	}

	.demoTeam {
		display: flex;
		flex-direction: column;
		line-height: 1.25;
	}

	.demoTeam span {
		font-size: var(--text-xs);
	}
</style>
