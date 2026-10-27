<script lang="ts">
	import { XIcon } from "@lucide/svelte";
	import { ImageViewer } from "#lib/components/ui/image-viewer/index.js";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { FilesProps } from "./index.js";
	let { element = $bindable(), name = "files", class: className, ...props }: FilesProps = $props();
	const ctx = useCompCtx();

	// Share the file input, so the files button can open it and the prompt can fill it for a native submit.
	$effect.pre(() => void (ctx.fileInputEl = element));

	/** Attaches the picked files, then puts every attached file back into the input. */
	const handleChange = (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		const input = e.currentTarget;
		if (input.files?.length) ctx.addFiles(Array.from(input.files));
		// The pick replaced the input's files, and refused files must not be posted, so restore the attached list.
		ctx.syncFileInput();
	};
</script>

<!-- Hidden file picker, opened by the files button. -->
<input bind:this={element} class="promptInputFileInput" type="file" {name} multiple accept={ctx.accept.join(",")} tabindex="-1" aria-hidden="true" onchange={handleChange} />

<!-- Attached images; each opens in a viewer where it can be renamed or removed. The edges fade while the row scrolls. -->
{#if ctx.promptFiles.length > 0}
	<ul class={["promptInputFiles scroll-fade-x", className]} aria-label="Attached files" {...props}>
		{#each ctx.promptFiles as promptFile (promptFile.id)}
			<li class="promptInputFile">
				<ImageViewer id={promptFile.id} src={promptFile.preview} title={promptFile.title} disabled={ctx.sending} onRemove={(id) => ctx.removeFile(id)} onTitleChange={({ id, newTitle }) => ctx.renameFile(id, newTitle)}>
					{#snippet trigger({ props: viewerProps })}
						<button type="button" class="promptInputFileOpen" {...viewerProps}>
							<img class="promptInputFileImage" src={promptFile.preview} alt="" />
							<span class="promptInputFileTitle">{promptFile.title}</span>
						</button>
					{/snippet}
				</ImageViewer>
				<button type="button" class="promptInputFileRemove" aria-label="Remove {promptFile.title}" disabled={ctx.sending} onclick={() => ctx.removeFile(promptFile.id)}>
					<XIcon />
				</button>
			</li>
		{/each}
	</ul>
{/if}

<style>
	.promptInputFileInput {
		display: none;
	}

	/* Row of chips that scrolls sideways when full */
	.promptInputFiles {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		margin: 0;
		padding: 0;
		overflow-x: auto;
		scrollbar-width: none;
		list-style: none;
	}

	.promptInputFile {
		position: relative;
		flex-shrink: 0;
	}

	/* Chip with a round thumbnail and the file name */
	.promptInputFileOpen {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		cursor: pointer;
		box-sizing: border-box;
		border: 1px solid var(--border);
		border-radius: var(--radius-pill);
		background-color: var(--background);
		padding: 0 var(--spacing-sm) 0 var(--spacing-xs);
		max-width: 10rem; /* 160px */
		height: var(--prompt-input-chip-height);
		color: var(--muted-foreground);
		font: inherit;
		font-size: var(--text-xs);
	}

	.promptInputFileOpen:hover {
		background-color: var(--accent);
		color: var(--accent-foreground);
	}

	.promptInputFileImage,
	.promptInputFileRemove {
		flex-shrink: 0;
		box-sizing: border-box;
		border-radius: var(--radius-pill);
		width: calc(var(--prompt-input-chip-height) - 0.5rem);
		height: calc(var(--prompt-input-chip-height) - 0.5rem);
	}

	.promptInputFileImage {
		border: 1px solid color-mix(in oklab, var(--muted-foreground) 50%, transparent);
		object-fit: cover;
	}

	.promptInputFileTitle {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/* Remove button over the thumbnail; shown while the chip is hovered or focused */
	.promptInputFileRemove {
		display: flex;
		position: absolute;
		top: 0.25rem;
		left: 0.25rem;
		justify-content: center;
		align-items: center;
		opacity: 0;
		transition: opacity 150ms;
		cursor: pointer;
		border: 0;
		background-color: var(--destructive);
		padding: 0.125rem;
		color: var(--background);
	}

	.promptInputFileRemove :global(svg) {
		width: 100%;
		height: 100%;
	}

	/* =============== States =============== */

	.promptInputFile:is(:hover, :focus-within) .promptInputFileRemove {
		opacity: 1;
	}

	.promptInputFileOpen:focus-visible,
	.promptInputFileRemove:focus-visible {
		outline: 2px solid var(--ring);
		outline-offset: 2px;
	}

	/* Sending */
	.promptInputFileOpen:disabled,
	.promptInputFileRemove:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.promptInputFile:is(:hover, :focus-within) .promptInputFileRemove:disabled {
		opacity: 0;
	}
</style>
