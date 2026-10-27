<script lang="ts">
	import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "#lib/components/ui/button-group/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { Input } from "#lib/components/ui/input/index.js";
	import { ArrowLeftIcon, ArrowRightIcon, CopyIcon, MinusIcon, PlusIcon, SearchIcon } from "@lucide/svelte";

	const { section = "preview" }: Props = $props();

	/** Live preview for one section of the button group docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "vertical" | "nested" | "separator" | "input" | "text" | "sizes";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Outline buttons joined into one control. -->
		<ButtonGroup aria-label="Message actions">
			<Button variant="outline">Archive</Button>
			<Button variant="outline">Report</Button>
			<Button variant="outline">Snooze</Button>
		</ButtonGroup>
	{:else if section === "vertical"}
		<!-- Stacked zoom buttons. -->
		<ButtonGroup orientation="vertical" aria-label="Zoom">
			<Button variant="outline" size="icon-sm" aria-label="Zoom in"><PlusIcon /></Button>
			<Button variant="outline" size="icon-sm" aria-label="Zoom out"><MinusIcon /></Button>
		</ButtonGroup>
	{:else if section === "nested"}
		<!-- Two groups side by side with a gap between them. -->
		<ButtonGroup>
			<ButtonGroup>
				<Button variant="outline" size="icon-md" aria-label="Previous"><ArrowLeftIcon /></Button>
				<Button variant="outline" size="icon-md" aria-label="Next"><ArrowRightIcon /></Button>
			</ButtonGroup>
			<ButtonGroup>
				<Button variant="outline">1</Button>
				<Button variant="outline">2</Button>
				<Button variant="outline">3</Button>
			</ButtonGroup>
		</ButtonGroup>
	{:else if section === "separator"}
		<!-- Separator between filled buttons that share a color. -->
		<ButtonGroup>
			<Button variant="secondary">Copy</Button>
			<ButtonGroupSeparator />
			<Button variant="secondary" size="icon-md" aria-label="Copy options"><CopyIcon /></Button>
		</ButtonGroup>
	{:else if section === "input"}
		<!-- Search input joined with a button. -->
		<ButtonGroup>
			<Input placeholder="Search..." />
			<Button variant="outline" aria-label="Search"><SearchIcon /></Button>
		</ButtonGroup>
	{:else if section === "text"}
		<!-- Prefix text joined with an input. -->
		<ButtonGroup>
			<ButtonGroupText>https://</ButtonGroupText>
			<Input placeholder="example.com" />
		</ButtonGroup>
	{:else if section === "sizes"}
		<!-- Text, input, and button sized together. -->
		{#each ["xs", "sm", "md", "lg"] as const as size (size)}
			<ButtonGroup>
				<ButtonGroupText {size}>https://</ButtonGroupText>
				<Input {size} placeholder="Size {size}" />
				<Button variant="outline" {size}>Go</Button>
			</ButtonGroup>
		{/each}
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--spacing-sm);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 1rem 0;
	}
</style>
