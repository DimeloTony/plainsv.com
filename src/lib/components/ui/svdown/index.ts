import type { Tokens } from "marked";
import type { FilesToken } from "./core.js";

export { default as Svdown } from "./_.svelte";
export { svdownMarked, getSvdownTokens, getFilesBlockDataFromSvdown, getCodeBlockLangData, getSafeUrl } from "./core.js";
export type { SvdownToken, SimpleToken, FilesToken } from "./core.js";

/** Renders Markdown from an AI response as it streams, including `<SvPlan>`, `<SvThink>`, and `<SvFiles>` blocks */
export interface Props extends CompProps<"div"> {
	/** Markdown source; append to it as the response streams */
	content: string;
	/** Shows new text at once instead of typing it out; reduced motion always shows it at once */
	removeAnimation?: boolean;
	/** Renders raw HTML in the Markdown; off by default, so HTML shows as text and cannot run scripts */
	allowHtml?: boolean;
	/** Called with a file's path when it is clicked in the default files list */
	onFileClick?: (path: string) => void;
	/** Called with the files block while it is still streaming */
	onFiles?: (data: FilesToken) => void;
	/** Replaces the default files list for each files block */
	renderFiles?: Snippet<[FilesToken]>;
	/** Renders tokens from Marked extensions you add with `svdownMarked.use()` */
	renderCustom?: Snippet<[Tokens.Generic]>;
	/** Typeset text size, spacing between blocks, and the size of the code blocks and activities; defaults to `md` */
	size?: UiSize;
	/** Classes merged onto the root */
	class?: CompProps<"div">["class"];
}

export type SvdownProps = Props;
