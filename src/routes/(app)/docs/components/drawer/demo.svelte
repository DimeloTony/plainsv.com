<script lang="ts">
	import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "#lib/components/ui/drawer/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { MinusIcon, PlusIcon } from "@lucide/svelte";

	const { section = "preview" }: Props = $props();
	let goal = $state(350);
	let open = $state(false);

	/** Live preview for one section of the drawer docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "directions" | "controlled" | "sizes" | "rounded";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Bottom drawer with a goal stepper, used at the top of the page. -->
		<Drawer>
			<DrawerTrigger>Open drawer</DrawerTrigger>
			<DrawerContent>
				<div class="demoInner">
					<DrawerHeader>
						<DrawerTitle>Move goal</DrawerTitle>
						<DrawerDescription>Set your daily activity goal.</DrawerDescription>
					</DrawerHeader>
					<div class="demoGoal">
						<Button variant="outline" size="icon-sm" rounded="pill" aria-label="Decrease" disabled={goal <= 200} onclick={() => (goal -= 10)}><MinusIcon /></Button>
						<div class="demoGoalValue">
							<strong>{goal}</strong>
							<span>Calories/day</span>
						</div>
						<Button variant="outline" size="icon-sm" rounded="pill" aria-label="Increase" disabled={goal >= 400} onclick={() => (goal += 10)}><PlusIcon /></Button>
					</div>
					<DrawerFooter>
						<Button>Submit</Button>
						<DrawerClose>Cancel</DrawerClose>
					</DrawerFooter>
				</div>
			</DrawerContent>
		</Drawer>
	{:else if section === "directions"}
		<!-- One drawer per edge. -->
		<div class="demoRow">
			{#each ["top", "right", "bottom", "left"] as const as direction (direction)}
				<Drawer {direction}>
					<DrawerTrigger>{direction}</DrawerTrigger>
					<DrawerContent>
						<DrawerHeader>
							<DrawerTitle>From the {direction}</DrawerTitle>
							<DrawerDescription>Drag it toward the {direction} edge to close it.</DrawerDescription>
						</DrawerHeader>
						<DrawerFooter>
							<DrawerClose>Close</DrawerClose>
						</DrawerFooter>
					</DrawerContent>
				</Drawer>
			{/each}
		</div>
	{:else if section === "controlled"}
		<!-- Opened from a plain button through the bound state, with a custom close link. -->
		<Button variant="outline" onclick={() => (open = true)}>Open from code</Button>
		<p class="demoText">Open: {open ? "yes" : "no"}</p>
		<Drawer bind:open>
			<DrawerContent>
				<div class="demoInner">
					<DrawerHeader>
						<DrawerTitle>Controlled drawer</DrawerTitle>
						<DrawerDescription>Opened by setting the bound value.</DrawerDescription>
					</DrawerHeader>
					<DrawerFooter>
						<DrawerClose>
							{#snippet trigger({ props })}
								<Button variant="link" {...props}>Done</Button>
							{/snippet}
						</DrawerClose>
					</DrawerFooter>
				</div>
			</DrawerContent>
		</Drawer>
	{:else if section === "sizes"}
		<!-- Right drawers in each size, so the width changes too. -->
		<div class="demoRow">
			{#each ["xs", "sm", "md", "lg"] as const as size (size)}
				<Drawer direction="right" {size}>
					<DrawerTrigger>Size {size}</DrawerTrigger>
					<DrawerContent>
						<DrawerHeader>
							<DrawerTitle>Size {size}</DrawerTitle>
							<DrawerDescription>Padding, text, and width follow the size.</DrawerDescription>
						</DrawerHeader>
						<DrawerFooter>
							<DrawerClose>Close</DrawerClose>
						</DrawerFooter>
					</DrawerContent>
				</Drawer>
			{/each}
		</div>
	{:else if section === "rounded"}
		<!-- Each rounded value on the corners facing the page. -->
		<div class="demoRow">
			{#each ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"] as const as rounded (rounded)}
				<Drawer {rounded}>
					<DrawerTrigger>Rounded {rounded}</DrawerTrigger>
					<DrawerContent>
						<div class="demoInner">
							<DrawerHeader>
								<DrawerTitle>Rounded {rounded}</DrawerTitle>
								<DrawerDescription>The top corners use this radius.</DrawerDescription>
							</DrawerHeader>
							<DrawerFooter>
								<DrawerClose>Close</DrawerClose>
							</DrawerFooter>
						</div>
					</DrawerContent>
				</Drawer>
			{/each}
		</div>
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

	.demoText {
		margin: 0;
		color: var(--muted-foreground);
		font-size: var(--text-sm);
	}

	.demoRow {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-sm);
	}

	/* Content keeps a readable width in the middle of a full-width drawer */
	.demoInner {
		display: flex;
		flex-direction: column;
		margin-inline: auto;
		width: 100%;
		max-width: 24rem;
	}

	.demoGoal {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--spacing-xl);
		padding: var(--spacing-lg);
	}

	.demoGoalValue {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.demoGoalValue strong {
		font-weight: 700;
		font-size: 4.5rem;
		line-height: 1;
		letter-spacing: -0.05em;
	}

	.demoGoalValue span {
		color: var(--muted-foreground);
		font-size: var(--text-xs);
		text-transform: uppercase;
	}
</style>
