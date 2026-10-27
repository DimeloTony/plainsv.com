<script lang="ts">
	import Item from "./item.svelte";
	import { untrack } from "svelte";
	import { setCompCtx } from "./ctx.svelte.js";
	import { buildFileTree, getFolderPaths } from "./utils.js";
	import type { Attachment } from "svelte/attachments";
	import type { Props } from "./index.js";
	import type { CompCtxProps } from "./ctx.svelte.js";
	let { files, value = $bindable(""), onValueChange, expanded = $bindable(), onExpandedChange, highlighted = [], disabled = false, icon, trailing, variant = "default", size = "md", rounded, class: className, ...props }: Props = $props();
	const tree = $derived(buildFileTree(Array.isArray(files) ? files : Object.keys(files)));
	const contextData: Omit<CompCtxProps, "value" | "expanded"> = $derived({ tree, highlighted: new Set(highlighted), disabled, icon, trailing, onValueChange, onExpandedChange });
	// Every folder starts open unless `expanded` is set.
	const ctx = setCompCtx({ ...contextData, value, expanded: expanded ?? getFolderPaths(tree) });

	// Keep the shared settings in sync when the props change.
	$effect.pre(() => void Object.assign(ctx, contextData));

	// Keep the bindable props and the shared state in sync in both directions.
	$effect.pre(() => void (ctx.value = value));
	$effect.pre(() => void (value = ctx.value));
	$effect.pre(() => {
		if (expanded) ctx.expanded = expanded;
	});
	$effect.pre(() => {
		expanded = ctx.expanded;
	});

	// Open the folders around the selected file, so a file selected from outside the tree is on screen; untracked so a folder can still be closed.
	$effect.pre(() => {
		const path = ctx.value;
		untrack(() => ctx.reveal(path));
	});

	/** Moves focus with the arrows, Home, and End, and opens, closes, or selects with the arrows, Enter, and Space. */
	const handleKeys: Attachment<HTMLUListElement> = (node) => {
		/** Handles a key on the focused item, following the WAI-ARIA tree pattern. */
		const handleKeydown = (e: KeyboardEvent) => {
			const path = e.target instanceof HTMLElement && e.target.role === "treeitem" ? e.target.dataset.path : undefined;
			// If focus is on a control inside an item rather than the item itself: leave the key to that control.
			if (path === undefined) return;
			const paths = ctx.visiblePaths;
			const index = paths.indexOf(path);
			const isFolder = e.target instanceof HTMLElement && e.target.hasAttribute("aria-expanded");
			const isOpen = ctx.isExpanded(path);
			let nextPath: string | undefined;
			switch (e.key) {
				case "ArrowDown":
					nextPath = paths[index + 1];
					break;
				case "ArrowUp":
					nextPath = paths[index - 1];
					break;
				case "Home":
					nextPath = paths[0];
					break;
				case "End":
					nextPath = paths.at(-1);
					break;
				case "ArrowRight":
					// If a closed folder: open it. If an open folder with items: move to its first item.
					if (isFolder && !isOpen) ctx.setExpanded(path, true);
					else if (isFolder && paths[index + 1]?.startsWith(`${path}/`)) nextPath = paths[index + 1];
					break;
				case "ArrowLeft":
					// If an open folder: close it. Otherwise: move to the parent folder, if any.
					if (isFolder && isOpen) ctx.setExpanded(path, false);
					else if (path.includes("/")) nextPath = path.slice(0, path.lastIndexOf("/"));
					break;
				case "Enter":
				case " ":
					if (isFolder) ctx.toggle(path);
					else ctx.select(path);
					break;
				default:
					return;
			}
			// Stop the page from scrolling on the handled keys.
			e.preventDefault();
			if (nextPath !== undefined) node.querySelector<HTMLElement>(`[data-path="${CSS.escape(nextPath)}"]`)?.focus();
		};
		/** Makes the focused item the tab stop, so Tab returns to it. */
		const handleFocusIn = (e: FocusEvent) => {
			// If focus moved to an item: remember it.
			if (e.target instanceof HTMLElement && e.target.role === "treeitem") ctx.focused = e.target.dataset.path ?? "";
		};

		node.addEventListener("keydown", handleKeydown);
		node.addEventListener("focusin", handleFocusIn);
		return () => {
			node.removeEventListener("keydown", handleKeydown);
			node.removeEventListener("focusin", handleFocusIn);
		};
	};
</script>

<!-- Tree of files and folders; the items render themselves and their folder contents. -->
<ul class={["fileTree not-typeset", className]} role="tree" aria-label="Files" data-variant={variant} data-size={size} data-rounded={rounded} data-disabled={disabled || undefined} {@attach handleKeys} {...props}>
	{#each ctx.tree as node (node.path)}
		<Item {node} />
	{/each}
</ul>

<style>
	/* Base tree */
	.fileTree {
		display: flex;
		flex-direction: column;
		margin: 0;
		padding: 0;
		color: var(--foreground);
		list-style: none;
	}

	/* =============== Variants =============== */

	/* Bordered card around the rows */
	.fileTree[data-variant="outline"] {
		border: 1px solid var(--border);
		background-color: var(--card);
		padding: var(--file-tree-padding);
		color: var(--card-foreground);
	}

	/* =============== Sizes =============== */

	/* Large */
	.fileTree[data-size="lg"] {
		--file-tree-icon: 1.25rem; /* 20px */
		--file-tree-gap: var(--spacing-sm);
		--file-tree-indent: 1.25rem; /* 20px */
		--file-tree-padding: var(--spacing-sm);
		--file-tree-padding-block: var(--spacing-xs);
		--file-tree-padding-inline: var(--spacing-sm);
		--file-tree-item-radius: var(--radius-md);
		border-radius: var(--radius-lg);
		font-size: var(--text-md);
		line-height: var(--line-height-md);
	}

	/* Medium — default */
	.fileTree[data-size="md"] {
		--file-tree-icon: 1rem; /* 16px */
		--file-tree-gap: calc(var(--spacing-xs) * 1.5); /* 6px */
		--file-tree-indent: 1rem; /* 16px */
		--file-tree-padding: var(--spacing-xs);
		--file-tree-padding-block: var(--spacing-xs);
		--file-tree-padding-inline: var(--spacing-sm);
		--file-tree-item-radius: var(--radius-sm);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Small */
	.fileTree[data-size="sm"] {
		--file-tree-icon: 0.875rem; /* 14px */
		--file-tree-gap: var(--spacing-xs);
		--file-tree-indent: 0.875rem; /* 14px */
		--file-tree-padding: var(--spacing-xs);
		--file-tree-padding-block: calc(var(--spacing-xs) / 2);
		--file-tree-padding-inline: calc(var(--spacing-xs) * 1.5); /* 6px */
		--file-tree-item-radius: var(--radius-xs);
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Extra small */
	.fileTree[data-size="xs"] {
		--file-tree-icon: 0.75rem; /* 12px */
		--file-tree-gap: var(--spacing-xs);
		--file-tree-indent: 0.75rem; /* 12px */
		--file-tree-padding: calc(var(--spacing-xs) / 2);
		--file-tree-padding-block: calc(var(--spacing-xs) / 2);
		--file-tree-padding-inline: var(--spacing-xs);
		--file-tree-item-radius: var(--radius-xs);
		border-radius: var(--radius-xs);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius; must stay after the size rules. Rows use one step smaller so the corners nest */
	.fileTree[data-rounded="xs"] {
		--file-tree-item-radius: var(--radius-xs);
		border-radius: var(--radius-xs);
	}

	.fileTree[data-rounded="sm"] {
		--file-tree-item-radius: var(--radius-xs);
		border-radius: var(--radius-sm);
	}

	.fileTree[data-rounded="md"] {
		--file-tree-item-radius: var(--radius-sm);
		border-radius: var(--radius-md);
	}

	.fileTree[data-rounded="lg"] {
		--file-tree-item-radius: var(--radius-md);
		border-radius: var(--radius-lg);
	}

	.fileTree[data-rounded="xl"] {
		--file-tree-item-radius: var(--radius-lg);
		border-radius: var(--radius-xl);
	}

	.fileTree[data-rounded="2xl"] {
		--file-tree-item-radius: var(--radius-xl);
		border-radius: var(--radius-2xl);
	}

	.fileTree[data-rounded="3xl"] {
		--file-tree-item-radius: var(--radius-2xl);
		border-radius: var(--radius-3xl);
	}

	.fileTree[data-rounded="4xl"] {
		--file-tree-item-radius: var(--radius-3xl);
		border-radius: var(--radius-4xl);
	}

	/* The box and rows become pills; a tall pill box clips its rows, so use 3xl or 4xl for a round box */
	.fileTree[data-rounded="pill"] {
		--file-tree-item-radius: var(--radius-pill);
		border-radius: var(--radius-pill);
	}
</style>
