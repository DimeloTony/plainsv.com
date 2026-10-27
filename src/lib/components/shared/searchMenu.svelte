<script lang="ts">
	import { goto } from "$app/navigation";
	import { componentLinks, pageLinks } from "#lib/data/app.js";
	import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "#lib/components/ui/command/index.js";
	import { ComponentIcon, FileTextIcon } from "@lucide/svelte";
	let { open = $bindable(false) }: Props = $props();
	let search = $state("");

	/** Toggles the search menu with Cmd+K or Ctrl+K. */
	const handleShortcut = (e: KeyboardEvent) => {
		// If the keys are not Cmd+K or Ctrl+K: leave them to the page.
		if (e.key !== "k" || !(e.metaKey || e.ctrlKey)) return;
		e.preventDefault();
		open = !open;
	};

	/** Closes the menu, clears the search, and opens the chosen page. */
	const openPage = (href: string) => {
		open = false;
		search = "";
		goto(href);
	};

	/** Docs and component search dialog; opened by the parent or Cmd+K */
	interface Props {
		/** Whether the dialog is shown; supports `bind:open` */
		open?: boolean;
	}
</script>

<svelte:window onkeydown={handleShortcut} />

<!-- Docs search; each item opens its page. -->
<CommandDialog bind:open {search} onSearchChange={(value) => (search = value)} title="Search docs">
	<CommandInput placeholder="Search docs and components..." />
	<CommandList>
		<CommandEmpty>No results found.</CommandEmpty>
		<!-- Main docs pages, such as Get Started and Styling. -->
		<CommandGroup heading="Pages">
			{#each pageLinks as link (link.href)}
				<CommandItem value={link.href} keywords={link.keywords} onSelect={() => openPage(link.href)}><FileTextIcon />{link.label}</CommandItem>
			{/each}
		</CommandGroup>
		<CommandGroup heading="Components">
			{#each componentLinks as link (link.href)}
				<CommandItem value={link.label} onSelect={() => openPage(link.href)}><ComponentIcon />{link.label}</CommandItem>
			{/each}
		</CommandGroup>
	</CommandList>
</CommandDialog>
