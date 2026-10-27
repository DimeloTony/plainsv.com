<script lang="ts">
	import { Dialog, DialogTrigger, DialogContent } from "#lib/components/ui/dialog/index.js";
	import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "#lib/components/ui/sidebar/index.js";
	import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "#lib/components/ui/breadcrumb/index.js";
	import { BellIcon, MenuIcon, HouseIcon, PaintbrushIcon, MessageCircleIcon, GlobeIcon, KeyboardIcon, CheckIcon, VideoIcon, LinkIcon, LockIcon, SettingsIcon } from "@lucide/svelte";
	// Settings sections, one marked as the open one.
	const nav = [
		{ name: "Notifications", icon: BellIcon },
		{ name: "Navigation", icon: MenuIcon },
		{ name: "Home", icon: HouseIcon },
		{ name: "Appearance", icon: PaintbrushIcon },
		{ name: "Messages & media", icon: MessageCircleIcon },
		{ name: "Language & region", icon: GlobeIcon },
		{ name: "Accessibility", icon: KeyboardIcon },
		{ name: "Mark as read", icon: CheckIcon },
		{ name: "Audio & video", icon: VideoIcon },
		{ name: "Connected accounts", icon: LinkIcon },
		{ name: "Privacy & visibility", icon: LockIcon },
		{ name: "Advanced", icon: SettingsIcon },
	];
	// Placeholder settings rows.
	const rows = Array.from({ length: 10 }, (_, index) => index);
	// The dialog starts open in this example.
	let open = $state(true);
</script>

<Dialog bind:open aria-label="Settings">
	<DialogTrigger size="sm">Open Dialog</DialogTrigger>
	<DialogContent class="settingsPanel" style="padding: 0; overflow: hidden">
		<!-- Own sidebar state for the dialog; the section list is a static sidebar, hidden on mobile. -->
		<SidebarProvider shortcut={false} style="align-items: flex-start; min-height: 0">
			<Sidebar collapsible="none" class="settingsNav">
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupContent>
							<SidebarMenu>
								{#each nav as item (item.name)}
									<SidebarMenuItem>
										<SidebarMenuButton href="#" isActive={item.name === "Messages & media"}>
											<item.icon />
											<span>{item.name}</span>
										</SidebarMenuButton>
									</SidebarMenuItem>
								{/each}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
			</Sidebar>

			<!-- Open section with its location and placeholder rows. -->
			<main class="settingsMain">
				<header class="settingsHeader">
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem class="hideOnMobile"><BreadcrumbLink href="#">Settings</BreadcrumbLink></BreadcrumbItem>
							<BreadcrumbSeparator class="hideOnMobile" />
							<BreadcrumbItem><BreadcrumbPage>Messages & media</BreadcrumbPage></BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</header>
				<div class="settingsBody">
					{#each rows as row (row)}
						<div class="settingsRow"></div>
					{/each}
				</div>
			</main>
		</SidebarProvider>
	</DialogContent>
</Dialog>

<style>
	/* Panel that fills small screens and caps its size on wider ones */
	:global(.dialog .content.settingsPanel) {
		width: 100%;
	}

	@media (min-width: 48rem) {
		:global(.dialog .content.settingsPanel) {
			width: 43.75rem; /* 700px */
			max-height: 31.25rem; /* 500px */
		}
	}

	@media (min-width: 64rem) {
		:global(.dialog .content.settingsPanel) {
			width: 50rem; /* 800px */
		}
	}

	/* The section list only shows from 48rem */
	:global(.settingsPanel .sidebar.sidebarStatic.settingsNav) {
		display: none;
	}

	@media (min-width: 48rem) {
		:global(.settingsPanel .sidebar.sidebarStatic.settingsNav) {
			display: flex;
		}
	}

	.settingsMain {
		display: flex;
		flex: 1;
		flex-direction: column;
		height: 30rem; /* 480px */
		overflow: hidden;
	}

	.settingsHeader {
		display: flex;
		flex-shrink: 0;
		align-items: center;
		gap: var(--spacing-sm);
		padding-inline: var(--spacing-lg);
		height: 4rem; /* 64px */
	}

	/* The parent crumb only shows on wider screens */
	@media (max-width: 47.99rem) {
		.settingsHeader :global(.hideOnMobile) {
			display: none;
		}
	}

	.settingsBody {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: var(--spacing-lg);
		padding: 0 var(--spacing-lg) var(--spacing-lg);
		overflow-y: auto;
	}

	.settingsRow {
		flex-shrink: 0;
		border-radius: var(--radius-xl);
		background-color: color-mix(in oklab, var(--muted) 50%, transparent);
		aspect-ratio: 16 / 9;
		max-width: 48rem; /* 768px */
	}
</style>
