import MagicString from "magic-string";
import { getFileData } from "#lib/server/plugins/svx/utils.js";
import { createEnvFile, getIconAliases, optimizeIconImports } from "./utils.js";
import type { Plugin } from "vite";
const CWD = process.cwd();

/** Optimizes icon imports, writes `src/env.ts` from `.env`, and replaces strings in routes during development */
export default function devPlugin(options: DevPluginOptions = {}): Plugin {
	return {
		name: "dev-plugin",
		enforce: "pre",
		// Write src/env.ts when a build starts.
		buildStart() {
			void createEnvFile();
		},
		// Write src/env.ts when the dev server starts, and again whenever .env changes.
		configureServer(server) {
			void createEnvFile();
			server.watcher.on("change", (file) => {
				if (file === `${CWD}/.env` && process.env.NODE_ENV === "development") void createEnvFile();
			});
		},
		// Transform svelte, svx, js, and ts files in src.
		transform: {
			filter: { id: new RegExp(`${CWD}/src/.*\\.(svelte|svx|js|ts)$`) },
			async handler(code, id) {
				const s = new MagicString(code);
				const iconAliases = await getIconAliases();
				let transformedCode = code;
				// If running the dev server and the file is in src/routes: apply each replace pair.
				if (process.env.NODE_ENV === "development" && id.startsWith(`${CWD}/src/routes/`)) {
					for (const [from, to] of Object.entries(options.replace ?? {})) transformedCode = transformedCode.replaceAll(from, to);
				}
				// If the file is svx: optimize icons only in its <script>, since code blocks are docs text.
				if (id.endsWith(".svx")) {
					const { scriptData } = getFileData(transformedCode);
					if (scriptData) transformedCode = transformedCode.replace(scriptData, optimizeIconImports(scriptData, CWD, iconAliases));
				}
				// Else: optimize every icon import in the file.
				else transformedCode = optimizeIconImports(transformedCode, CWD, iconAliases);
				// If nothing changed: let Vite keep the original code.
				if (transformedCode === code) return null;
				return { code: transformedCode, map: s.generateMap({ hires: true }) };
			},
		},
	};
}

/** Options for the dev plugin */
interface DevPluginOptions {
	/** Plain strings to replace in route files while the dev server runs */
	replace?: Record<string, string>;
}
