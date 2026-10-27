<script lang="ts">
	import { Input } from "#lib/components/ui/input/index.js";
	import { Button } from "#lib/components/ui/button/index.js";

	const { section = "preview" }: Props = $props();
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	const roundedValues: UiRounded[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"];
	let email = $state("");
	let files: FileList | null = $state(null);

	/** Live preview for one section of the input docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "binding" | "sizes" | "file" | "button" | "rounded" | "states";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Default input used at the top of the page. -->
		<Input type="email" placeholder="Email" />
	{:else if section === "binding"}
		<!-- Two-way bound value. -->
		<Input type="email" placeholder="Email" bind:value={email} />
		<p class="demoText">Value: {email || "empty"}</p>
	{:else if section === "sizes"}
		<!-- One input per size; the radius follows the size. -->
		{#each sizes as size (size)}
			<Input {size} placeholder="Size {size}" />
		{/each}
	{:else if section === "file"}
		<!-- File picker with bound files. -->
		<Input type="file" bind:files />
		<p class="demoText">Selected: {files?.length ? files[0].name : "none"}</p>
	{:else if section === "button"}
		<!-- Input paired with a submit button. -->
		<form class="demoRow" onsubmit={(e) => e.preventDefault()}>
			<Input type="email" placeholder="Email" />
			<Button type="submit" variant="outline">Subscribe</Button>
		</form>
	{:else if section === "rounded"}
		<!-- Each rounded value overriding the size radius. -->
		{#each roundedValues as rounded (rounded)}
			<Input {rounded} placeholder="Rounded {rounded}" />
		{/each}
	{:else if section === "states"}
		<!-- Disabled and invalid states. -->
		<Input placeholder="Disabled" disabled />
		<Input placeholder="Invalid" aria-invalid="true" />
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

	/* Inputs keep a readable width instead of spanning the page */
	.demo > :global(.input),
	.demoRow {
		max-width: 20rem;
	}

	.demoRow {
		display: flex;
		gap: var(--spacing-sm);
		width: 100%;
	}

	.demoText {
		margin: 0;
		color: var(--muted-foreground);
		font-size: var(--text-sm);
	}
</style>
