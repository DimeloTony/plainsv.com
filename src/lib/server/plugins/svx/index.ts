import MagicString from "magic-string";
import { Marked } from "marked";
import { encodeAndDecodeString, getHighlightLinesFromInfo } from "#lib/components/ui/code-block/core.js";
import { parsePackageCommand } from "#lib/components/ui/package-command/core.js";
import { getFileData } from "./utils.js";
import type { Plugin } from "vite";
const marked = new Marked();
const CWD = process.cwd();
const FILE_FILTER = new RegExp(`${CWD}/src/routes/.*\\.svx$`);

/** Simple plugin to allow  */
export default function svxPlugin(): Plugin {
	return {
		name: "svxPlugin",
		enforce: "pre",
		// Transform svx file to svelte
		transform: {
			filter: { id: FILE_FILTER },
			async handler(fileCode, filePath) {
				const fileData = getFileData(fileCode);
				const markedTokens = marked.lexer(fileData.markdown);

				// const pageData = CACHED_SVX_FILES.get(filePath)!;
				const s = new MagicString(fileCode);
				const html = await Promise.all(
					markedTokens.map(async (token) => {
						if (token.type === "code") {
							// Read `{1,3-5}` line highlights before splitting the language and title.
							const { highlightLines, info } = getHighlightLinesFromInfo(token.lang || "");
							const [lang = "", prepPath] = info.split(/\s+/);
							const title = prepPath?.match(/^(?:title=")?([^"]+)"?$/)?.[1];
							// A `pm` fence holds one npm command and renders a tab for each package manager; the shared key keeps the reader's choice on every page.
							const packageCommand = lang === "pm" ? parsePackageCommand(token.text) : undefined;
							if (packageCommand) {
								return `<PackageCommand style="margin-top: 1rem;" type="${packageCommand.type}" command={${JSON.stringify(packageCommand.command)}} dev={${packageCommand.dev}} managers={["pnpm", "bun", "npm", "yarn"]} storageKey="plainsv-package-manager" />`;
							}
							// Every other fence is a code block; a `pm` fence that is not a known npm command falls back to bash.
							return `<CodeBlock usingEncodedData style="margin-top: 1rem;" ${highlightLines ? `highlightLines="${highlightLines}" ` : ""}data={{ ${title ? `path: "${title}"` : `lang: "${lang === "pm" ? "bash" : lang}"`}, code: "${encodeAndDecodeString(token.text, "encode")}" }}>
								<CodeBlockHeader />
								<CodeBlockCode />
							</CodeBlock>`;
						}
						// Return raw component to allow preview and all that
						if (token.type === "html" && /^\s*<[A-Z]/.test(token.raw)) {
							return token.raw;
						} else {
							return marked.parse(token.raw.replaceAll("{", "&#123;").replaceAll("}", "&#125;").replaceAll("→", "s"));
						}
					}),
				);

				// Return transformed code
				return {
					map: s.generateMap({ hires: true }),
					code: `<script lang="ts">\n    ${fileData.scriptData}\n
						import { PageMeta } from "#lib/components/shared/index.js";
						import { CodeBlock, CodeBlockCode, CodeBlockHeader } from "#lib/components/ui/code-block/index.js";
						import { PackageCommand } from "#lib/components/ui/package-command/index.js";
					</script>
					
					<PageMeta title="${fileData.frontmatter.title}" description="${fileData.frontmatter.description}" />
					\n${html.join("\n")}
					
					<style>${fileData.styleData}</style>`,
				};
			},
		},
	};
}
