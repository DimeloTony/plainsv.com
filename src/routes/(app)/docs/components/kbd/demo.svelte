<script lang="ts">
	import { Kbd, KbdGroup } from "#lib/components/ui/kbd/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { CommandIcon, ArrowBigUpIcon, CornerDownLeftIcon } from "@lucide/svelte";

	const { section = "preview" }: Props = $props();
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];

	/** Live preview for one section of the kbd docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "group" | "button" | "sizes" | "rounded";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Single keys, symbols, and icons. -->
		<div class="demoRow">
			<Kbd>⌘</Kbd>
			<Kbd>⇧</Kbd>
			<Kbd>⌥</Kbd>
			<Kbd>⌃</Kbd>
			<Kbd><CommandIcon /></Kbd>
			<Kbd>Ctrl</Kbd>
		</div>
	{:else if section === "group"}
		<!-- Key combinations in running text. -->
		<p class="demoText">
			Use
			<KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>
			to open the command menu, or
			<KbdGroup><Kbd>Ctrl</Kbd><span>+</span><Kbd>B</Kbd></KbdGroup>
			to toggle the sidebar.
		</p>
	{:else if section === "button"}
		<!-- Shortcut hint inside a button. -->
		<Button variant="outline">Accept <Kbd><CornerDownLeftIcon /></Kbd></Button>
		<Button variant="outline">Select all <KbdGroup><Kbd><ArrowBigUpIcon /></Kbd><Kbd>A</Kbd></KbdGroup></Button>
	{:else if section === "sizes"}
		<!-- One shortcut per size. -->
		<div class="demoRow">
			{#each sizes as size (size)}
				<KbdGroup><Kbd {size}>⌘</Kbd><Kbd {size}>K</Kbd></KbdGroup>
			{/each}
		</div>
	{:else if section === "rounded"}
		<!-- One shortcut per rounded value. -->
		<div class="demoRow">
			{#each ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"] as const as rounded (rounded)}
				<KbdGroup><Kbd {rounded}>⌘</Kbd><Kbd {rounded}>K</Kbd></KbdGroup>
			{/each}
		</div>
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--spacing-sm);
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

	.demoText {
		margin: 0;
		color: var(--muted-foreground);
		font-size: var(--text-sm);
		line-height: 1.75rem;
	}
</style>
