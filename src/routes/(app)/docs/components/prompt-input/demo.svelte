<script lang="ts">
	import { PromptInput, PromptInputTextarea, PromptInputFiles, PromptInputActions, PromptInputButton, PromptInputFilesButton, PromptInputSelect, PromptInputSubmit, type PromptInputData } from "#lib/components/ui/prompt-input/index.js";
	import { toast } from "#lib/components/ui/toaster/index.js";
	import { Switch } from "#lib/components/ui/switch/index.js";
	import { Label } from "#lib/components/ui/label/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { GlobeIcon } from "@lucide/svelte";

	const { section = "preview" }: Props = $props();
	const models: Record<string, string> = { fable: "Fable 5.1", opus: "Opus 5.5", sonnet: "Sonnet 5.5" };
	const sizes = ["sm", "md", "lg"] as const;
	const roundings = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"] as const;
	let model = $state("opus");
	let sending = $state(false);
	let isSignedIn = $state(false);
	let textareaElement: HTMLTextAreaElement | undefined = $state();
	let formElement: HTMLFormElement | undefined = $state();
	let postedFields = $state("nothing yet");
	let customSubmitElement: HTMLElement | undefined = $state();

	/** Shows the fields a native submit would post, instead of leaving the page. */
	const showNativeFields = (e: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) => {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		const files = data.getAll("files").filter((value) => value instanceof File && value.size > 0);
		postedFields = `text: "${data.get("text")}", model: ${data.get("model")}, files: ${files.length}`;
	};

	/** Waits a moment like a request, then shows what was sent. */
	const sendPrompt = async (data: PromptInputData) => {
		await new Promise((resolve) => setTimeout(resolve, 1500));
		toast.success(`Sent to ${models[model] ?? model}`, { description: `${data.text} · ${data.files.length} file(s)` });
	};

	/** Live preview for one section of the prompt input docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "native" | "triggers" | "blocked" | "sizes" | "rounded";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Full prompt: text, images, a search toggle, a model picker, and the send button. -->
		<PromptInput class="demoFrame" bind:element={formElement} bind:sending onSubmit={sendPrompt} draftKey="plainsv-prompt-demo">
			<PromptInputFiles />
			<PromptInputTextarea bind:element={textareaElement} placeholder="Ask anything, or drop images here…" />
			<PromptInputActions>
				<PromptInputFilesButton />
				<PromptInputSelect rounded="lg" options={models} bind:selected={model} name="model" />
				<PromptInputSubmit rounded="lg" aria-label="Submit prompt" />
			</PromptInputActions>
		</PromptInput>
		<div class="demoRow">
			<Button variant="outline" size="sm" onclick={() => textareaElement?.focus()}>Focus the textarea</Button>
			<Button variant="outline" size="sm" onclick={() => formElement?.reset()}>Reset the form</Button>
		</div>
		<p class="demoText">Sending: {sending ? "yes" : "no"} · Model: {model}</p>
	{:else if section === "native"}
		<!-- No onSubmit: the form would post text, model, and files natively; this onsubmit shows them instead of leaving the page. -->
		<PromptInput class="demoFrame" onsubmit={showNativeFields}>
			<PromptInputFiles />
			<PromptInputTextarea placeholder="Type, attach an image, and send…" />
			<PromptInputActions>
				<PromptInputFilesButton />
				<PromptInputSelect options={models} name="model" />
				<PromptInputSubmit />
			</PromptInputActions>
		</PromptInput>
		<p class="demoText">Posted: {postedFields}</p>
	{:else if section === "triggers"}
		<!-- Plain buttons in place of the icon buttons; the files tooltip and the element binding still work. -->
		<PromptInput class="demoFrame" onSubmit={sendPrompt}>
			<PromptInputFiles />
			<PromptInputTextarea placeholder="Type, then send with the custom button…" />
			<PromptInputActions>
				<PromptInputFilesButton tooltip="Attach images">
					{#snippet trigger({ props })}
						<button class="demoTrigger" {...props}>Attach</button>
					{/snippet}
				</PromptInputFilesButton>
				<PromptInputSubmit bind:element={customSubmitElement}>
					{#snippet trigger({ props, sending })}
						<button class="demoTrigger demoSend" {...props}>{sending ? "Sending…" : "Send"}</button>
					{/snippet}
				</PromptInputSubmit>
			</PromptInputActions>
		</PromptInput>
		<p class="demoText">Bound send element: {customSubmitElement?.tagName.toLowerCase() ?? "none"}</p>
	{:else if section === "blocked"}
		<!-- Sending needs 5 characters and a signed-in user; blocked attempts show a hint. -->
		<div class="demoOption">
			<Switch id="demo-signed-in" bind:checked={isSignedIn} />
			<Label for="demo-signed-in">Signed in</Label>
		</div>
		<PromptInput class="demoFrame" minLength={5} canSubmit={isSignedIn} onSubmit={sendPrompt} onSubmitBlocked={() => toast.info(isSignedIn ? "Write at least 5 characters" : "Sign in to send prompts")}>
			<PromptInputTextarea placeholder="Press Enter to try sending…" />
			<PromptInputActions>
				<PromptInputSubmit />
			</PromptInputActions>
		</PromptInput>
	{:else if section === "sizes"}
		<!-- One prompt per size. -->
		{#each sizes as size (size)}
			<PromptInput class="demoFrame" {size} onSubmit={sendPrompt}>
				<PromptInputTextarea placeholder="Size {size}" />
				<PromptInputActions>
					<PromptInputFilesButton />
					<PromptInputSubmit />
				</PromptInputActions>
			</PromptInput>
		{/each}
	{:else if section === "rounded"}
		<!-- One prompt per radius; the controls round one step below the box, and read as pills from `2xl` up. -->
		{#each roundings as rounded (rounded)}
			<PromptInput class="demoFrame" {rounded} onSubmit={sendPrompt}>
				<PromptInputTextarea placeholder="Rounded {rounded}" />
				<PromptInputActions>
					<PromptInputFilesButton />
					<PromptInputButton><GlobeIcon /> Search</PromptInputButton>
					<PromptInputSelect options={models} />
					<PromptInputSubmit />
				</PromptInputActions>
			</PromptInput>
		{/each}
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-lg);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 2rem 0;
	}

	.demo :global(.demoFrame) {
		max-width: 36rem;
	}

	.demoText {
		margin: 0;
		color: var(--muted-foreground);
		font-size: var(--text-sm);
	}

	.demoRow {
		display: flex;
		gap: var(--spacing-sm);
	}

	.demoTrigger {
		cursor: pointer;
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		background: var(--background);
		padding: var(--spacing-xs) var(--spacing-md);
		color: var(--foreground);
		font-size: var(--text-sm);
	}

	.demoTrigger:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* The custom send button takes the end of the row, like the default one */
	.demoSend {
		margin-left: auto;
		border-color: var(--primary);
		background: var(--primary);
		color: var(--primary-foreground);
	}

	.demoOption {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
	}
</style>
