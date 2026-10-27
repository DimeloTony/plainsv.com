<script lang="ts">
	import { Tooltip, TooltipTrigger, TooltipContent, type TooltipProps, type TooltipSide } from "#lib/components/ui/tooltip/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { PlusIcon } from "@lucide/svelte";

	const { section = "preview" }: Props = $props();
	const sides: TooltipSide[] = ["top", "right", "bottom", "left"];
	const variants: TooltipProps["variant"][] = ["default", "secondary", "outline", "destructive"];
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	const roundedValues: UiRounded[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"];
	let isControlledOpen = $state(false);

	/** Live preview for one section of the tooltip docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "behavior" | "sides" | "trigger" | "arrow" | "controlled" | "variants" | "sizes" | "rounded";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Default trigger button and text, used at the top of the page. -->
		<Tooltip>
			<TooltipTrigger>Hover</TooltipTrigger>
			<TooltipContent>
				<p>Add to library</p>
			</TooltipContent>
		</Tooltip>
	{:else if section === "behavior"}
		<!-- Slow to open, closing at once, and the defaults for comparison. -->
		<Tooltip delay={700}>
			<TooltipTrigger>700ms delay</TooltipTrigger>
			<TooltipContent>Opened after a pause</TooltipContent>
		</Tooltip>
		<Tooltip closeDelay={0}>
			<TooltipTrigger>Closes at once</TooltipTrigger>
			<TooltipContent>Gone as soon as the pointer leaves</TooltipContent>
		</Tooltip>
		<Tooltip>
			<TooltipTrigger>Defaults</TooltipTrigger>
			<TooltipContent>Opens at once, closes after 150ms</TooltipContent>
		</Tooltip>
	{:else if section === "sides"}
		<!-- One tooltip per preferred side. -->
		{#each sides as side (side)}
			<Tooltip {side}>
				<TooltipTrigger>{side}</TooltipTrigger>
				<TooltipContent>Opens on the {side}</TooltipContent>
			</Tooltip>
		{/each}
	{:else if section === "trigger"}
		<!-- Icon-only button as a custom trigger; the tooltip names it. -->
		<Tooltip>
			<TooltipTrigger>
				{#snippet trigger({ props })}
					<Button size="icon-md" variant="outline" aria-label="Add to library" {...props}><PlusIcon /></Button>
				{/snippet}
			</TooltipTrigger>
			<TooltipContent>Add to library</TooltipContent>
		</Tooltip>
	{:else if section === "arrow"}
		<!-- With and without the arrow; the gap shrinks without it. -->
		<Tooltip>
			<TooltipTrigger>With arrow</TooltipTrigger>
			<TooltipContent>Add to library</TooltipContent>
		</Tooltip>
		<Tooltip arrow={false}>
			<TooltipTrigger>Without arrow</TooltipTrigger>
			<TooltipContent>Add to library</TooltipContent>
		</Tooltip>
	{:else if section === "controlled"}
		<!-- Tooltip opened by a button outside it. -->
		<Tooltip bind:open={isControlledOpen} side="right">
			<TooltipTrigger>Anchor</TooltipTrigger>
			<TooltipContent>Opened from outside</TooltipContent>
		</Tooltip>
		<Button variant="secondary" onclick={() => (isControlledOpen = !isControlledOpen)}>{isControlledOpen ? "Hide" : "Show"} tooltip</Button>
	{:else if section === "variants"}
		<!-- One tooltip per visual style. -->
		{#each variants as variant (variant)}
			<Tooltip {variant}>
				<TooltipTrigger>{variant}</TooltipTrigger>
				<TooltipContent>Add to library</TooltipContent>
			</Tooltip>
		{/each}
	{:else if section === "sizes"}
		<!-- One tooltip per size; the radius follows the size. -->
		{#each sizes as size (size)}
			<Tooltip {size}>
				<TooltipTrigger>Size {size}</TooltipTrigger>
				<TooltipContent>Add to library</TooltipContent>
			</Tooltip>
		{/each}
	{:else if section === "rounded"}
		<!-- Each rounded value overriding the size radius. -->
		{#each roundedValues as rounded (rounded)}
			<Tooltip {rounded}>
				<TooltipTrigger>Rounded {rounded}</TooltipTrigger>
				<TooltipContent>Add to library</TooltipContent>
			</Tooltip>
		{/each}
		<!-- A wrapping tooltip keeps round corners instead of becoming an oval. -->
		<Tooltip rounded="pill">
			<TooltipTrigger>Long pill</TooltipTrigger>
			<TooltipContent>Save this item to your library so you can find it again later from any device you sign in on.</TooltipContent>
		</Tooltip>
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
</style>
