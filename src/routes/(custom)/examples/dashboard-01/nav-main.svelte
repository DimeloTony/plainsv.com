<script lang="ts">
	import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "#lib/components/ui/sidebar/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { CirclePlusIcon, MailIcon } from "@lucide/svelte";
	const { items }: Props = $props();
	/** Main navigation links */
	interface Props {
		/** Links with their icons */
		items: { title: string; url: string; icon: Component }[];
	}
</script>

<SidebarGroup>
	<SidebarGroupContent style="display: flex; flex-direction: column; gap: var(--spacing-sm)">
		<!-- Quick create action beside the inbox button. -->
		<SidebarMenu>
			<SidebarMenuItem style="display: flex; align-items: center; gap: var(--spacing-sm)">
				<SidebarMenuButton tooltip="Quick Create" class="quickCreate">
					<CirclePlusIcon />
					<span>Quick Create</span>
				</SidebarMenuButton>
				<Button size="icon-sm" variant="outline" aria-label="Inbox"><MailIcon /></Button>
			</SidebarMenuItem>
		</SidebarMenu>

		<!-- Main links. -->
		<SidebarMenu>
			{#each items as item (item.title)}
				<SidebarMenuItem>
					<SidebarMenuButton tooltip={item.title}>
						<item.icon />
						<span>{item.title}</span>
					</SidebarMenuButton>
				</SidebarMenuItem>
			{/each}
		</SidebarMenu>
	</SidebarGroupContent>
</SidebarGroup>

<style>
	/* Primary filled button for the quick create action */
	:global(.sidebar .sidebarMenuButton.quickCreate) {
		transition-duration: 200ms;
		background-color: var(--primary);
		min-width: var(--control-height-sm);
		color: var(--primary-foreground);
	}

	:global(.sidebar .sidebarMenuButton.quickCreate:hover),
	:global(.sidebar .sidebarMenuButton.quickCreate:active) {
		background-color: color-mix(in oklab, var(--primary) 90%, transparent);
		color: var(--primary-foreground);
	}
</style>
