<script lang="ts">
	import { Item, ItemGroup, ItemSeparator, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions } from "#lib/components/ui/item/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { BadgeCheckIcon, ChevronRightIcon, ShieldAlertIcon } from "@lucide/svelte";

	const { section = "preview" }: Props = $props();
	const people = [
		{ name: "shadcn", email: "shadcn@vercel.com" },
		{ name: "maxleiter", email: "maxleiter@vercel.com" },
		{ name: "evilrabbit", email: "evilrabbit@vercel.com" },
	];

	/** Live preview for one section of the item docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "variants" | "link" | "group" | "sizes" | "rounded";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Outline item with a button, and a small link item. -->
		<Item variant="outline">
			<ItemContent>
				<ItemTitle>Basic item</ItemTitle>
				<ItemDescription>A simple item with a title and a description.</ItemDescription>
			</ItemContent>
			<ItemActions>
				<Button variant="outline" size="sm">Action</Button>
			</ItemActions>
		</Item>
		<Item variant="outline" size="sm" href="/docs/components">
			<ItemMedia><BadgeCheckIcon /></ItemMedia>
			<ItemContent>
				<ItemTitle>Your profile has been verified.</ItemTitle>
			</ItemContent>
			<ItemActions><ChevronRightIcon /></ItemActions>
		</Item>
	{:else if section === "variants"}
		<!-- One item per variant. -->
		{#each ["default", "outline", "muted"] as const as variant (variant)}
			<Item {variant}>
				<ItemMedia variant="icon"><ShieldAlertIcon /></ItemMedia>
				<ItemContent>
					<ItemTitle>Variant {variant}</ItemTitle>
					<ItemDescription>New login detected from an unknown device.</ItemDescription>
				</ItemContent>
			</Item>
		{/each}
	{:else if section === "link"}
		<!-- The whole item is a link. -->
		<Item variant="outline" href="/docs/components">
			<ItemContent>
				<ItemTitle>Visit the components</ItemTitle>
				<ItemDescription>Browse every component in the registry.</ItemDescription>
			</ItemContent>
			<ItemActions><ChevronRightIcon /></ItemActions>
		</Item>
	{:else if section === "group"}
		<!-- List of people divided by separators. -->
		<ItemGroup>
			{#each people as person, index (person.email)}
				{#if index > 0}<ItemSeparator />{/if}
				<Item>
					<ItemMedia>
						<span class="demoAvatar">{person.name[0].toUpperCase()}</span>
					</ItemMedia>
					<ItemContent>
						<ItemTitle>{person.name}</ItemTitle>
						<ItemDescription>{person.email}</ItemDescription>
					</ItemContent>
					<ItemActions>
						<Button variant="ghost" size="sm">Invite</Button>
					</ItemActions>
				</Item>
			{/each}
		</ItemGroup>
	{:else if section === "sizes"}
		<!-- One item per size. -->
		{#each ["xs", "sm", "md", "lg"] as const as size (size)}
			<Item variant="outline" {size}>
				<ItemContent><ItemTitle>Size {size}</ItemTitle></ItemContent>
				<ItemActions><ChevronRightIcon /></ItemActions>
			</Item>
		{/each}
	{:else if section === "rounded"}
		<!-- Each rounded value overriding the size radius. -->
		{#each ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"] as const as rounded (rounded)}
			<Item variant="outline" {rounded}>
				<ItemContent><ItemTitle>Rounded {rounded}</ItemTitle></ItemContent>
				<ItemActions><ChevronRightIcon /></ItemActions>
			</Item>
		{/each}
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: var(--spacing-md);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 1rem 0;
		max-width: 28rem;
	}

	.demoAvatar {
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: var(--radius-pill);
		background-color: var(--muted);
		width: var(--control-height-sm);
		height: var(--control-height-sm);
		font-weight: 500;
	}
</style>
