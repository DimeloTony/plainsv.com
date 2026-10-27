<script lang="ts">
	import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarRail, type SidebarProps } from "#lib/components/ui/sidebar/index.js";
	import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "#lib/components/ui/collapsible/index.js";
	import { ChevronRightIcon, FileIcon, FolderIcon } from "@lucide/svelte";
	const { ...props }: Omit<SidebarProps, "children"> = $props();
	// Changed files with their git state.
	const changes = [
		{ file: "README.md", state: "M" },
		{ file: "api/hello/route.ts", state: "U" },
		{ file: "app/layout.tsx", state: "M" },
	];
	// A file is its name; a folder is its name followed by its children.
	const tree: TreeItem[] = [["app", ["api", ["hello", ["route.ts"]], "page.tsx", "layout.tsx", ["blog", ["page.tsx"]]]], ["components", ["ui", "button.tsx", "card.tsx"], "header.tsx", "footer.tsx"], ["lib", ["util.ts"]], ["public", "favicon.ico", "vercel.svg"], ".eslintrc.json", ".gitignore", "next.config.js", "tailwind.config.js", "package.json", "README.md"];

	/** Splits a tree item into its name and children; a file has no children. */
	function splitItem(item: TreeItem) {
		// If the item is a file: it is only a name.
		if (typeof item === "string") return { name: item, children: [] };
		const [name, ...children] = item;
		return { name, children };
	}

	/** A file name, or a folder name followed by its children */
	type TreeItem = string | [string, ...TreeItem[]];
</script>

<!-- One file or folder; a folder expands into its children with the same snippet. -->
{#snippet treeItem(item: TreeItem)}
	{@const { name, children } = splitItem(item)}
	<SidebarMenuItem>
		{#if !children.length}
			<SidebarMenuButton isActive={name === "button.tsx"} class="fileButton">
				<FileIcon />
				<span>{name}</span>
			</SidebarMenuButton>
		{:else}
			<Collapsible defaultOpen={name === "components" || name === "ui"}>
				<CollapsibleTrigger>
					{#snippet trigger({ props: triggerProps })}
						<SidebarMenuButton class="folderButton" {...triggerProps}>
							<ChevronRightIcon class="folderChevron" />
							<FolderIcon />
							<span>{name}</span>
						</SidebarMenuButton>
					{/snippet}
				</CollapsibleTrigger>
				<CollapsibleContent>
					<SidebarMenuSub>
						{#each children as child, index (index)}
							{@render treeItem(child)}
						{/each}
					</SidebarMenuSub>
				</CollapsibleContent>
			</Collapsible>
		{/if}
	</SidebarMenuItem>
{/snippet}

<Sidebar {...props}>
	<SidebarContent>
		<!-- Changed files with their state. -->
		<SidebarGroup>
			<SidebarGroupLabel>Changes</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu>
					{#each changes as item (item.file)}
						<SidebarMenuItem>
							<SidebarMenuButton>
								<FileIcon />
								<span>{item.file}</span>
							</SidebarMenuButton>
							<SidebarMenuBadge>{item.state}</SidebarMenuBadge>
						</SidebarMenuItem>
					{/each}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>

		<!-- File tree. -->
		<SidebarGroup>
			<SidebarGroupLabel>Files</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu>
					{#each tree as item, index (index)}
						{@render treeItem(item)}
					{/each}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	</SidebarContent>
	<SidebarRail />
</Sidebar>

<style>
	/* The open file stays bold without a background */
	:global(.sidebar .sidebarMenuButton.fileButton[data-active]) {
		background-color: transparent;
	}

	/* The folder chevron points down while the folder is open */
	:global(.sidebar .sidebarMenuButton.folderButton .folderChevron) {
		transition: transform 200ms ease;
	}

	:global(.sidebar .sidebarMenuButton.folderButton[data-state="open"] .folderChevron) {
		transform: rotate(90deg);
	}
</style>
