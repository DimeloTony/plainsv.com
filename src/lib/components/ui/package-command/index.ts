export { default as PackageCommand } from "./_.svelte";
export { getPackageCommand, getPackageCommandItems, packageManagerLabels, parsePackageCommand } from "./core.js";

/** Package managers the command builder knows */
export type PackageManager = "npm" | "pnpm" | "yarn" | "bun" | "deno";

/** `execute` runs a package binary, `add` installs packages, `install` installs the lockfile, `run` runs a script, and `create` scaffolds a project */
export type PackageCommandType = "execute" | "add" | "install" | "run" | "create";

/** One tab with its exact command */
export interface PackageCommandItem {
	/** Value that identifies the tab, such as `bun` */
	value: string;
	/** Tab label */
	label: string;
	/** Command shown and copied while the tab is active */
	command: string;
}

/** Props a custom copy button spreads onto its element */
export interface PackageCommandCopyAttrs {
	/** `Copy command`, or `Copied` while the copied state shows */
	"aria-label": string;
	/** Whether the copied state is showing */
	disabled: boolean;
	/** Copies the active command */
	onclick: () => void;
}

/** Command block with a tab for each package manager and a copy button */
export interface Props extends Omit<CompProps<"div">, "children"> {
	/** Command without the package manager, such as `remote0 add https://plainsv.com/r/button.json`; ignored when `items` is given */
	command?: string;
	/** Kind of command to build for each package manager; defaults to `execute` */
	type?: PackageCommandType;
	/** Adds `-D` to an `add` command to save the packages as dev dependencies */
	dev?: boolean;
	/** Package managers to show, in order; defaults to `npm`, `pnpm`, `yarn`, and `bun` */
	managers?: PackageManager[];
	/** Exact tabs and commands; overrides `command`, `type`, `dev`, and `managers` */
	items?: PackageCommandItem[];
	/** Value of the active tab; supports `bind:value` */
	value?: string;
	/** Starting tab when `value` is not set; falls back to the first item */
	defaultValue?: string;
	/** Called with the new value when the tab changes, including when a block with the same `storageKey` switches it */
	onValueChange?: (value: string) => void;
	/** localStorage key that remembers the choice and switches every block with the same key together; off when omitted */
	storageKey?: string;
	/** Style of the tabs; defaults to `line` */
	variant?: "default" | "outline" | "ghost" | "line";
	/** Header height, tab size, code padding, and font size; defaults to `md` */
	size?: UiSize;
	/** Corner radius; follows `size` when omitted. `pill` is a true pill that can clip the content, so use `3xl` or `4xl` to stay round */
	rounded?: UiRounded;
	/** Content before each tab label, such as a brand icon */
	icon?: Snippet<[{ item: PackageCommandItem }]>;
	/** Custom copy button; spread `props` onto the element that copies */
	copy?: Snippet<[{ props: PackageCommandCopyAttrs; copied: boolean }]>;
	/** Classes merged onto the root container */
	class?: CompProps<"div">["class"];
}

export type PackageCommandProps = Props;
