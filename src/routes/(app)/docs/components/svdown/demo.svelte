<script lang="ts">
	import { Svdown } from "#lib/components/ui/svdown/index.js";
	import { Button } from "#lib/components/ui/button/index.js";

	const { section = "preview" }: Props = $props();
	const sizes = ["xs", "sm", "md", "lg"] as const;
	const fence = "```";
	const response = `<SvThink>
The user wants a counter. A rune-based component with a button is enough.
</SvThink>

## A Svelte counter

Use \`$state\` for the count and update it from the click handler:

${fence}svelte path="src/lib/Counter.svelte"
<script lang="ts">
	let count = $state(0);
<\/script>

<button onclick={() => count++}>Clicked {count} times</button>
${fence}

- **Runes** keep the state reactive.
- Read more in the [Svelte docs](https://svelte.dev/docs/svelte/$state).

| Rune | Use |
| :-- | :-- |
| \`$state\` | Reactive values |
| \`$derived\` | Computed values |`;
	const filesResponse = `<SvPlan>
1. Add the counter component.
2. Use it on the home page.
</SvPlan>

<SvFiles>
${fence}svelte path="src/lib/Counter.svelte"
<button>0</button>
${fence}
${fence}svelte path="src/routes/+page.svelte"
<Counter />
${fence}
</SvFiles>

Both files are ready.`;
	const htmlResponse = `Raw HTML such as <b>bold</b> shows as text by default. A link like [this one](javascript:alert(1)) loses its unsafe address.`;
	let content = $state("");
	let clickedFile = $state("none");
	// Timer of the stream in progress, so a restart stops it first.
	let streamInterval: ReturnType<typeof setInterval> | undefined;

	// Stream the first response on mount, as a chat would, and stop when the demo unmounts.
	$effect(() => {
		if (section !== "preview") return;
		streamResponse();
		return () => clearInterval(streamInterval);
	});

	/** Appends the response in small chunks, like a streamed AI reply. */
	function streamResponse() {
		clearInterval(streamInterval);
		content = "";
		let index = 0;
		streamInterval = setInterval(() => {
			index += 12;
			content = response.slice(0, index);
			if (index >= response.length) clearInterval(streamInterval);
		}, 40);
	}

	/** Live preview for one section of the svdown docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "files" | "html" | "sizes";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Response streamed in chunks and typed out. -->
		<Button variant="outline" size="sm" onclick={streamResponse}>Stream again</Button>
		<Svdown {content} />
	{:else if section === "files"}
		<!-- Plan and files blocks; clicking a file reports its path. -->
		<Svdown content={filesResponse} removeAnimation onFileClick={(path) => (clickedFile = path)} />
		<p class="demoText">Clicked: {clickedFile}</p>
	{:else if section === "html"}
		<!-- HTML and an unsafe link, both made harmless. -->
		<Svdown content={htmlResponse} removeAnimation />
	{:else if section === "sizes"}
		<!-- The same short reply in each size. -->
		{#each sizes as size (size)}
			<Svdown {size} content={`**Size ${size}.** Text, spacing, and \`code\` follow the size.`} removeAnimation />
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

	.demo > :global(.svdown) {
		align-self: stretch;
	}

	.demoText {
		margin: 0;
		color: var(--muted-foreground);
		font-size: var(--text-sm);
	}
</style>
