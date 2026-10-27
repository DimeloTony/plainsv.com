<script lang="ts">
	import { FileIcon, FileBracesIcon, FileCodeIcon, FileImageIcon, FileTerminalIcon, FileTextIcon, FolderIcon, FolderOpenIcon } from "@lucide/svelte";
	import { IconBrandCss3, IconBrandHtml5, IconBrandJavascript, IconBrandSvelte, IconBrandTypescript } from "@tabler/icons-svelte";
	import type { IconProps } from "./index.js";
	const { path, isFolder = false, open = false, class: className = "" }: IconProps = $props();
	// File icons by lowercase extension; any other extension uses the plain file icon.
	const ICONS_BY_EXTENSION: Record<string, typeof FileIcon | typeof IconBrandSvelte> = {
		svelte: IconBrandSvelte,
		ts: IconBrandTypescript,
		mts: IconBrandTypescript,
		cts: IconBrandTypescript,
		tsx: IconBrandTypescript,
		js: IconBrandJavascript,
		mjs: IconBrandJavascript,
		cjs: IconBrandJavascript,
		jsx: IconBrandJavascript,
		css: IconBrandCss3,
		html: IconBrandHtml5,
		json: FileBracesIcon,
		jsonc: FileBracesIcon,
		md: FileTextIcon,
		svx: FileTextIcon,
		txt: FileTextIcon,
		sh: FileTerminalIcon,
		bash: FileTerminalIcon,
		zsh: FileTerminalIcon,
		png: FileImageIcon,
		jpg: FileImageIcon,
		jpeg: FileImageIcon,
		gif: FileImageIcon,
		webp: FileImageIcon,
		avif: FileImageIcon,
		svg: FileImageIcon,
		ico: FileImageIcon,
		py: FileCodeIcon,
		go: FileCodeIcon,
		rs: FileCodeIcon,
		yaml: FileCodeIcon,
		yml: FileCodeIcon,
		toml: FileCodeIcon,
	};
	const extension = $derived(path.includes(".") ? (path.split(".").pop()?.toLowerCase() ?? "") : "");
	const Icon = $derived(isFolder ? (open ? FolderOpenIcon : FolderIcon) : (ICONS_BY_EXTENSION[extension] ?? FileIcon));
</script>

<!-- Decorative icon; the item name already says what it is. -->
<Icon class="fileTreeIcon {className}" aria-hidden="true" />

<style>
	/* Base icon; follows the tree size through `--file-tree-icon` */
	:global(svg.fileTreeIcon) {
		flex-shrink: 0;
		width: var(--file-tree-icon, 1rem);
		height: var(--file-tree-icon, 1rem);
		color: var(--muted-foreground);
	}
</style>
