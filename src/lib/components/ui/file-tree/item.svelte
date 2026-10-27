<script lang="ts">
	import Item from "./item.svelte";
	import Icon from "./icon.svelte";
	import { slide } from "svelte/transition";
	import { ChevronRightIcon } from "@lucide/svelte";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { FileTreeNode } from "./utils.js";
	const { node, depth = 0 }: Props = $props();
	const ctx = useCompCtx();
	// Skip the height animation for people who ask for less motion.
	const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	// Clicks on these elements belong to them, such as a button in the `trailing` snippet or a nested item.
	const OWN_CLICK_SELECTOR = "[role='treeitem'], a, button, input, select, textarea";
	const isFolder = $derived(node.children !== undefined);
	const open = $derived(isFolder && ctx.isExpanded(node.path));
	const selected = $derived(!isFolder && ctx.value === node.path);
	const isDisabled = $derived(!isFolder && ctx.disabled);
	const snippetProps = $derived({ path: node.path, isFolder, open, selected });

	/** Opens or closes the folder, or selects the file, when its own row is clicked. */
	const handleClick = (e: MouseEvent & { currentTarget: EventTarget & HTMLLIElement }) => {
		// If the click came from a nested item or a control inside the row: leave it to that element.
		if (e.target instanceof Element && e.target.closest(OWN_CLICK_SELECTOR) !== e.currentTarget) return;
		if (isFolder) ctx.toggle(node.path);
		else ctx.select(node.path);
	};

	/** One file or folder in the tree */
	interface Props {
		/** File or folder to render */
		node: FileTreeNode;
		/** Nesting level, starting at 0, that sets the indent */
		depth?: number;
	}
</script>

<!-- One file or folder; only the tab stop is in the Tab order, and the tree moves focus with the arrows. -->
<!-- The tree root handles the keys for every item, which this check cannot see. -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<li class="fileTreeItem" role="treeitem" tabindex={ctx.tabStop === node.path ? 0 : -1} aria-level={depth + 1} aria-expanded={isFolder ? open : undefined} aria-selected={isFolder ? undefined : selected} aria-disabled={isDisabled || undefined} data-path={node.path} style:--file-tree-depth={depth} onclick={handleClick}>
	<!-- Row with the chevron, icon, name, and trailing content. -->
	<div class="fileTreeRow" title={node.path} data-folder={isFolder || undefined} data-selected={selected || undefined} data-highlighted={ctx.highlighted.has(node.path) || undefined} data-disabled={isDisabled || undefined}>
		{#if isFolder}
			<ChevronRightIcon class="fileTreeChevron" aria-hidden="true" />
		{/if}
		{#if ctx.icon}
			{@render ctx.icon(snippetProps)}
		{:else}
			<Icon path={node.path} {isFolder} {open} />
		{/if}
		<span class="fileTreeName">{node.name}</span>
		{#if ctx.trailing}
			{@render ctx.trailing(snippetProps)}
		{/if}
	</div>

	<!-- Contents of an open folder. -->
	{#if node.children && open}
		<ul class="fileTreeGroup" role="group" transition:slide={{ duration: prefersReducedMotion ? 0 : 150 }}>
			{#each node.children as child (child.path)}
				<Item node={child} depth={depth + 1} />
			{/each}
		</ul>
	{/if}
</li>

<style>
	/* Base item; its row shows the focus ring */
	.fileTreeItem {
		outline: none;
		list-style: none;
	}

	/* Row indented by depth; sizes come from the tree through `--file-tree-*` */
	.fileTreeRow {
		display: flex;
		align-items: center;
		gap: var(--file-tree-gap);
		transition-duration: 150ms;
		transition-property: color, background-color, box-shadow;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		cursor: pointer;
		border-radius: var(--file-tree-item-radius);
		padding-inline: calc(var(--file-tree-padding-inline) + var(--file-tree-depth) * var(--file-tree-indent)) var(--file-tree-padding-inline);
		padding-block: var(--file-tree-padding-block);
		user-select: none;
	}

	/* Files leave the chevron space empty, so their names line up with folder names */
	.fileTreeRow:not([data-folder]) {
		padding-inline-start: calc(var(--file-tree-padding-inline) + var(--file-tree-depth) * var(--file-tree-indent) + var(--file-tree-icon) + var(--file-tree-gap));
	}

	/* Chevron that turns to point down while the folder is open */
	.fileTreeRow :global(.fileTreeChevron) {
		flex-shrink: 0;
		transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
		width: var(--file-tree-icon);
		height: var(--file-tree-icon);
		color: var(--muted-foreground);
	}

	.fileTreeItem[aria-expanded="true"] > .fileTreeRow :global(.fileTreeChevron) {
		transform: rotate(90deg);
	}

	/* If the user prefers reduced motion: turn the chevron without animating. */
	@media (prefers-reduced-motion: reduce) {
		.fileTreeRow :global(.fileTreeChevron) {
			transition: none;
		}
	}

	/* Long names end with an ellipsis; the full path shows on hover */
	.fileTreeName {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/* Open folder contents, with a guide line under the folder's chevron */
	.fileTreeGroup {
		display: flex;
		position: relative;
		flex-direction: column;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.fileTreeGroup::before {
		position: absolute;
		top: 0;
		bottom: 0;
		left: calc(var(--file-tree-padding-inline) + var(--file-tree-depth) * var(--file-tree-indent) + var(--file-tree-icon) / 2);
		z-index: 1;
		background-color: color-mix(in oklab, var(--border) 40%, transparent);
		width: 1px;
		pointer-events: none;
		content: "";
	}

	.fileTreeItem:hover > .fileTreeGroup::before {
		background-color: var(--border);
	}

	/* =============== States =============== */

	.fileTreeRow:hover {
		background-color: color-mix(in oklab, var(--accent) 50%, transparent);
		color: var(--accent-foreground);
	}

	/* Selected file */
	.fileTreeRow[data-selected] {
		background-color: var(--accent);
		color: var(--accent-foreground);
	}

	/* Highlighted path, such as a search match */
	.fileTreeRow[data-highlighted] {
		background-color: color-mix(in oklab, var(--primary) 10%, transparent);
		color: var(--primary);
	}

	/* File selection is blocked; folders still open and close */
	.fileTreeRow[data-disabled] {
		cursor: default;
		color: var(--muted-foreground);
	}

	.fileTreeRow[data-disabled]:hover {
		background-color: transparent;
	}

	/* Keyboard focus ring, inset so neighboring rows do not cover it */
	.fileTreeItem:focus-visible > .fileTreeRow {
		box-shadow: inset 0 0 0 2px color-mix(in oklab, var(--ring) 50%, transparent);
	}
</style>
