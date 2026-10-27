<script lang="ts">
	import { Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverTitle, PopoverDescription } from "#lib/components/ui/popover/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { Input } from "#lib/components/ui/input/index.js";
	import { Label } from "#lib/components/ui/label/index.js";
	import { SettingsIcon } from "@lucide/svelte";

	const { section = "preview" }: Props = $props();
	const sides = ["top", "right", "bottom", "left"] as const;
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	const roundedValues: UiRounded[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"];
	let isControlledOpen = $state(false);

	/** Live preview for one section of the popover docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "form" | "trigger" | "controlled" | "side" | "size" | "rounded";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Default trigger button with a header in the content. -->
		<Popover>
			<PopoverTrigger>Open Popover</PopoverTrigger>
			<PopoverContent>
				<PopoverHeader>
					<PopoverTitle>Title</PopoverTitle>
					<PopoverDescription>Description text here.</PopoverDescription>
				</PopoverHeader>
			</PopoverContent>
		</Popover>
	{:else if section === "form"}
		<!-- Form fields; the first field takes focus when the popover opens. -->
		<Popover>
			<PopoverTrigger>Dimensions</PopoverTrigger>
			<PopoverContent>
				<PopoverHeader>
					<PopoverTitle>Dimensions</PopoverTitle>
					<PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
				</PopoverHeader>
				<div class="demoFields">
					<div class="demoField">
						<Label for="demo-width">Width</Label>
						<Input id="demo-width" size="sm" value="100%" />
					</div>
					<div class="demoField">
						<Label for="demo-height">Height</Label>
						<Input id="demo-height" size="sm" value="25px" />
					</div>
				</div>
			</PopoverContent>
		</Popover>
	{:else if section === "trigger"}
		<!-- Custom icon button trigger in place of the default button. -->
		<Popover>
			<PopoverTrigger>
				{#snippet trigger({ props })}
					<Button variant="ghost" size="icon-md" aria-label="Settings" {...props}>
						<SettingsIcon />
					</Button>
				{/snippet}
			</PopoverTrigger>
			<PopoverContent>
				<PopoverHeader>
					<PopoverTitle>Settings</PopoverTitle>
					<PopoverDescription>The trigger snippet receives the props that open the popover.</PopoverDescription>
				</PopoverHeader>
			</PopoverContent>
		</Popover>
		<!-- Custom plain button trigger. -->
		<Popover>
			<PopoverTrigger>
				{#snippet trigger({ props })}
					<button class="demoTrigger" type="button" {...props}>Open with a custom trigger</button>
				{/snippet}
			</PopoverTrigger>
			<PopoverContent>
				<PopoverDescription>Any element can open the popover.</PopoverDescription>
			</PopoverContent>
		</Popover>
	{:else if section === "controlled"}
		<!-- Open state bound to a variable and changed from inside and outside the popover. -->
		<Popover bind:open={isControlledOpen}>
			<PopoverTrigger>Account</PopoverTrigger>
			<PopoverContent>
				<PopoverHeader>
					<PopoverTitle>Controlled</PopoverTitle>
					<PopoverDescription>A bound variable opens and closes this popover.</PopoverDescription>
				</PopoverHeader>
				<Button size="sm" onclick={() => (isControlledOpen = false)}>Done</Button>
			</PopoverContent>
		</Popover>
		<p class="demoText">Open: {isControlledOpen}</p>
	{:else if section === "side"}
		<!-- A popover on each side of its trigger. -->
		{#each sides as side (side)}
			<Popover {side}>
				<PopoverTrigger>{side}</PopoverTrigger>
				<PopoverContent>
					<PopoverDescription>Opens on the {side} side.</PopoverDescription>
				</PopoverContent>
			</Popover>
		{/each}
	{:else if section === "size"}
		<!-- Each size of the content and its trigger. -->
		{#each sizes as size (size)}
			<Popover {size}>
				<PopoverTrigger>Size {size}</PopoverTrigger>
				<PopoverContent>
					<PopoverHeader>
						<PopoverTitle>Size {size}</PopoverTitle>
						<PopoverDescription>Padding and text follow the size.</PopoverDescription>
					</PopoverHeader>
				</PopoverContent>
			</Popover>
		{/each}
	{:else if section === "rounded"}
		<!-- Each rounded value overriding the size radius. -->
		{#each roundedValues as rounded (rounded)}
			<Popover {rounded}>
				<PopoverTrigger>Rounded {rounded}</PopoverTrigger>
				<PopoverContent>
					<PopoverDescription>Rounded {rounded}</PopoverDescription>
				</PopoverContent>
			</Popover>
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

	.demoFields {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.demoField {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
	}

	.demoField > :global(label) {
		flex-shrink: 0;
		width: 4rem;
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
