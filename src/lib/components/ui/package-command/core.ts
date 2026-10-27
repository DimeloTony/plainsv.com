import type { PackageCommandItem, PackageCommandType, PackageManager } from "./index.js";

/** Tab labels for each package manager */
export const packageManagerLabels: Record<PackageManager, string> = { npm: "npm", pnpm: "pnpm", yarn: "yarn", bun: "bun", deno: "deno" };

/** Command prefix for each package manager and command type */
const commandPrefixes: Record<PackageCommandType, Record<PackageManager, string>> = {
	execute: { npm: "npx", pnpm: "pnx", yarn: "yarn dlx", bun: "bunx", deno: "deno run -A" },
	add: { npm: "npm install", pnpm: "pn add", yarn: "yarn add", bun: "bun add", deno: "deno add" },
	install: { npm: "npm install", pnpm: "pn install", yarn: "yarn install", bun: "bun install", deno: "deno install" },
	run: { npm: "npm run", pnpm: "pn run", yarn: "yarn", bun: "bun run", deno: "deno task" },
	create: { npm: "npm create", pnpm: "pn create", yarn: "yarn create", bun: "bun create", deno: "deno init --npm" },
};

/** Command type for each npm command a `.svx` `pm` fence may start with; bun commands still parse so older pages keep their tabs */
const fenceCommandTypes: Record<string, PackageCommandType> = {
	npx: "execute",
	"npm exec": "execute",
	"npm install": "add",
	"npm i": "add",
	"npm run": "run",
	"npm create": "create",
	bunx: "execute",
	"bun x": "execute",
	"bun add": "add",
	"bun install": "install",
	"bun i": "install",
	"bun run": "run",
	"bun create": "create",
};

/** Builds the full command for one package manager, such as `npx remote0 add …` */
export const getPackageCommand = (manager: PackageManager, type: PackageCommandType, command = "", dev = false) => {
	let args = command.trim().split(/\s+/).filter(Boolean);
	// Deno reaches npm packages through the `npm:` specifier instead of a separate runner.
	if (manager === "deno") {
		// If Deno runs a binary: prefix the package, the first argument, so `remote0 add` becomes `npm:remote0 add`.
		if (type === "execute" && args[0]) args[0] = `npm:${args[0]}`;
		// If Deno adds packages: prefix every package, but leave flags and specifiers such as `jsr:` alone.
		if (type === "add") args = args.map((arg) => (arg.startsWith("-") || arg.includes(":") ? arg : `npm:${arg}`));
	}
	// Dev dependencies use `-D`, which every package manager accepts.
	const flags = type === "add" && dev ? ["-D"] : [];
	// If npm runs a script with flags: put `--` before them, since npm would read them as its own options.
	const flagIndex = args.findIndex((arg) => arg.startsWith("-"));
	if (manager === "npm" && type === "run" && flagIndex > 0) args.splice(flagIndex, 0, "--");
	return [commandPrefixes[type][manager], ...flags, ...args].join(" ");
};

/** Builds one tab for each package manager, in order */
export const getPackageCommandItems = (managers: PackageManager[], type: PackageCommandType, command = "", dev = false): PackageCommandItem[] => managers.map((manager) => ({ value: manager, label: packageManagerLabels[manager], command: getPackageCommand(manager, type, command, dev) }));

/** Reads one npm or bun command, such as `npx remote0 add …`, into its type, command, and dev flag; returns `undefined` for anything else */
export const parsePackageCommand = (text: string) => {
	const line = text.trim();
	// If the text holds several lines: a block shows only one command.
	if (line.includes("\n")) return;
	const match = line.match(new RegExp(`^(${Object.keys(fenceCommandTypes).join("|")})(?:\\s+(.*))?$`));
	// If it is not a known command, such as `node src/script.ts`: it cannot be built for other package managers.
	if (!match) return;
	// If `npm install` has no package after it: it installs the project dependencies instead of adding one.
	const type = fenceCommandTypes[match[1]] === "add" && !match[2] ? "install" : fenceCommandTypes[match[1]];
	// Drop the `--` that npm needs before script flags, since `getPackageCommand` adds it back for npm only.
	const rest = (match[2] ?? "").replace(/(?:^|\s)--(?=\s|$)/, "");
	const devFlag = /(?:^|\s)(?:-D|-d|--dev|--save-dev)(?=\s|$)/;
	const dev = type === "add" && devFlag.test(rest);
	const command = (dev ? rest.replace(devFlag, "") : rest).trim();
	// If nothing follows a command that needs a target, such as a bare `npx`: there is nothing to build.
	if (!command && type !== "install") return;
	return { type, command, dev };
};
