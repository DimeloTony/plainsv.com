<script lang="ts">
	import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "#lib/components/ui/sidebar/index.js";
	import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "#lib/components/ui/dropdown-menu/index.js";
	import { Avatar, AvatarFallback } from "#lib/components/ui/avatar/index.js";
	import { ChevronsUpDownIcon, SparklesIcon, BadgeCheckIcon, CreditCardIcon, BellIcon, LogOutIcon } from "@lucide/svelte";
	const { user }: Props = $props();
	const sidebar = useSidebar();
	/** Signed-in user shown in the sidebar footer */
	interface Props {
		/** Name, email, and avatar initials */
		user: { name: string; email: string; initials: string };
	}
</script>

<SidebarMenu>
	<SidebarMenuItem>
		<DropdownMenu side={sidebar.isMobile ? "bottom" : "right"} align="end" sideOffset={4}>
			<!-- User button with the avatar, name, and email. -->
			<DropdownMenuTrigger>
				{#snippet trigger({ props })}
					<SidebarMenuButton size="lg" class="userButton" {...props}>
						<Avatar size="sm" rounded="lg"><AvatarFallback>{user.initials}</AvatarFallback></Avatar>
						<span class="twoLines">
							<strong>{user.name}</strong>
							<span>{user.email}</span>
						</span>
						<ChevronsUpDownIcon class="userChevron" />
					</SidebarMenuButton>
				{/snippet}
			</DropdownMenuTrigger>

			<!-- Account menu. -->
			<DropdownMenuContent style="min-width: 14rem">
				<DropdownMenuGroup>
					<DropdownMenuLabel>
						<span class="userLabel">
							<Avatar size="sm" rounded="lg"><AvatarFallback>{user.initials}</AvatarFallback></Avatar>
							<span class="twoLines">
								<strong>{user.name}</strong>
								<span>{user.email}</span>
							</span>
						</span>
					</DropdownMenuLabel>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem><SparklesIcon /> Upgrade to Pro</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem><BadgeCheckIcon /> Account</DropdownMenuItem>
					<DropdownMenuItem><CreditCardIcon /> Billing</DropdownMenuItem>
					<DropdownMenuItem><BellIcon /> Notifications</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem><LogOutIcon /> Log out</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	</SidebarMenuItem>
</SidebarMenu>

<style>
	/* Name above the email, both truncated */
	.twoLines {
		display: flex;
		flex: 1;
		flex-direction: column;
		min-width: 0;
		font-size: var(--text-sm);
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

	/* Avatar and text in the menu heading */
	.userLabel {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		color: var(--foreground);
		font-weight: 400;
	}

	:global(.sidebar .sidebarMenuButton.userButton .userChevron) {
		margin-left: auto;
	}

	/* The button stays highlighted while its menu is open */
	:global(.sidebar .sidebarMenuButton.userButton[aria-expanded="true"]) {
		background-color: var(--muted);
		color: var(--foreground);
	}
</style>
