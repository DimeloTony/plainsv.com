import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { createHighlighterCoreSync } from "shiki/core";
import typescriptLang from "@shikijs/langs/typescript";
import svelteLang from "@shikijs/langs/svelte";
import jsonLang from "@shikijs/langs/json";
import bashLang from "@shikijs/langs/bash";
import markdownLang from "@shikijs/langs/markdown";
import cssLang from "@shikijs/langs/css";
import darkTheme from "@shikijs/themes/dark-plus";
import lightTheme from "@shikijs/themes/light-plus";
import type { ShikiTransformer } from "shiki/core";
import type { CodeBlockHighlightLines } from "./index.js";
export const availableShikiLangs = ["typescript", "svelte", "json", "css", "bash", "markdown"] as const;
export type AvailableShikiLangs = (typeof availableShikiLangs)[number];

/** Theme backgrounds */
export const themeBg = { dark: "#18181b", light: "#fcfcfc" };

// Patch themes with your custom backgrounds
export const vsDarkTheme = {
	...darkTheme,
	name: "vscode-dark", // must match what shikiToMonaco registers
	bg: themeBg.dark,
	colors: { ...darkTheme.colors, "editor.background": themeBg.dark },
};

export const vsLightTheme = {
	...lightTheme,
	name: "vscode-light",
	bg: themeBg.light,
	colors: { ...lightTheme.colors, "editor.background": themeBg.light },
};

const globalShiki = globalThis as typeof globalThis & { __shikiHighlighter?: ReturnType<typeof createHighlighterCoreSync> };

/** A preloaded highlighter instance (available themes: vscode-dark and vscode-light) */
export const shikiHighlighter = (globalShiki.__shikiHighlighter ??= createHighlighterCoreSync({
	themes: [vsDarkTheme, vsLightTheme],
	langs: [typescriptLang, svelteLang, jsonLang, bashLang, markdownLang, cssLang],
	engine: createJavaScriptRegexEngine(),
}));

/** Get file lang from file path */
export const getFileLangFromPath = (filePath: string): AvailableShikiLangs => {
	const fileExt = filePath?.split(".").pop()?.toLowerCase() || "";
	const langMap: Record<string, AvailableShikiLangs> = {
		ts: "typescript",
		js: "typescript",
		css: "css",
		bash: "bash",
		svelte: "svelte",
		json: "json",
		md: "markdown",
		typescript: "typescript",
		javascript: "typescript",
		markdown: "markdown",
	};
	return langMap[fileExt] || null;
};

/** Encode and decode string data */
export function encodeAndDecodeString(data: string, action: "encode" | "decode") {
	// Encode string
	if (action == "encode") return btoa(String.fromCharCode(...new TextEncoder().encode(data)));
	// Decode string
	return new TextDecoder().decode(Uint8Array.from(atob(data), (char) => char.charCodeAt(0)));
}

/** Get the 1-based line numbers to highlight from an array or a range string, such as `"1,3-5"`, clamped to the line count */
export const getHighlightedLines = (lines: CodeBlockHighlightLines, lineCount: number) => {
	const highlighted = new Set<number>();
	// Split a string into comma-separated lines and ranges, and treat an array as single lines.
	const parts = typeof lines === "string" ? lines.split(",") : lines.map(String);
	for (const part of parts) {
		const [start, end = start] = part.split("-").map((value) => Number.parseInt(value.trim(), 10));
		// Skip invalid parts, such as `a`, `3-`, or `-2`.
		if (!Number.isInteger(start) || !Number.isInteger(end)) continue;
		// Clamp to the code so a huge range from streamed text stays cheap, and accept reversed ranges such as `5-3`.
		const to = Math.min(lineCount, Math.max(start, end));
		for (let line = Math.max(1, Math.min(start, end)); line <= to; line++) highlighted.add(line);
	}
	return highlighted;
};

/** Shiki transformer that adds the `highlighted` class to each listed line */
export const lineHighlightTransformer = (lines: Set<number>): ShikiTransformer => ({
	name: "code-block-line-highlight",
	line(node, line) {
		// If the line is listed: mark it so the code styles can highlight it.
		if (lines.has(line)) this.addClassToHast(node, "highlighted");
	},
});

/** Read `{1,3-5}` line highlights from a code fence info string, and return the info string without them */
export const getHighlightLinesFromInfo = (info: string) => {
	const match = info.match(/\{([\d\s,-]*)\}/);
	// If the info string has no highlights: return it as is.
	if (!match) return { highlightLines: "", info: info.trim() };
	return { highlightLines: match[1].replace(/\s+/g, ""), info: info.replace(match[0], "").trim() };
};
