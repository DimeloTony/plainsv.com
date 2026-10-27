<script lang="ts">
	import { Button, type ButtonProps } from "#lib/components/ui/button/index.js";
	import { ArrowRightIcon, MailIcon, PlusIcon, XIcon } from "@lucide/svelte";

	const { section = "preview" }: Props = $props();
	const variants: ButtonProps["variant"][] = ["default", "secondary", "outline", "ghost", "destructive", "link", "bare"];
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	const roundedValues: UiRounded[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"];

	/** Live preview for one section of the button docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "variants" | "sizes" | "icons" | "rounded" | "links" | "states";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Default button used at the top of the page. -->
		<Button>Button</Button>
	{:else if section === "variants"}
		<!-- One button per visual style. -->
		{#each variants as variant (variant)}
			<Button {variant}>{variant}</Button>
		{/each}
	{:else if section === "sizes"}
		<!-- One button per size; the radius follows the size. -->
		{#each sizes as size (size)}
			<Button {size}>Size {size}</Button>
		{/each}
	{:else if section === "icons"}
		<!-- Icons next to text, and square icon-only sizes. -->
		<Button><MailIcon />Login with email</Button>
		<Button variant="outline">Continue<ArrowRightIcon /></Button>
		{#each sizes as size (size)}
			<Button size="icon-{size}" variant="outline" aria-label="Add"><PlusIcon /></Button>
		{/each}
		<!-- Bare icon buttons; the icon fills each square size. -->
		{#each sizes as size (size)}
			<Button size="icon-{size}" variant="bare" aria-label="Close"><XIcon /></Button>
		{/each}
	{:else if section === "rounded"}
		<!-- Each rounded value overriding the size radius. -->
		{#each roundedValues as rounded (rounded)}
			<Button variant="secondary" {rounded}>Rounded {rounded}</Button>
		{/each}
		<Button size="icon-md" rounded="pill" aria-label="Add"><PlusIcon /></Button>
	{:else if section === "links"}
		<!-- Buttons rendered as anchors through `href`. -->
		<Button href="/docs/components">Browse components</Button>
		<Button href="/docs/components" variant="link">Text link</Button>
		<Button href="/docs/components" variant="outline" disabled>Disabled link</Button>
	{:else if section === "states"}
		<!-- Disabled and invalid states. -->
		<Button disabled>Disabled</Button>
		<Button variant="outline" disabled>Disabled outline</Button>
		<Button variant="outline" aria-invalid="true">Invalid</Button>
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
