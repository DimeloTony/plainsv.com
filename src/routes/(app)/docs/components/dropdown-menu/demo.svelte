<script lang="ts">
	import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from "#lib/components/ui/dropdown-menu/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { UserIcon, CreditCardIcon, SettingsIcon, UserPlusIcon, MailIcon, MessageSquareIcon, PencilIcon, CopyIcon, Trash2Icon, EllipsisIcon, BookOpenIcon } from "@lucide/svelte";

	const { section = "preview" }: Props = $props();
	const sides = ["top", "right", "bottom", "left"] as const;
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	const roundedValues: UiRounded[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"];
	let showStatusBar = $state(true);
	let showActivityBar = $state(false);
	let panelPosition = $state("bottom");
	let isControlledOpen = $state(false);
	let lastAction = $state("none");

	/** Live preview for one section of the dropdown menu docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "trigger" | "items" | "controlled" | "side" | "size" | "rounded";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Every part: groups, labels, items, checkbox items, radio items, and a submenu. -->
		<DropdownMenu>
			<DropdownMenuTrigger>Open</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuGroup>
					<DropdownMenuLabel>My Account</DropdownMenuLabel>
					<DropdownMenuItem>Profile <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut></DropdownMenuItem>
					<DropdownMenuItem>Billing <DropdownMenuShortcut>⌘B</DropdownMenuShortcut></DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuLabel inset>Appearance</DropdownMenuLabel>
					<DropdownMenuCheckboxItem bind:checked={showStatusBar}>Status Bar</DropdownMenuCheckboxItem>
					<DropdownMenuCheckboxItem bind:checked={showActivityBar}>Activity Bar</DropdownMenuCheckboxItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuLabel inset>Panel Position</DropdownMenuLabel>
					<DropdownMenuRadioGroup bind:value={panelPosition}>
						<DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						<DropdownMenuGroup>
							<DropdownMenuLabel>Invite via</DropdownMenuLabel>
							<DropdownMenuItem>Email</DropdownMenuItem>
							<DropdownMenuItem>Message</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuSubContent>
				</DropdownMenuSub>
			</DropdownMenuContent>
		</DropdownMenu>
	{:else if section === "trigger"}
		<!-- Custom icon button trigger in place of the default button. -->
		<DropdownMenu align="end">
			<DropdownMenuTrigger>
				{#snippet trigger({ props })}
					<Button variant="ghost" size="icon-md" aria-label="More actions" {...props}>
						<EllipsisIcon />
					</Button>
				{/snippet}
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem>Rename</DropdownMenuItem>
				<DropdownMenuItem>Duplicate</DropdownMenuItem>
				<DropdownMenuItem>Archive</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
		<!-- Custom plain button trigger. -->
		<DropdownMenu>
			<DropdownMenuTrigger>
				{#snippet trigger({ props })}
					<button class="demoTrigger" type="button" {...props}>Open with a custom trigger</button>
				{/snippet}
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem>Rename</DropdownMenuItem>
				<DropdownMenuItem>Duplicate</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	{:else if section === "items"}
		<!-- Icons, a submenu with icons, a disabled item, and a destructive item. -->
		<DropdownMenu>
			<DropdownMenuTrigger>Actions</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem onSelect={() => (lastAction = "edit")}><PencilIcon /> Edit <DropdownMenuShortcut>⌘E</DropdownMenuShortcut></DropdownMenuItem>
				<DropdownMenuItem onSelect={() => (lastAction = "copy")}><CopyIcon /> Copy <DropdownMenuShortcut>⌘C</DropdownMenuShortcut></DropdownMenuItem>
				<DropdownMenuSub>
					<DropdownMenuSubTrigger><UserPlusIcon /> Share</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						<DropdownMenuItem onSelect={() => (lastAction = "email")}><MailIcon /> Email</DropdownMenuItem>
						<DropdownMenuItem onSelect={() => (lastAction = "message")}><MessageSquareIcon /> Message</DropdownMenuItem>
					</DropdownMenuSubContent>
				</DropdownMenuSub>
				<DropdownMenuItem href="/docs"><BookOpenIcon /> Docs</DropdownMenuItem>
				<DropdownMenuItem disabled><SettingsIcon /> Settings</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem variant="destructive" onSelect={() => (lastAction = "delete")}><Trash2Icon /> Delete <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut></DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
		<p class="demoText">Last action: {lastAction}</p>
	{:else if section === "controlled"}
		<!-- Open state bound to a variable and changed from outside the menu. -->
		<Button variant="outline" onclick={() => (isControlledOpen = true)}>Open from outside</Button>
		<DropdownMenu bind:open={isControlledOpen}>
			<DropdownMenuTrigger>Account</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem><UserIcon /> Profile</DropdownMenuItem>
				<DropdownMenuItem><CreditCardIcon /> Billing</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
		<p class="demoText">Open: {isControlledOpen}</p>
	{:else if section === "side"}
		<!-- A menu on each side of its trigger. -->
		{#each sides as side (side)}
			<DropdownMenu {side}>
				<DropdownMenuTrigger>{side}</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>Profile</DropdownMenuItem>
					<DropdownMenuItem>Billing</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		{/each}
	{:else if section === "size"}
		<!-- Each size of the menu and its trigger. -->
		{#each sizes as size (size)}
			<DropdownMenu {size}>
				<DropdownMenuTrigger>Size {size}</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem><UserIcon /> Profile</DropdownMenuItem>
					<DropdownMenuCheckboxItem checked>Status Bar</DropdownMenuCheckboxItem>
				</DropdownMenuContent>
			</DropdownMenu>
		{/each}
	{:else if section === "rounded"}
		<!-- Each rounded value overriding the size radius. -->
		{#each roundedValues as rounded (rounded)}
			<DropdownMenu {rounded}>
				<DropdownMenuTrigger>Rounded {rounded}</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>Profile</DropdownMenuItem>
					<DropdownMenuItem>Billing</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		{/each}
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

	.demoTrigger {
		cursor: pointer;
		border: 0;
		background-color: transparent;
		padding: 0;
		color: var(--primary);
		font: inherit;
		font-size: var(--text-sm);
		text-decoration: underline;
		text-underline-offset: 0.25rem; /* 4px */
	}

	.demoTrigger:focus-visible {
		outline: 2px solid var(--ring);
		outline-offset: 2px;
	}

	.demoText {
		margin: 0;
		font-size: var(--text-sm);
	}
</style>
