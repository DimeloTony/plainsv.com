<script lang="ts">
	import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "#lib/components/ui/collapsible/index.js";
	import { ChevronsUpDownIcon, ChevronRightIcon } from "@lucide/svelte";

	const { section = "preview" }: Props = $props();
	let isOpen = $state(false);

	/** Live preview for one section of the collapsible docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "trigger" | "controlled" | "states";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- A header with an icon trigger, one repository always shown, and the rest in the content. -->
		<Collapsible class="demoCollapsible">
			<header class="demoHeader">
				<h4 class="demoTitle">@peduarte starred 3 repositories</h4>
				<CollapsibleTrigger variant="ghost" size="icon-sm" aria-label="Toggle repositories">
					<ChevronsUpDownIcon />
				</CollapsibleTrigger>
			</header>
			<div class="demoRow">@radix-ui/primitives</div>
			<CollapsibleContent class="demoContent">
				<div class="demoRow">@radix-ui/colors</div>
				<div class="demoRow">@stitches/react</div>
			</CollapsibleContent>
		</Collapsible>
	{:else if section === "trigger"}
		<!-- Custom trigger element whose chevron turns while open. -->
		<Collapsible class="demoCollapsible">
			<CollapsibleTrigger>
				{#snippet trigger({ props })}
					<button class="demoTrigger" type="button" {...props}>
						<ChevronRightIcon class="demoChevron" />
						Advanced settings
					</button>
				{/snippet}
			</CollapsibleTrigger>
			<CollapsibleContent class="demoContent">
				<p class="demoText">These options change how the build caches files.</p>
			</CollapsibleContent>
		</Collapsible>
	{:else if section === "controlled"}
		<!-- Open state bound to a variable and changed from outside. -->
		<Collapsible class="demoCollapsible" bind:open={isOpen}>
			<CollapsibleTrigger>{isOpen ? "Hide" : "Show"} details</CollapsibleTrigger>
			<CollapsibleContent class="demoContent">
				<p class="demoText">The details are open.</p>
			</CollapsibleContent>
		</Collapsible>
		<p class="demoText">Open: {isOpen}</p>
	{:else if section === "states"}
		<!-- Disabled collapsible that starts open and cannot close. -->
		<Collapsible class="demoCollapsible" defaultOpen disabled>
			<CollapsibleTrigger>Disabled</CollapsibleTrigger>
			<CollapsibleContent class="demoContent">
				<p class="demoText">The trigger is disabled, so this stays open.</p>
			</CollapsibleContent>
		</Collapsible>
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--spacing-md);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 1rem 0;
	}

	.demo :global(.demoCollapsible) {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--spacing-sm);
		width: 100%;
		max-width: 22rem;
	}

	.demoHeader {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--spacing-lg);
		padding-inline: var(--spacing-lg);
		width: 100%;
	}

	.demoTitle {
		margin: 0;
		font-weight: 600;
		font-size: var(--text-sm);
	}

	.demo :global(.demoContent) {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		width: 100%;
	}

	.demoRow {
		box-sizing: border-box;
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		padding: var(--spacing-sm) var(--spacing-lg);
		width: 100%;
		font-size: var(--text-sm);
		font-family: var(--font-mono, ui-monospace, monospace);
	}

	.demoTrigger {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		cursor: pointer;
		border: 0;
		background-color: transparent;
		padding: 0;
		color: var(--foreground);
		font: inherit;
		font-weight: 500;
		font-size: var(--text-sm);
	}

	.demoTrigger:focus-visible {
		outline: 2px solid var(--ring);
		outline-offset: 2px;
	}

	.demoTrigger :global(.demoChevron) {
		transition: rotate 200ms cubic-bezier(0.4, 0, 0.2, 1);
		width: 1rem;
		height: 1rem;
	}

	.demoTrigger[data-state="open"] :global(.demoChevron) {
		rotate: 90deg;
	}

	.demoText {
		margin: 0;
		color: var(--muted-foreground);
		font-size: var(--text-sm);
	}
</style>
