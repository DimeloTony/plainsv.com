<script lang="ts">
	import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuCheckboxItem, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuShortcut, ContextMenuSub, ContextMenuSubTrigger, ContextMenuSubContent } from "#lib/components/ui/context-menu/index.js";
	import { FileTextIcon } from "@lucide/svelte";

	const { section = "preview" }: Props = $props();
	const sizes = ["xs", "sm", "md", "lg"] as const;
	const roundedValues = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"] as const;
	let showBookmarks = $state(true);
	let showFullUrls = $state(false);
	let person = $state("pedro");
	let open = $state(false);
	let lastAction = $state("none");

	/** Live preview for one section of the context menu docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "disabled" | "controlled" | "sizes" | "rounded" | "trigger";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Right-click area with every kind of item. -->
		<ContextMenu>
			<ContextMenuTrigger class="demoArea">Right click here</ContextMenuTrigger>
			<ContextMenuContent style="width: 13rem">
				<ContextMenuItem inset>Back <ContextMenuShortcut>⌘[</ContextMenuShortcut></ContextMenuItem>
				<ContextMenuItem inset disabled>Forward <ContextMenuShortcut>⌘]</ContextMenuShortcut></ContextMenuItem>
				<ContextMenuItem inset>Reload <ContextMenuShortcut>⌘R</ContextMenuShortcut></ContextMenuItem>
				<ContextMenuSub>
					<ContextMenuSubTrigger inset>More tools</ContextMenuSubTrigger>
					<ContextMenuSubContent>
						<ContextMenuItem>Save page...</ContextMenuItem>
						<ContextMenuItem>Create shortcut...</ContextMenuItem>
						<ContextMenuSeparator />
						<ContextMenuItem>Developer tools</ContextMenuItem>
					</ContextMenuSubContent>
				</ContextMenuSub>
				<ContextMenuSeparator />
				<ContextMenuCheckboxItem bind:checked={showBookmarks}>Show bookmarks</ContextMenuCheckboxItem>
				<ContextMenuCheckboxItem bind:checked={showFullUrls}>Show full URLs</ContextMenuCheckboxItem>
				<ContextMenuSeparator />
				<ContextMenuRadioGroup bind:value={person}>
					<ContextMenuLabel inset>People</ContextMenuLabel>
					<ContextMenuRadioItem value="pedro">Pedro Duarte</ContextMenuRadioItem>
					<ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
				</ContextMenuRadioGroup>
			</ContextMenuContent>
		</ContextMenu>
	{:else if section === "disabled"}
		<!-- Disabled area that keeps the browser menu. -->
		<ContextMenu>
			<ContextMenuTrigger class="demoArea" disabled>Browser menu here</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuItem>Never shown</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	{:else if section === "controlled"}
		<!-- Bound open state and the last chosen action. -->
		<ContextMenu bind:open>
			<ContextMenuTrigger class="demoArea">Right click here</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuItem onSelect={() => (lastAction = "copy")}>Copy</ContextMenuItem>
				<ContextMenuItem onSelect={() => (lastAction = "paste")}>Paste</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
		<p class="demoText">Open: {open ? "yes" : "no"}, last action: {lastAction}</p>
	{:else if section === "sizes"}
		<!-- Each size of the menu. -->
		<div class="demoRow">
			{#each sizes as size (size)}
				<ContextMenu {size}>
					<ContextMenuTrigger class="demoArea demoSmall">Size {size}</ContextMenuTrigger>
					<ContextMenuContent>
						<ContextMenuItem>Back <ContextMenuShortcut>⌘[</ContextMenuShortcut></ContextMenuItem>
						<ContextMenuCheckboxItem checked>Show bookmarks</ContextMenuCheckboxItem>
					</ContextMenuContent>
				</ContextMenu>
			{/each}
		</div>
	{:else if section === "rounded"}
		<!-- Each rounded value overriding the size radius. -->
		<div class="demoRow">
			{#each roundedValues as rounded (rounded)}
				<ContextMenu {rounded}>
					<ContextMenuTrigger class="demoArea demoSmall">Rounded {rounded}</ContextMenuTrigger>
					<ContextMenuContent>
						<ContextMenuItem>Back</ContextMenuItem>
						<ContextMenuItem>Reload</ContextMenuItem>
					</ContextMenuContent>
				</ContextMenu>
			{/each}
		</div>
	{:else if section === "trigger"}
		<!-- File button that opens the menu in place of the default area. -->
		<ContextMenu>
			<ContextMenuTrigger>
				{#snippet trigger({ props })}
					<button class="demoFile" type="button" {...props}>
						<FileTextIcon aria-hidden="true" />
						report.pdf
					</button>
				{/snippet}
			</ContextMenuTrigger>
			<ContextMenuContent style="width: 12rem">
				<ContextMenuItem>Open</ContextMenuItem>
				<ContextMenuItem>Rename</ContextMenuItem>
				<ContextMenuSeparator />
				<ContextMenuItem>Delete</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
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

	.demo :global(.demoArea) {
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1px dashed var(--border);
		border-radius: var(--radius-md);
		width: 100%;
		max-width: 18rem;
		height: 9rem;
		font-size: var(--text-sm);
	}

	.demoRow {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-sm);
		width: 100%;
	}

	.demo :global(.demoSmall) {
		width: 8rem;
		height: 5rem;
	}

	.demoText {
		margin: 0;
		color: var(--muted-foreground);
		font-size: var(--text-sm);
	}

	/* Custom trigger shaped like a file */
	.demoFile {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-sm);
		cursor: default;
		outline: none;
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		background-color: transparent;
		padding: var(--spacing-lg) var(--spacing-xl);
		color: inherit;
		font: inherit;
		font-size: var(--text-sm);
	}

	.demoFile :global(svg) {
		width: 2rem; /* 32px */
		height: 2rem; /* 32px */
		color: var(--muted-foreground);
	}

	.demoFile:focus-visible,
	.demoFile[data-state="open"] {
		background-color: var(--accent);
	}
</style>
