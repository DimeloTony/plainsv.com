<script lang="ts">
	import { Textarea } from "#lib/components/ui/textarea/index.js";
	import { Label } from "#lib/components/ui/label/index.js";
	import { Button } from "#lib/components/ui/button/index.js";

	const { section = "preview" }: Props = $props();
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	const roundedValues: UiRounded[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"];
	let message = $state("");

	/** Live preview for one section of the textarea docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "binding" | "label" | "button" | "sizes" | "rounded" | "states";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Default textarea used at the top of the page. -->
		<Textarea placeholder="Type your message here." />
	{:else if section === "binding"}
		<!-- Two-way bound value with a character count. -->
		<Textarea placeholder="Type your message here." bind:value={message} />
		<p class="demoText">{message.length} characters</p>
	{:else if section === "label"}
		<!-- Label linked by id, with helper text below. -->
		<div class="demoField">
			<Label for="demoMessage">Your message</Label>
			<Textarea id="demoMessage" placeholder="Type your message here." />
			<p class="demoText">Your message will be copied to the support team.</p>
		</div>
	{:else if section === "button"}
		<!-- Textarea with a submit button below it. -->
		<form class="demoField" onsubmit={(e) => e.preventDefault()}>
			<Textarea placeholder="Type your message here." />
			<Button type="submit">Send message</Button>
		</form>
	{:else if section === "sizes"}
		<!-- One textarea per size; the radius follows the size. -->
		{#each sizes as size (size)}
			<Textarea {size} placeholder="Size {size}" />
		{/each}
	{:else if section === "rounded"}
		<!-- Each rounded value overriding the size radius. -->
		{#each roundedValues as rounded (rounded)}
			<Textarea {rounded} placeholder="Rounded {rounded}" />
		{/each}
	{:else if section === "states"}
		<!-- Disabled and invalid states. -->
		<Textarea placeholder="Disabled" disabled />
		<Textarea placeholder="Invalid" aria-invalid="true" />
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

	/* Textareas keep a readable width instead of spanning the page */
	.demo > :global(.textarea),
	.demoField {
		max-width: 24rem;
	}

	.demoField {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		width: 100%;
	}

	.demoText {
		margin: 0;
		color: var(--muted-foreground);
		font-size: var(--text-sm);
	}
</style>
