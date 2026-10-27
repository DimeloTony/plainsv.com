<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import { Button } from "#lib/components/ui/button/index.js";
	import { Tabs, TabsList, TabsTrigger, TabsContent } from "#lib/components/ui/tabs/index.js";
	import { getPackageCommandItems } from "./core.js";
	import { syncedValues } from "./state.svelte.js";
	import { CopyIcon, CheckIcon } from "@lucide/svelte";
	import type { Props, PackageCommandCopyAttrs } from "./index.js";

	let { command = "", type = "execute", dev = false, managers = ["npm", "pnpm", "yarn", "bun"], items: customItems, defaultValue, value = $bindable(defaultValue), onValueChange, storageKey, variant = "line", size = "md", rounded, icon, copy, class: className, ...props }: Props = $props();
	// Tabs sit one size and one radius step below the block so they fit inside its header.
	const tabsSizes: Record<UiSize, UiSize> = { lg: "md", md: "sm", sm: "xs", xs: "xs" };
	const tabsRadii: Record<UiRounded, UiRounded> = { xs: "xs", sm: "xs", md: "sm", lg: "md", xl: "lg", "2xl": "xl", "3xl": "2xl", "4xl": "3xl", pill: "pill" };
	let copied = $state(false);
	let copyTimeout: ReturnType<typeof setTimeout> | undefined;

	const items = $derived(customItems ?? getPackageCommandItems(managers, type, command, dev));
	// An unknown or missing value falls back to the first tab, so a panel always shows.
	const activeValue = $derived(items.some((item) => item.value === value) ? (value ?? "") : (items[0]?.value ?? ""));
	const activeCommand = $derived(items.find((item) => item.value === activeValue)?.command ?? "");
	const copyProps: PackageCommandCopyAttrs = $derived({ "aria-label": copied ? "Copied" : "Copy command", disabled: copied, onclick: copyCommand });

	// Restore the remembered choice once, unless another block with the same key already did.
	onMount(() => {
		if (!storageKey || syncedValues[storageKey]) return;
		try {
			const storedValue = localStorage.getItem(storageKey);
			if (storedValue) syncedValues[storageKey] = storedValue;
		} catch {
			// If storage is blocked, such as in a private window: keep the default tab.
		}
	});

	// Follow the tab chosen in another block with the same key, when this block has that tab.
	$effect.pre(() => {
		if (!storageKey) return;
		const syncedValue = syncedValues[storageKey];
		if (syncedValue && syncedValue !== activeValue && items.some((item) => item.value === syncedValue)) select(syncedValue);
	});

	// Clear the copied-state timeout when the block unmounts.
	onDestroy(() => clearTimeout(copyTimeout));

	/** Opens a tab, reports the change, and shares it with blocks that use the same `storageKey`. */
	function select(nextValue: string) {
		value = nextValue;
		onValueChange?.(nextValue);
		// If the choice is not remembered: there is nothing to share.
		if (!storageKey) return;
		syncedValues[storageKey] = nextValue;
		try {
			localStorage.setItem(storageKey, nextValue);
		} catch {
			// If storage is blocked: the blocks on this page still switch together.
		}
	}

	/** Copies the active command to the clipboard and shows the copied state for one second. */
	async function copyCommand() {
		copied = true;
		try {
			await navigator.clipboard.writeText(activeCommand);
		} catch {
			// If the clipboard is unavailable or blocked: reset right away instead of showing success.
			copied = false;
			return;
		}
		clearTimeout(copyTimeout);
		copyTimeout = setTimeout(() => (copied = false), 1000);
	}
</script>

<!-- Root box; the tabs pick the package manager and the panel shows its command. -->
<div class={["packageCommand not-typeset", className]} data-variant={variant} data-size={size} data-rounded={rounded} {...props}>
	<Tabs class="packageCommandTabs" value={activeValue} onValueChange={select} {variant} size={tabsSizes[size]} rounded={tabsRadii[rounded ?? size]}>
		<!-- Header with one tab per package manager and the copy button. -->
		<header class="packageCommandHeader">
			<TabsList class="packageCommandList" aria-label="Package manager">
				{#each items as item (item.value)}
					<TabsTrigger value={item.value}>
						{@render icon?.({ item })}
						{item.label}
					</TabsTrigger>
				{/each}
			</TabsList>
			<span class="packageCommandActions">
				{#if copy}
					{@render copy({ props: copyProps, copied })}
				{:else}
					<Button size="icon-xs" variant="ghost" {...copyProps}>
						{#if copied}
							<CheckIcon />
						{:else}
							<CopyIcon />
						{/if}
					</Button>
				{/if}
			</span>
		</header>

		<!-- One panel per package manager; only the active one renders. -->
		{#each items as item (item.value)}
			<TabsContent value={item.value}>
				<pre class="packageCommandCode scroll-fade-x" data-size={size}><code>{item.command}</code></pre>
			</TabsContent>
		{/each}
	</Tabs>
</div>

<style>
	/* Base block */
	.packageCommand {
		display: flex;
		flex-direction: column;
		border: 1px solid var(--border);
		overflow: hidden;
	}

	/* The header and panel touch, so the tabs root drops its gap */
	.packageCommand :global(.tabs.packageCommandTabs) {
		gap: 0;
	}

	/* Base header */
	.packageCommandHeader {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--spacing-lg);
		border-bottom: 1px solid var(--border);
		background-color: color-mix(in oklab, var(--card) 60%, transparent);
	}

	/* Keeps the copy button centered when the tabs sit on the header's bottom edge */
	.packageCommandActions {
		display: flex;
		flex-shrink: 0;
		align-self: center;
	}

	/* Base command display */
	.packageCommandCode {
		margin: 0;
		background-color: color-mix(in oklab, var(--card) 40%, transparent);
		overflow-x: auto;
		color: var(--foreground);
		font-family: var(--font-mono, ui-monospace, monospace);
		white-space: pre;
	}

	.packageCommandCode code {
		font: inherit;
	}

	/* =============== Variants =============== */

	/* Line tabs sit on the header's bottom edge, so the active indicator covers its border */
	.packageCommand[data-variant="line"] .packageCommandHeader {
		align-items: flex-end;
	}

	.packageCommand[data-variant="line"] :global(.tabsList.packageCommandList) {
		margin-bottom: -1px; /* overlaps the header border */
		border-bottom-color: transparent;
	}

	/* =============== States =============== */

	/* Inset focus ring, since the root clips an outer ring */
	.packageCommand :global(.tabsContent:focus-visible) {
		box-shadow: inset 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
		border-radius: 0;
	}

	/* =============== Sizes =============== */

	/* Large */
	.packageCommand[data-size="lg"] {
		border-radius: var(--radius-lg);
	}

	.packageCommand[data-size="lg"] .packageCommandHeader {
		padding-inline: var(--spacing-md);
		min-height: var(--control-height-lg);
	}

	.packageCommandCode[data-size="lg"] {
		padding: var(--spacing-xl);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Medium — default */
	.packageCommand[data-size="md"] {
		border-radius: var(--radius-md);
	}

	.packageCommand[data-size="md"] .packageCommandHeader {
		padding-inline: var(--spacing-sm);
		min-height: var(--control-height-lg);
	}

	.packageCommandCode[data-size="md"] {
		padding: var(--spacing-lg);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* Small */
	.packageCommand[data-size="sm"] {
		border-radius: var(--radius-sm);
	}

	.packageCommand[data-size="sm"] .packageCommandHeader {
		padding-inline: var(--spacing-xs);
		min-height: var(--control-height-sm);
	}

	.packageCommandCode[data-size="sm"] {
		padding: var(--spacing-md);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* Extra small */
	.packageCommand[data-size="xs"] {
		border-radius: var(--radius-xs);
	}

	.packageCommand[data-size="xs"] .packageCommandHeader {
		padding-inline: var(--spacing-xs);
		min-height: var(--control-height-xs);
	}

	.packageCommandCode[data-size="xs"] {
		padding: var(--spacing-sm);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius; must stay after the size rules */
	.packageCommand[data-rounded="xs"] {
		border-radius: var(--radius-xs);
	}

	.packageCommand[data-rounded="sm"] {
		border-radius: var(--radius-sm);
	}

	.packageCommand[data-rounded="md"] {
		border-radius: var(--radius-md);
	}

	.packageCommand[data-rounded="lg"] {
		border-radius: var(--radius-lg);
	}

	.packageCommand[data-rounded="xl"] {
		border-radius: var(--radius-xl);
	}

	.packageCommand[data-rounded="2xl"] {
		border-radius: var(--radius-2xl);
	}

	.packageCommand[data-rounded="3xl"] {
		border-radius: var(--radius-3xl);
	}

	.packageCommand[data-rounded="4xl"] {
		border-radius: var(--radius-4xl);
	}

	/* A true pill; tall content can clip at the corners, so use 3xl or 4xl to stay safe */
	.packageCommand[data-rounded="pill"] {
		border-radius: var(--radius-pill);
	}
</style>
