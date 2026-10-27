<script lang="ts">
	import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "#lib/components/ui/dropdown-menu/index.js";
	import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "#lib/components/ui/sidebar/index.js";
	import { GalleryVerticalEndIcon, ChevronsUpDownIcon, CheckIcon } from "@lucide/svelte";
	const { versions, defaultVersion }: Props = $props();
	// The starting version only seeds the selection; picking a version changes it after that.
	let selectedVersion = $state(defaultVersion);
	/** Docs versions to pick from and the one selected first */
	interface Props {
		/** Every version in the menu */
		versions: string[];
		/** Version selected when the page loads */
		defaultVersion: string;
	}
</script>

<SidebarMenu>
	<SidebarMenuItem>
		<DropdownMenu align="start">
			<!-- Large menu button with the docs logo and the selected version. -->
			<DropdownMenuTrigger>
				{#snippet trigger({ props })}
					<SidebarMenuButton size="lg" class="versionButton" {...props}>
						<span class="docsLogo"><GalleryVerticalEndIcon /></span>
						<span class="docsTitle">
							<strong>Documentation</strong>
							<span>v{selectedVersion}</span>
						</span>
						<ChevronsUpDownIcon class="versionChevron" />
					</SidebarMenuButton>
				{/snippet}
			</DropdownMenuTrigger>

			<!-- Versions, with a check on the selected one. -->
			<DropdownMenuContent style="min-width: 14rem">
				{#each versions as version (version)}
					<DropdownMenuItem onSelect={() => (selectedVersion = version)}>
						v{version}
						{#if version === selectedVersion}
							<CheckIcon class="versionCheck" />
						{/if}
					</DropdownMenuItem>
				{/each}
			</DropdownMenuContent>
		</DropdownMenu>
	</SidebarMenuItem>
</SidebarMenu>

<style>
	/* Square docs logo */
	.docsLogo {
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

	.docsLogo :global(svg) {
		width: 1rem; /* 16px */
		height: 1rem; /* 16px */
	}

	/* Name above the version */
	.docsTitle {
		display: flex;
		flex-direction: column;
		gap: calc(var(--spacing-xs) / 2);
		line-height: 1;
	}

	.docsTitle strong {
		font-weight: 500;
	}

	/* Icons pushed to the end of the button and the item */
	:global(.versionChevron),
	:global(.versionCheck) {
		margin-left: auto;
	}

	/* The button stays highlighted while its menu is open */
	:global(.sidebarMenuButton.versionButton[data-state="open"]) {
		background-color: var(--sidebar-accent);
		color: var(--sidebar-accent-foreground);
	}
</style>
