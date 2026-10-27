import fs from "node:fs/promises";

/** Icon aliases fetched on the first transform and reused after */
let cachedIconAliases: Promise<IconAliases> | undefined;

// ENV FILE

/** Writes `src/env.ts` from the variable names in `.env`, marking `PUBLIC_` names as public */
export async function createEnvFile() {
	try {
		const dotEnvFile = await fs.readFile(".env", "utf8");
		// Skip blank lines and comments, and keep only each variable's name.
		const vars = dotEnvFile
			.split("\n")
			.filter((line) => line.trim() && !line.startsWith("#"))
			.map((line) => {
				const varName = line.split("=")[0].trim();
				return `\n    ${varName}: ${varName.startsWith("PUBLIC_") ? "{ public: true }" : "{ }"}`;
			});

		await fs.writeFile("src/env.ts", `import { defineEnvVars } from "@sveltejs/kit/env";\nexport const variables = defineEnvVars({${vars.join(",")}\n});`);
		console.log(`Created src/env.ts at ${new Date()}`);
	} catch {
		// If `.env` is missing: leave `src/env.ts` as it is.
	}
}

// ICON ALIASES

/** Fetches the Lucide and Tabler icon names once, mapped to their icon file names */
export function getIconAliases() {
	return (cachedIconAliases ??= Promise.all([getLucideIconsAliases(), getTablerIconsAliases()]).then(([lucide, tabler]) => ({ lucide, tabler })));
}

/** Maps every Lucide icon name, with or without the `Icon` suffix or `Lucide` prefix, to its file name */
async function getLucideIconsAliases() {
	const icons: IconFiles = {};
	const iconsString = await (await fetch("https://cdn.jsdelivr.net/npm/@lucide/svelte/dist/aliases/suffixed.js")).text();
	// Match export statements like: export { default as AlarmPlusIcon } from '../icons/alarm-plus.js'
	const exportPattern = /export\s*{\s*(?:\/\*[\s\S]*?\*\/\s*)?default\s+as\s+(\w+)\s*}\s*from\s*['"]([^'"]+)['"]/gs;
	for (const importStatement of iconsString.match(exportPattern) || []) {
		const iconAlias = importStatement.split(" as ")[1].split("}")[0].trim();
		const iconWithoutSuffix = iconAlias.slice(0, -4);
		const iconSlug = importStatement.split("/icons/")[1].split(".js")[0].trim();
		// Keep the first file for each name, since later exports are aliases of the same icon.
		icons[iconAlias] ??= `${iconSlug}.js`;
		icons[iconWithoutSuffix] ??= `${iconSlug}.js`;
		icons[`Lucide${iconWithoutSuffix}`] ??= `${iconSlug}.js`;
	}
	return icons;
}

/** Maps every Tabler icon name, with or without the `Icon` prefix, to its file name */
async function getTablerIconsAliases() {
	const icons: IconFiles = {};
	const iconsString = await (await fetch("https://cdn.jsdelivr.net/npm/@tabler/icons-svelte/dist/icons-list.js")).text();
	const iconsList: string[] = JSON.parse(iconsString.split("export default")[1].slice(0, -2).trim());
	for (const iconSlug of iconsList) {
		const iconName = toPascalCase(iconSlug);
		icons[iconName] = `${iconSlug}.svelte`;
		icons[`Icon${iconName}`] = `${iconSlug}.svelte`;
	}
	return icons;
}

/** Converts a hyphenated name to PascalCase, such as `alert-dialog` to `AlertDialog` */
function toPascalCase(hyphenatedName: string) {
	return hyphenatedName
		.toLowerCase()
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join("");
}

// ICON IMPORTS

/** Rewrites barrel imports from Lucide and Tabler into one import per icon file */
export function optimizeIconImports(code: string, cwd: string, iconAliases: IconAliases) {
	// If no cwd is given: leave a placeholder, so the app can fill in its own node_modules path.
	const nodeModulesDir = cwd ? `${cwd}/node_modules` : "$nodeModules";
	// Match default and named imports from the Lucide and Tabler packages.
	const regExp = /import\s+(?:(\w+)|(\{[^}]+\}))\s+from\s*['"](?:(?:@lucide\/svelte|lucide-svelte)(?:\/icons(?:\/[^'"]+)?)?|@tabler\/icons-svelte(?:\/icons(?:\/[^'"]+)?)?)['"]/gs;
	const allImports = code.match(regExp);
	// If the file imports no icons: return it unchanged.
	if (!allImports) return code;

	for (const importStatement of allImports) {
		const iconLib = /@lucide\/svelte|lucide-svelte/.test(importStatement) ? "lucide" : "tabler";
		const importedItems = importStatement.match(/\{\s*([^}]+)\s*\}/)?.[1].split(",");
		// If it is a default import: leave it, since it already points at one file.
		if (!importedItems) continue;

		const iconImports = importedItems
			.map((item) => item.trim())
			.filter((item) => item !== "" && !item.startsWith("type "))
			.map((item) => {
				const [iconName, localName] = item.includes(" as ") ? item.split("as ").map((part) => part.trim()) : [item, item];
				// If the name is unknown: fall back to the Ban icon, so the build keeps going.
				const iconPath = iconLib === "lucide" ? `@lucide/svelte/dist/icons/${iconAliases.lucide[iconName] || iconAliases.lucide["BanIcon"]}` : `@tabler/icons-svelte/dist/icons/${iconAliases.tabler[iconName] || iconAliases.tabler["Ban"]}`;
				return `import ${localName} from "${nodeModulesDir}/${iconPath}";`;
			});
		code = code.replace(importStatement, iconImports.join("\n"));
	}
	return code;
}

// TYPES

/** Icon names mapped to their file names */
type IconFiles = Record<string, string>;

/** Lucide and Tabler icon names mapped to their file names */
export interface IconAliases {
	/** Lucide icon names mapped to `.js` files */
	lucide: IconFiles;
	/** Tabler icon names mapped to `.svelte` files */
	tabler: IconFiles;
}
