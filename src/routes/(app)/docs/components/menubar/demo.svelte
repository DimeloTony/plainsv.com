<script lang="ts">
	import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarCheckboxItem, MenubarRadioGroup, MenubarRadioItem, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubTrigger, MenubarSubContent } from "#lib/components/ui/menubar/index.js";
	import { FileIcon, PencilIcon } from "@lucide/svelte";

	const { section = "preview" }: Props = $props();
	let showBookmarks = $state(false);
	let showFullUrls = $state(true);
	let profile = $state("benoit");

	/** Live preview for one section of the menubar docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "sizes" | "rounded" | "trigger";
	}
</script>

<!-- Small File and Edit bar reused by the size and rounded sections. -->
{#snippet smallBar(options: { size?: UiSize; rounded?: UiRounded })}
	<Menubar {...options}>
		<MenubarMenu>
			<MenubarTrigger>File</MenubarTrigger>
			<MenubarContent>
				<MenubarItem>New tab <MenubarShortcut>⌘T</MenubarShortcut></MenubarItem>
				<MenubarItem>Print... <MenubarShortcut>⌘P</MenubarShortcut></MenubarItem>
			</MenubarContent>
		</MenubarMenu>
		<MenubarMenu>
			<MenubarTrigger>Edit</MenubarTrigger>
			<MenubarContent>
				<MenubarItem>Undo <MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
				<MenubarItem>Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut></MenubarItem>
			</MenubarContent>
		</MenubarMenu>
	</Menubar>
{/snippet}

<div class="demo">
	{#if section === "preview"}
		<!-- File, Edit, View, and Profiles menus. -->
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger>File</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>New tab <MenubarShortcut>⌘T</MenubarShortcut></MenubarItem>
					<MenubarItem>New window <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
					<MenubarItem disabled>New incognito window</MenubarItem>
					<MenubarSeparator />
					<MenubarSub>
						<MenubarSubTrigger>Share</MenubarSubTrigger>
						<MenubarSubContent>
							<MenubarItem>Email link</MenubarItem>
							<MenubarItem>Messages</MenubarItem>
							<MenubarItem>Notes</MenubarItem>
						</MenubarSubContent>
					</MenubarSub>
					<MenubarSeparator />
					<MenubarItem>Print... <MenubarShortcut>⌘P</MenubarShortcut></MenubarItem>
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>Edit</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>Undo <MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
					<MenubarItem>Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut></MenubarItem>
					<MenubarSeparator />
					<MenubarItem>Cut</MenubarItem>
					<MenubarItem>Copy</MenubarItem>
					<MenubarItem>Paste</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>View</MenubarTrigger>
				<MenubarContent>
					<MenubarCheckboxItem bind:checked={showBookmarks}>Always show bookmarks bar</MenubarCheckboxItem>
					<MenubarCheckboxItem bind:checked={showFullUrls}>Always show full URLs</MenubarCheckboxItem>
					<MenubarSeparator />
					<MenubarItem inset>Reload <MenubarShortcut>⌘R</MenubarShortcut></MenubarItem>
					<MenubarItem inset>Toggle fullscreen</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>Profiles</MenubarTrigger>
				<MenubarContent>
					<MenubarRadioGroup bind:value={profile}>
						<MenubarRadioItem value="andy">Andy</MenubarRadioItem>
						<MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
						<MenubarRadioItem value="luis">Luis</MenubarRadioItem>
					</MenubarRadioGroup>
					<MenubarSeparator />
					<MenubarItem inset>Edit...</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	{:else if section === "sizes"}
		<!-- Each size of the bar and its menus. -->
		{#each ["xs", "sm", "md", "lg"] as const as size (size)}
			{@render smallBar({ size })}
		{/each}
	{:else if section === "rounded"}
		<!-- Each rounded value overriding the size radius. -->
		{#each ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"] as const as rounded (rounded)}
			{@render smallBar({ rounded })}
		{/each}
	{:else if section === "trigger"}
		<!-- Custom triggers with icons in place of the default buttons. -->
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger>
					{#snippet trigger({ props })}
						<button class="demoTrigger" type="button" {...props}>
							<FileIcon aria-hidden="true" />
							File
						</button>
					{/snippet}
				</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>New tab <MenubarShortcut>⌘T</MenubarShortcut></MenubarItem>
					<MenubarItem>New window <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
					<MenubarSeparator />
					<MenubarItem>Print... <MenubarShortcut>⌘P</MenubarShortcut></MenubarItem>
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>
					{#snippet trigger({ props })}
						<button class="demoTrigger" type="button" {...props}>
							<PencilIcon aria-hidden="true" />
							Edit
						</button>
					{/snippet}
				</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>Undo <MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
					<MenubarItem>Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut></MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--spacing-sm);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 1rem 0;
	}

	/* Custom trigger with a leading icon */
	.demoTrigger {
		display: inline-flex;
		align-items: center;
		gap: var(--spacing-xs);
		cursor: pointer;
		outline: none;
		border: 0;
		border-radius: var(--radius-sm);
		background-color: transparent;
		padding: var(--spacing-xs) var(--spacing-sm);
		color: inherit;
		font: inherit;
		font-weight: 500;
		font-size: var(--text-sm);
	}

	.demoTrigger :global(svg) {
		width: 0.875rem; /* 14px */
		height: 0.875rem; /* 14px */
		color: var(--muted-foreground);
	}

	.demoTrigger:focus-visible,
	.demoTrigger[data-state="open"] {
		background-color: var(--accent);
		color: var(--accent-foreground);
	}
</style>
