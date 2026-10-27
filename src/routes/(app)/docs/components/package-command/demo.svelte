<script lang="ts">
	import { PackageCommand } from "#lib/components/ui/package-command/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { CheckIcon, ClipboardIcon } from "@lucide/svelte";
	import { IconBrandDeno, IconBrandNpm, IconBrandPnpm, IconBrandYarn } from "@tabler/icons-svelte";
	import type { PackageCommandItem, PackageCommandType } from "#lib/components/ui/package-command/index.js";

	const { section = "preview" }: Props = $props();
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	const roundedValues: UiRounded[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"];
	const variants = ["line", "default", "outline", "ghost"] as const;
	const types: { type: PackageCommandType; command: string; dev?: boolean }[] = [
		{ type: "execute", command: "remote0 add https://plainsv.com/r/button.json" },
		{ type: "add", command: "@lucide/svelte" },
		{ type: "add", command: "prettier prettier-plugin-svelte", dev: true },
		{ type: "install", command: "" },
		{ type: "run", command: "dev" },
		{ type: "create", command: "vite my-app" },
	];
	const customItems: PackageCommandItem[] = [
		{ value: "bun", label: "bun", command: "bunx sv@latest create --install bun my-app" },
		{ value: "npm", label: "npm", command: "npx sv@latest create --install npm my-app" },
	];
	const command = "remote0 add https://plainsv.com/r/button.json";
	// Brand icons by package manager; Tabler has no bun icon, so bun shows its label only.
	const brandIcons: Record<string, typeof IconBrandNpm> = { npm: IconBrandNpm, pnpm: IconBrandPnpm, yarn: IconBrandYarn, deno: IconBrandDeno };
	let manager = $state("pnpm");

	/** Live preview for one section of the package command docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "types" | "managers" | "items" | "sync" | "controlled" | "icons" | "copy" | "variants" | "sizes" | "rounded";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- One command, built for each package manager. -->
		<PackageCommand {command} />
	{:else if section === "types"}
		<!-- Every command type, including a dev dependency. -->
		{#each types as example, index (index)}
			<PackageCommand type={example.type} command={example.command} dev={example.dev} />
		{/each}
	{:else if section === "managers"}
		<!-- A custom set and order of package managers, with deno added. -->
		<PackageCommand {command} managers={["bun", "deno", "npm"]} />
	{:else if section === "items"}
		<!-- Exact commands instead of generated ones. -->
		<PackageCommand items={customItems} />
	{:else if section === "sync"}
		<!-- Two blocks that switch together and remember the choice. -->
		<PackageCommand {command} storageKey="docs-package-manager" />
		<PackageCommand type="add" command="@lucide/svelte" storageKey="docs-package-manager" />
	{:else if section === "controlled"}
		<!-- Bound value, shown and changed from outside the block. -->
		<PackageCommand {command} bind:value={manager} />
		<div class="demoRow">
			<Button size="sm" variant="outline" onclick={() => (manager = "bun")}>Switch to bun</Button>
			<p class="demoNote">Selected: <code>{manager}</code></p>
		</div>
	{:else if section === "icons"}
		<!-- Brand icons before each tab label. -->
		<PackageCommand {command} managers={["npm", "pnpm", "yarn", "bun", "deno"]}>
			{#snippet icon({ item })}
				{@const BrandIcon = brandIcons[item.value]}
				{#if BrandIcon}
					<BrandIcon />
				{/if}
			{/snippet}
		</PackageCommand>
	{:else if section === "copy"}
		<!-- Custom copy button with a text label. -->
		<PackageCommand {command}>
			{#snippet copy({ props, copied })}
				<Button size="xs" variant="outline" {...props}>
					{#if copied}
						<CheckIcon /> Copied
					{:else}
						<ClipboardIcon /> Copy
					{/if}
				</Button>
			{/snippet}
		</PackageCommand>
	{:else if section === "variants"}
		<!-- Each tab style. -->
		{#each variants as variant (variant)}
			<PackageCommand {command} {variant} />
		{/each}
	{:else if section === "sizes"}
		<!-- Header height, tab size, padding, and font size at every size. -->
		{#each sizes as size (size)}
			<PackageCommand {command} {size} />
		{/each}
	{:else if section === "rounded"}
		<!-- Each rounded value overriding the size radius. -->
		{#each roundedValues as rounded (rounded)}
			<PackageCommand {command} variant="default" {rounded} />
		{/each}
	{/if}
</div>

<style>
	.demo {
		display: grid;
		gap: var(--spacing-md);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 1rem 0;
	}

	.demoRow {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
	}

	.demoNote {
		margin: 0;
		color: var(--muted-foreground);
		font-size: var(--text-sm);
	}
</style>
