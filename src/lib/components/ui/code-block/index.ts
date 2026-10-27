import type { AvailableShikiLangs } from "./core.js";

export { default as CodeBlock } from "./_.svelte";
export { default as CodeBlockCode } from "./code.svelte";
export { default as CodeBlockHeader } from "./header.svelte";
export { encodeAndDecodeString } from "./core.js";

/** Code to display and copy, with either a file `path` for language detection or an explicit Shiki `lang` */
export type CodeBlockData = { code: string; lang: AvailableShikiLangs; title?: string } | { code: string; path: string; title?: string };

/** Highlight theme: `auto` follows the `.dark` class on an ancestor, while `light` and `dark` force one theme */
export type CodeBlockTheme = "auto" | "light" | "dark";

/** 1-based lines to highlight, as an array such as `[2, 4]` or a range string such as `"1,3-5"` */
export type CodeBlockHighlightLines = number[] | string;

/** Code block root that shares its data with the header and code */
export interface Props extends CompPropsWithChild<"div"> {
	/** Header, code display, or other content */
	children: CompPropsWithChild<"div">["children"];
	/** Code and language metadata; `title` takes precedence over the header path label */
	data: CodeBlockData;
	/** Decodes `data.code` from UTF-8 Base64 before display and copying; malformed Base64 throws during decoding */
	usingEncodedData?: boolean;
	/** Highlight theme shared with the code; defaults to `auto`, which follows the `.dark` class on an ancestor */
	theme?: CodeBlockTheme;
	/** Lines to highlight, such as `[2, 4]` or `"1,3-5"`; shared with the code */
	highlightLines?: CodeBlockHighlightLines;
	/** Header height, code padding, and font size */
	size?: UiSize;
	/** Corner radius; follows `size` when omitted. `pill` is a true pill that can clip the content, so use `3xl` or `4xl` to stay round */
	rounded?: UiRounded;
	/** Classes merged onto the root container */
	class?: CompPropsWithChild<"div">["class"];
}

/** Code block header with the file label and copy button */
export interface HeaderProps extends CompProps<"header"> {
	/** Header label used after `data.title` and before `data.path`; a nonempty value also shows the header */
	path?: string;
	/** Classes merged onto the header */
	class?: CompProps<"header">["class"];
}

/** Highlighted code display */
export interface CodeProps extends CompProps<"div"> {
	/** Highlight theme; overrides the code block's `theme` */
	theme?: CodeBlockTheme;
	/** Lines to highlight, such as `[2, 4]` or `"1,3-5"`; overrides the code block's `highlightLines` */
	highlightLines?: CodeBlockHighlightLines;
	/** Classes merged onto the code container */
	class?: CompProps<"div">["class"];
}

export type CodeBlockProps = Props;
export type CodeBlockHeaderProps = HeaderProps;
export type CodeBlockCodeProps = CodeProps;
