<script lang="ts">
	import { AIAction, AIActionContent } from "#lib/components/ui/ai-action/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { BrainIcon, GlobeIcon, FileTextIcon, SparklesIcon } from "@lucide/svelte";

	const { section = "preview" }: Props = $props();
	const sizes = ["xs", "sm", "md", "lg"] as const;
	let isDone = $state(false);
	let open = $state(false);

	/** Live preview for one section of the AI action docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "done" | "controlled" | "sizes";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Finished steps with details, then the step still running. -->
		<AIAction title="Thought for 4 seconds" icon={BrainIcon} done>
			<AIActionContent>The user wants a summary of Svelte 5 runes, so I should look up the official docs first.</AIActionContent>
		</AIAction>
		<AIAction title="Searched the web" icon={GlobeIcon} done>
			<AIActionContent>
				<p class="demoLine">svelte.dev/docs/svelte/what-are-runes</p>
				<p class="demoLine">svelte.dev/blog/runes</p>
			</AIActionContent>
		</AIAction>
		<AIAction title="Writing the answer" icon={SparklesIcon} />
	{:else if section === "done"}
		<!-- Shimmers until the button marks it done. -->
		<AIAction title={isDone ? "Read 3 files" : "Reading files"} icon={FileTextIcon} done={isDone} />
		<Button variant="outline" size="sm" onclick={() => (isDone = !isDone)}>{isDone ? "Restart" : "Finish"}</Button>
	{:else if section === "controlled"}
		<!-- Starts closed and opens from the button. -->
		<AIAction title="Thought for 2 seconds" icon={BrainIcon} done bind:open>
			<AIActionContent>Checked the question against the earlier messages before answering.</AIActionContent>
		</AIAction>
		<Button variant="outline" size="sm" onclick={() => (open = !open)}>{open ? "Hide" : "Show"} reasoning</Button>
	{:else if section === "sizes"}
		<!-- One expanded step per size. -->
		{#each sizes as size (size)}
			<AIAction {size} title="Size {size}" icon={GlobeIcon} done>
				<AIActionContent>Details use a smaller text size.</AIActionContent>
			</AIAction>
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

	.demoLine {
		margin: 0;
	}
</style>
