<script lang="ts">
	import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "#lib/components/ui/sheet/index.js";
	import { Button } from "#lib/components/ui/button/index.js";

	const { section = "preview" }: Props = $props();
	const sides = ["top", "right", "bottom", "left"] as const;
	const variants = ["default", "secondary", "outline"] as const;
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	const roundedValues: UiRounded[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"];
	let isControlledOpen = $state(false);

	/** Live preview for one section of the sheet docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "trigger" | "close" | "controlled" | "side" | "variant" | "size" | "rounded";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Default trigger button with a header in the panel. -->
		<Sheet>
			<SheetTrigger>Open</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Are you absolutely sure?</SheetTitle>
					<SheetDescription>This action cannot be undone.</SheetDescription>
				</SheetHeader>
			</SheetContent>
		</Sheet>
	{:else if section === "trigger"}
		<!-- Custom trigger element in place of the default button. -->
		<Sheet>
			<SheetTrigger>
				{#snippet trigger({ props })}
					<button class="demoTrigger" type="button" {...props}>Open with a custom trigger</button>
				{/snippet}
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Custom trigger</SheetTitle>
					<SheetDescription>The trigger snippet receives the props that open the sheet.</SheetDescription>
				</SheetHeader>
			</SheetContent>
		</Sheet>
	{:else if section === "close"}
		<!-- Footer actions that close the sheet, one default and one custom. -->
		<Sheet>
			<SheetTrigger>Edit profile</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Edit profile</SheetTitle>
					<SheetDescription>Make changes to your profile here. Click save when you are done.</SheetDescription>
				</SheetHeader>
				<SheetFooter>
					<SheetClose>
						{#snippet trigger({ props })}
							<Button {...props}>Save changes</Button>
						{/snippet}
					</SheetClose>
					<SheetClose>Cancel</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	{:else if section === "controlled"}
		<!-- Open state bound to a variable and changed from outside the sheet. -->
		<Button variant="outline" onclick={() => (isControlledOpen = true)}>Open from outside</Button>
		<p class="demoText">Open: {isControlledOpen}</p>
		<Sheet bind:open={isControlledOpen}>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Controlled</SheetTitle>
					<SheetDescription>This sheet has no trigger; a bound variable opens it.</SheetDescription>
				</SheetHeader>
				<SheetFooter>
					<Button onclick={() => (isControlledOpen = false)}>Done</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	{:else if section === "side"}
		<!-- A sheet from each edge of the viewport. -->
		{#each sides as side (side)}
			<Sheet {side}>
				<SheetTrigger>{side}</SheetTrigger>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Side {side}</SheetTitle>
						<SheetDescription>The panel slides in from the {side} edge.</SheetDescription>
					</SheetHeader>
				</SheetContent>
			</Sheet>
		{/each}
	{:else if section === "variant"}
		<!-- Each variant of the panel. -->
		{#each variants as variant (variant)}
			<Sheet {variant}>
				<SheetTrigger>{variant}</SheetTrigger>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Variant {variant}</SheetTitle>
					</SheetHeader>
				</SheetContent>
			</Sheet>
		{/each}
	{:else if section === "size"}
		<!-- Each size of the panel. -->
		{#each sizes as size (size)}
			<Sheet {size}>
				<SheetTrigger>Size {size}</SheetTrigger>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Size {size}</SheetTitle>
						<SheetDescription>Padding, gap, and width follow the size.</SheetDescription>
					</SheetHeader>
				</SheetContent>
			</Sheet>
		{/each}
	{:else if section === "rounded"}
		<!-- Each rounded value on a bottom sheet. -->
		{#each roundedValues as rounded (rounded)}
			<Sheet side="bottom" {rounded}>
				<SheetTrigger>Rounded {rounded}</SheetTrigger>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Rounded {rounded}</SheetTitle>
					</SheetHeader>
				</SheetContent>
			</Sheet>
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
