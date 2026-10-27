<script lang="ts">
	import { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator, CommandShortcut } from "#lib/components/ui/command/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { CalendarIcon, SmileIcon, CalculatorIcon, UserIcon, CreditCardIcon, SettingsIcon, MoonIcon, SunIcon } from "@lucide/svelte";

	const { section = "preview" }: Props = $props();
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	const roundedValues: UiRounded[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"];
	let isDialogOpen = $state(false);
	let search = $state("");
	let selected = $state("");

	/** Toggles the dialog demo with Cmd+K or Ctrl+K. */
	const handleShortcut = (e: KeyboardEvent) => {
		// If this is not the dialog demo, or the keys are not Cmd+K or Ctrl+K: ignore them.
		if (section !== "dialog" || e.key !== "k" || !(e.metaKey || e.ctrlKey)) return;
		e.preventDefault();
		isDialogOpen = !isDialogOpen;
	};

	/** Live preview for one section of the command docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "dialog" | "filtering" | "controlled" | "sizes" | "rounded";
	}
</script>

<svelte:window onkeydown={handleShortcut} />

<div class="demo">
	{#if section === "preview"}
		<!-- Groups with icons, shortcuts, a disabled item, and an empty state. -->
		<Command class="demoCommand">
			<CommandInput placeholder="Type a command or search..." />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup heading="Suggestions">
					<CommandItem><CalendarIcon />Calendar</CommandItem>
					<CommandItem><SmileIcon />Search Emoji</CommandItem>
					<CommandItem disabled><CalculatorIcon />Calculator</CommandItem>
				</CommandGroup>
				<CommandSeparator />
				<CommandGroup heading="Settings">
					<CommandItem><UserIcon />Profile<CommandShortcut>⌘P</CommandShortcut></CommandItem>
					<CommandItem><CreditCardIcon />Billing<CommandShortcut>⌘B</CommandShortcut></CommandItem>
					<CommandItem><SettingsIcon />Settings<CommandShortcut>⌘S</CommandShortcut></CommandItem>
				</CommandGroup>
			</CommandList>
		</Command>
	{:else if section === "dialog"}
		<!-- Command menu in a dialog, opened by the button or Cmd+K. -->
		<Button variant="outline" onclick={() => (isDialogOpen = true)}>Open command menu</Button>
		<p class="demoValue">Or press ⌘K / Ctrl+K.</p>
		<CommandDialog bind:open={isDialogOpen}>
			<CommandInput placeholder="Type a command or search..." />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup heading="Suggestions">
					<CommandItem onSelect={() => (isDialogOpen = false)}><CalendarIcon />Calendar</CommandItem>
					<CommandItem onSelect={() => (isDialogOpen = false)}><SmileIcon />Search Emoji</CommandItem>
				</CommandGroup>
				<CommandSeparator />
				<CommandGroup heading="Settings">
					<CommandItem onSelect={() => (isDialogOpen = false)}><UserIcon />Profile<CommandShortcut>⌘P</CommandShortcut></CommandItem>
					<CommandItem onSelect={() => (isDialogOpen = false)}><SettingsIcon />Settings<CommandShortcut>⌘S</CommandShortcut></CommandItem>
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	{:else if section === "filtering"}
		<!-- Items that also match their keywords, such as "theme" or "night". -->
		<Command class="demoCommand">
			<CommandInput placeholder="Try theme, night, or day..." />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup heading="Appearance">
					<CommandItem keywords={["theme", "night"]}><MoonIcon />Dark mode</CommandItem>
					<CommandItem keywords={["theme", "day"]}><SunIcon />Light mode</CommandItem>
				</CommandGroup>
			</CommandList>
		</Command>
	{:else if section === "controlled"}
		<!-- Search bound to state, and the last selected value shown below. -->
		<Command class="demoCommand" bind:search>
			<CommandInput placeholder="Search..." />
			<CommandList>
				<CommandEmpty>No results for "{search}".</CommandEmpty>
				<CommandGroup heading="Pages">
					<CommandItem value="home" onSelect={(value) => (selected = value)}>Home</CommandItem>
					<CommandItem value="docs" onSelect={(value) => (selected = value)}>Documentation</CommandItem>
					<CommandItem value="blog" onSelect={(value) => (selected = value)}>Blog</CommandItem>
				</CommandGroup>
			</CommandList>
		</Command>
		<p class="demoValue">Search: "{search}" · Selected: {selected || "nothing"}</p>
	{:else if section === "sizes"}
		<!-- One command per size; the input, items, and radius follow the size. -->
		{#each sizes as size (size)}
			<Command class="demoCommand" {size}>
				<CommandInput placeholder="Size {size}" />
				<CommandList>
					<CommandGroup heading="Size {size}">
						<CommandItem><CalendarIcon />Calendar</CommandItem>
						<CommandItem><UserIcon />Profile<CommandShortcut>⌘P</CommandShortcut></CommandItem>
					</CommandGroup>
				</CommandList>
			</Command>
		{/each}
	{:else if section === "rounded"}
		<!-- Each rounded value overriding the size radius. -->
		{#each roundedValues as rounded (rounded)}
			<Command class="demoCommand" {rounded}>
				<CommandInput placeholder="Rounded {rounded}" />
				<CommandList>
					<CommandGroup>
						<CommandItem><CalendarIcon />Calendar</CommandItem>
						<CommandItem><SettingsIcon />Settings</CommandItem>
					</CommandGroup>
				</CommandList>
			</Command>
		{/each}
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

	/* Each command fills the row up to 28rem */
	.demo > :global(.demoCommand) {
		width: 100%;
		max-width: 28rem;
	}

	.demoValue {
		margin: 0;
		color: var(--muted-foreground);
		font-size: var(--text-sm);
	}
</style>
