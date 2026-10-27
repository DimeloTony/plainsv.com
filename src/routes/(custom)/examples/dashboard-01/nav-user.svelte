<script lang="ts">
	import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "#lib/components/ui/sidebar/index.js";
	import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "#lib/components/ui/dropdown-menu/index.js";
	import { Avatar, AvatarFallback } from "#lib/components/ui/avatar/index.js";
	import { EllipsisVerticalIcon, CircleUserRoundIcon, CreditCardIcon, BellIcon, LogOutIcon } from "@lucide/svelte";
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
						<Avatar size="sm" rounded="lg" style="filter: grayscale(1)"><AvatarFallback>{user.initials}</AvatarFallback></Avatar>
						<span class="userText">
							<strong>{user.name}</strong>
							<span>{user.email}</span>
						</span>
						<EllipsisVerticalIcon class="userEllipsis" />
					</SidebarMenuButton>
				{/snippet}
			</DropdownMenuTrigger>

			<!-- Account menu. -->
			<DropdownMenuContent style="min-width: 14rem">
				<DropdownMenuGroup>
					<DropdownMenuLabel>
						<span class="userLabel">
							<Avatar size="sm" rounded="lg"><AvatarFallback>{user.initials}</AvatarFallback></Avatar>
							<span class="userText">
								<strong>{user.name}</strong>
								<span class="mutedEmail">{user.email}</span>
							</span>
						</span>
					</DropdownMenuLabel>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem><CircleUserRoundIcon /> Account</DropdownMenuItem>
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
	.userText {
		display: flex;
		flex: 1;
		flex-direction: column;
		min-width: 0;
		font-size: var(--text-sm);
		line-height: 1.25;
		text-align: left;
	}

	.userText strong,
	.userText span {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.userText strong {
		font-weight: 500;
	}

	.userText span {
		color: color-mix(in oklab, var(--foreground) 70%, transparent);
		font-size: var(--text-xs);
	}

	.userText .mutedEmail {
		color: var(--muted-foreground);
	}

	/* Avatar and text in the menu heading */
	.userLabel {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		color: var(--foreground);
		font-weight: 400;
	}

	:global(.sidebar .sidebarMenuButton.userButton .userEllipsis) {
		margin-left: auto;
	}

	/* The button stays highlighted while its menu is open */
	:global(.sidebar .sidebarMenuButton.userButton[aria-expanded="true"]) {
		background-color: var(--muted);
	}
</style>
