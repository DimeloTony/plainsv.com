import MagicString from "magic-string";
import { Marked } from "marked";
import { getFileData } from "./utils.js";
import type { Plugin } from "vite";
const marked = new Marked();
const CWD = process.cwd();
const FILE_FILTER = new RegExp(`${CWD}/src/routes/.*\\.svx$`);

/** Compiles .svx pages in src/routes into Svelte pages with plain HTML code blocks */
export default function svxPluginSimple(): Plugin {
	return {
		name: "svxPluginSimple",
		enforce: "pre",
		// Transform svx file to svelte
		transform: {
			filter: { id: FILE_FILTER },
			async handler(fileCode) {
				const fileData = getFileData(fileCode);
				const markedTokens = marked.lexer(fileData.markdown);
				const s = new MagicString(fileCode);
				const html = await Promise.all(
					markedTokens.map(async (token) => {
						// If the token is a capitalized tag: keep it raw so it renders as a Svelte component.
						if (token.type === "html" && /^\s*<[A-Z]/.test(token.raw)) {
							return token.raw;
						}
						// Else render Markdown, including code fences, as plain HTML.
						// Escape braces after parsing so Svelte reads them as text and code keeps them as written.
						const tokenHtml = await marked.parse(token.raw);
						return tokenHtml.replaceAll("{", "&#123;").replaceAll("}", "&#125;");
					}),
				);

				// Return transformed code
				return {
					map: s.generateMap({ hires: true }),
					code: `<script lang="ts">\n    ${fileData.scriptData}\n
						import { PageMeta } from "#lib/components/shared/index.js";
					</script>

					<PageMeta title="${fileData.frontmatter.title}" description="${fileData.frontmatter.description}" />
					\n${html.join("\n")}

					<style>${fileData.styleData}</style>`,
				};
			},
		},
	};
}
