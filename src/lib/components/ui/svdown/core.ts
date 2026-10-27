import { Marked } from "marked";
import { availableShikiLangs, getFileLangFromPath, getHighlightLinesFromInfo, type AvailableShikiLangs } from "#lib/components/ui/code-block/core.js";
import type { MarkedToken, Token, Tokens, TokenizerExtension } from "marked";

/** Marked instance with the SvPlan, SvThink, and SvFiles extensions; call `.use()` on it to add your own */
export const svdownMarked = new Marked();

// Every type Marked's own lexer produces, so other tokens can be told apart from them.
const MARKED_TOKEN_TYPES = new Set(["blockquote", "br", "checkbox", "code", "codespan", "def", "del", "em", "escape", "heading", "hr", "html", "image", "link", "list", "list_item", "paragraph", "space", "strong", "table", "text"]);

// URL schemes that are safe to put in an `href` or `src`; anything else, such as `javascript:`, is dropped.
const SAFE_URL_SCHEMES = new Set(["http:", "https:", "mailto:", "tel:"]);

/** Parses complete or streamed `<SvPlan>` and `<SvThink>` blocks into activity tokens. */
const activityExtension: TokenizerExtension = {
	name: "simple",
	level: "block",
	start(src) {
		return src.match(/<Sv(?:Plan|Think)>/i)?.index;
	},
	tokenizer(src): SimpleToken | undefined {
		const match = src.match(/^<(SvPlan|SvThink)>([\s\S]*?)(?:<\/\1>|$)/i);
		// If the source does not start with an activity block: let Marked try other rules.
		if (!match) return;
		const tag = match[1].toLowerCase();
		const isPlan = tag === "svplan";
		return {
			type: "simple",
			action: isPlan ? "plan" : "thinking",
			title: isPlan ? "Planning" : "Thinking",
			titleDone: isPlan ? "Planned" : "Thoughts",
			done: match[0].toLowerCase().endsWith(`</${tag}>`),
			raw: match[0],
			text: match[2].trim(),
		};
	},
};

/** Parses complete or streamed `<SvFiles>` blocks into files tokens. */
const filesExtension: TokenizerExtension = {
	name: "files",
	level: "block",
	start(src) {
		return src.match(/<SvFiles/i)?.index;
	},
	tokenizer(src) {
		return getFilesBlockDataFromSvdown(src, true);
	},
};

svdownMarked.use({ extensions: [activityExtension, filesExtension] });

/** Reads the first `<SvFiles>` block in the Markdown, complete or still streaming. */
export const getFilesBlockDataFromSvdown = (markdown: string, extensionMode = false): FilesToken | undefined => {
	// Marked passes the source already sliced to the block, so the extension anchors the match to the start.
	const rule = extensionMode ? /^<SvFiles(?:\s+title=["']([^"']+)["'])?\s*>([\s\S]*?)(?:<\/SvFiles>|$)/i : /<SvFiles(?:\s+title=["']([^"']+)["'])?\s*>([\s\S]*?)(?:<\/SvFiles>|$)/i;
	const match = markdown.match(rule);
	// If there is no files block: there is nothing to read.
	if (!match) return;
	const [raw, title = "", content] = match;
	const files: FilesToken["files"] = {};
	const codeBlocks = Array.from(content.matchAll(/```(\w+)\s+path=["']([^"']+)["']\s*\n([\s\S]*?)(?:```|$)/g));
	// Add each code block that has a language, a path, and code; the last one is the file being written.
	for (const [, lang, path, code] of codeBlocks) {
		if (lang && path && code) files[path] = { code, lang };
	}
	return { type: "files", done: /<\/SvFiles>$/i.test(raw), files, title, latestFile: codeBlocks.at(-1)?.[2] ?? "", raw, text: content };
};

/** Splits Markdown into tokens, and finds the first files block. */
export const getSvdownTokens = (content: string) => {
	const tokens: SvdownToken[] = svdownMarked.lexer(content);
	const filesToken = tokens.find(isFilesToken);
	return { tokens, filesToken };
};

/** Reads the language, optional file path, and optional line highlights from a code fence info string, such as `ts path="src/app.ts" {1,3-5}`. */
export const getCodeBlockLangData = (rawLang = "") => {
	const { highlightLines, info } = getHighlightLinesFromInfo(rawLang);
	const [lang = "", rawPath = ""] = info.split(/\s+/);
	const path = rawPath.match(/^(?:path=)?["'](.+?)["']$/)?.[1] ?? rawPath;
	// Use the language when highlighting supports it, such as `ts` for `typescript`, and plain bash otherwise.
	const shikiLang: AvailableShikiLangs = availableShikiLangs.find((option) => option === lang) ?? getFileLangFromPath(`.${lang}`) ?? "bash";
	return { lang: shikiLang, path, highlightLines };
};

/** Returns the URL when it is relative or uses a safe scheme, and undefined otherwise. */
export const getSafeUrl = (url: string) => {
	const scheme = url
		.trim()
		.match(/^([a-z][a-z\d+.-]*:)/i)?.[1]
		.toLowerCase();
	// If the URL has no scheme, such as `/docs` or `#intro`: it stays on this site.
	if (!scheme) return url;
	return SAFE_URL_SCHEMES.has(scheme) ? url : undefined;
};

/** Whether text is the start of a custom Sv tag still streaming in, such as `<Sv` or `<SvFi`. */
export const isPartialSvTag = (text: string) => /^<\/?(s(v\w*)?)?$/i.test(text.trim()) || /^<\/?sv/i.test(text.trim());

/** Whether a token is one of Marked's own types. */
export const isMarkedToken = (token: Token | SvdownToken): token is MarkedToken => MARKED_TOKEN_TYPES.has(token.type);

/** Whether a token is a `<SvPlan>` or `<SvThink>` activity. */
export const isSimpleToken = (token: SvdownToken): token is SimpleToken => token.type === "simple";

/** Whether a token is a `<SvFiles>` block. */
export const isFilesToken = (token: SvdownToken): token is FilesToken => token.type === "files";

/** Keeps Marked's own tokens, such as the children of a paragraph. */
export const toMarkedTokens = (tokens: Token[] = []) => tokens.filter(isMarkedToken);

/** A `<SvPlan>` or `<SvThink>` block */
export interface SimpleToken {
	/** Token type */
	type: "simple";
	/** Which tag it came from */
	action: "plan" | "thinking";
	/** Whether the closing tag has arrived */
	done: boolean;
	/** Source text of the block */
	raw: string;
	/** Title while the block streams */
	title: string;
	/** Title once the block is done */
	titleDone: string;
	/** Text inside the tags */
	text: string;
}

/** A `<SvFiles>` block of code fences, each with a `path` */
export interface FilesToken {
	/** Token type */
	type: "files";
	/** Whether the closing tag has arrived */
	done: boolean;
	/** Files by path, with their code and fence language */
	files: Record<string, { code: string; lang: string }>;
	/** Path of the last file, which is the one being written while streaming */
	latestFile: string;
	/** Optional `title` attribute of the tag */
	title: string;
	/** Source text of the block */
	raw: string;
	/** Text inside the tags */
	text: string;
}

/** Any token Svdown renders: Marked's own, the Sv blocks, or tokens from extensions you add */
export type SvdownToken = MarkedToken | SimpleToken | FilesToken | Tokens.Generic;
