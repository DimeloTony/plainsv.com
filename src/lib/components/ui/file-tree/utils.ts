/** A file or folder in the tree */
export interface FileTreeNode {
	/** Last segment of the path, shown as the label */
	name: string;
	/** Full path without leading or trailing slashes */
	path: string;
	/** Files and folders inside; set only on folders */
	children?: FileTreeNode[];
}

/** Builds a sorted tree from paths; a path that ends in `/`, or that other paths sit under, is a folder. */
export function buildFileTree(paths: Iterable<string>) {
	const root: FileTreeNode[] = [];
	for (const rawPath of paths) {
		// Drop empty segments, so leading, trailing, and double slashes add no nameless folders.
		const names = rawPath.split("/").filter(Boolean);
		const isFolderPath = rawPath.endsWith("/");
		let siblings = root;
		let path = "";
		for (const [index, name] of names.entries()) {
			path = path ? `${path}/${name}` : name;
			const isLast = index === names.length - 1;
			let node = siblings.find((sibling) => sibling.name === name);
			// If the segment is new: add it.
			if (!node) {
				node = { name, path };
				siblings.push(node);
			}
			// If the segment is the file itself: stop; anything else is a folder, even one first listed as a file.
			if (isLast && !isFolderPath) continue;
			node.children ??= [];
			siblings = node.children;
		}
	}
	return sortNodes(root);
}

/** Sorts folders before files, then by name with numbers in natural order, like VS Code. */
function sortNodes(nodes: FileTreeNode[]): FileTreeNode[] {
	nodes.sort((a, b) => {
		// If one is a folder and the other a file: the folder goes first.
		if (!a.children !== !b.children) return a.children ? -1 : 1;
		return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" });
	});
	for (const node of nodes) if (node.children) sortNodes(node.children);
	return nodes;
}

/** Lists the path of every folder in the tree. */
export function getFolderPaths(nodes: FileTreeNode[]): string[] {
	return nodes.flatMap((node) => (node.children ? [node.path, ...getFolderPaths(node.children)] : []));
}

/** Lists the paths of the items on screen in order, skipping the contents of closed folders. */
export function getVisiblePaths(nodes: FileTreeNode[], expanded: string[]): string[] {
	return nodes.flatMap((node) => (node.children && expanded.includes(node.path) ? [node.path, ...getVisiblePaths(node.children, expanded)] : [node.path]));
}

/** Lists the folder paths that contain a path, from the top down. */
export function getParentPaths(path: string) {
	const names = path.split("/").slice(0, -1);
	return names.map((_, index) => names.slice(0, index + 1).join("/"));
}
