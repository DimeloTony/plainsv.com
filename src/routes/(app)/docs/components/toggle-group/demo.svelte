<script lang="ts">
	import { ToggleGroup, ToggleGroupItem, type ToggleGroupProps } from "#lib/components/ui/toggle-group/index.js";
	import { BoldIcon, ItalicIcon, UnderlineIcon, AlignLeftIcon, AlignCenterIcon, AlignRightIcon } from "@lucide/svelte";

	const { section = "preview" }: Props = $props();
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	const roundedValues: UiRounded[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"];
	let alignment = $state("left");
	let styles: string[] = $state(["bold"]);

	/** Live preview for one section of the toggle group docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "single" | "outline" | "spacing" | "vertical" | "disabled" | "sizes" | "rounded";
	}
</script>

<!-- Bold, italic, and underline, reused by most sections. -->
{#snippet textStyles(props: Omit<ToggleGroupProps<"multiple">, "children" | "type">)}
	<ToggleGroup type="multiple" {...props}>
		<ToggleGroupItem value="bold" aria-label="Toggle bold"><BoldIcon /></ToggleGroupItem>
		<ToggleGroupItem value="italic" aria-label="Toggle italic"><ItalicIcon /></ToggleGroupItem>
		<ToggleGroupItem value="underline" aria-label="Toggle underline"><UnderlineIcon /></ToggleGroupItem>
	</ToggleGroup>
{/snippet}

<div class="demo">
	{#if section === "preview"}
		<!-- Multiple selection bound to an array, used at the top of the page. -->
		<ToggleGroup type="multiple" variant="outline" bind:value={styles}>
			<ToggleGroupItem value="bold" aria-label="Toggle bold"><BoldIcon /></ToggleGroupItem>
			<ToggleGroupItem value="italic" aria-label="Toggle italic"><ItalicIcon /></ToggleGroupItem>
			<ToggleGroupItem value="underline" aria-label="Toggle underline"><UnderlineIcon /></ToggleGroupItem>
		</ToggleGroup>
		<p class="demoText">Pressed: {styles.length ? styles.join(", ") : "none"}</p>
	{:else if section === "single"}
		<!-- Single selection bound to a string. -->
		<ToggleGroup type="single" variant="outline" bind:value={alignment}>
			<ToggleGroupItem value="left" aria-label="Align left"><AlignLeftIcon /></ToggleGroupItem>
			<ToggleGroupItem value="center" aria-label="Align center"><AlignCenterIcon /></ToggleGroupItem>
			<ToggleGroupItem value="right" aria-label="Align right"><AlignRightIcon /></ToggleGroupItem>
		</ToggleGroup>
		<p class="demoText">Alignment: {alignment || "none"}</p>
	{:else if section === "outline"}
		<!-- Default and outline variants. -->
		{@render textStyles({ value: ["bold"] })}
		{@render textStyles({ variant: "outline", value: ["bold"] })}
	{:else if section === "spacing"}
		<!-- Items spaced apart instead of joined. -->
		{@render textStyles({ variant: "outline", spacing: "xs", value: ["italic"] })}
		{@render textStyles({ variant: "outline", spacing: "sm", value: ["italic"] })}
	{:else if section === "vertical"}
		<!-- Items stacked; the up and down arrows move between them. -->
		{@render textStyles({ variant: "outline", orientation: "vertical", value: ["underline"] })}
	{:else if section === "disabled"}
		<!-- Disabled group. -->
		{@render textStyles({ variant: "outline", disabled: true, value: ["bold"] })}
	{:else if section === "sizes"}
		<!-- One group per size; the radius follows the size. -->
		{#each sizes as size (size)}
			{@render textStyles({ variant: "outline", size, value: ["bold"] })}
		{/each}
	{:else if section === "rounded"}
		<!-- Each rounded value overriding the size radius of the joined group. -->
		{#each roundedValues as rounded (rounded)}
			{@render textStyles({ variant: "outline", rounded, value: ["bold"] })}
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

	.demoText {
		margin: 0;
		color: var(--muted-foreground);
		font-size: var(--text-sm);
	}
</style>
