<script lang="ts">
	import { untrack } from "svelte";
	import { PlusIcon } from "@lucide/svelte";
	import { setCompCtx, PROMPT_INPUT_IMAGE_TYPES } from "./ctx.svelte.js";
	import type { Props } from "./index.js";
	import type { CompCtxProps } from "./ctx.svelte.js";
	let { element = $bindable(), text = $bindable(""), files = $bindable([]), sending = $bindable(false), onSubmit, onsubmit, onSubmitBlocked, canSubmit = true, minLength = 1, maxFiles = 5, accept = PROMPT_INPUT_IMAGE_TYPES, onFileReject, draftKey = "", size = "md", rounded = "3xl", children, class: className, ...props }: Props = $props();
	const contextData: Omit<CompCtxProps, "text" | "files" | "sending"> = $derived({ canSubmit, minLength, maxFiles, accept, draftKey, size, rounded, onSubmit, onFileReject });
	const ctx = setCompCtx({ ...contextData, text, files, sending });

	// Keep the shared settings in sync when the props change.
	$effect.pre(() => void Object.assign(ctx, contextData));

	// Keep the bindable props and the shared state in sync in both directions.
	$effect.pre(() => void (ctx.text = text));
	$effect.pre(() => void (text = ctx.text));
	$effect.pre(() => void (ctx.files = files));
	$effect.pre(() => void (files = ctx.files));
	$effect.pre(() => void (ctx.sending = sending));
	$effect.pre(() => void (sending = ctx.sending));

	// Release the previews of removed files, and all of them when the prompt unmounts.
	$effect(() => {
		void ctx.files;
		ctx.releasePreviews();
	});
	$effect(() => () => {
		for (const preview of ctx.previews.values()) URL.revokeObjectURL(preview);
	});

	// Copy the attached files into the hidden file input, so a native submit posts them.
	$effect(() => {
		void ctx.files;
		void ctx.fileInputEl;
		untrack(() => ctx.syncFileInput());
	});

	/** Runs the native `onsubmit`, then sends the prompt to `onSubmit`, or lets the form post natively without it. */
	const handleSubmit = (e: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) => {
		onsubmit?.(e);
		// If the native handler prevented the submit: leave it there.
		if (e.defaultPrevented) return;
		// If the prompt cannot be sent: report the blocked attempt, unless it is already sending.
		if (!ctx.isReady) {
			e.preventDefault();
			if (!ctx.sending) onSubmitBlocked?.();
			return;
		}
		// If there is an `onSubmit`: send the prompt to it instead of reloading the page.
		if (onSubmit) {
			e.preventDefault();
			void ctx.submit(e);
			return;
		}
		// Without one, the form posts natively with `text` and `files`; it stays sending until the page changes or the form resets.
		ctx.sending = true;
	};

	/** Clears the prompt and the sending state when the form resets. */
	const handleReset = () => {
		ctx.clear();
		ctx.sending = false;
	};

	/** Shows the drop zone while files are dragged in. */
	const handleDragenter = (e: DragEvent) => {
		// If the drag carries no files, such as selected text: leave it alone.
		if (!e.dataTransfer?.types.includes("Files")) return;
		e.preventDefault();
		if (!ctx.sending) ctx.isDragging = true;
	};

	/** Hides the drop zone once the drag leaves the box, ignoring moves between its children. */
	const handleDragleave = (e: DragEvent & { currentTarget: EventTarget & HTMLFormElement }) => {
		if (!(e.relatedTarget instanceof Node && e.currentTarget.contains(e.relatedTarget))) ctx.isDragging = false;
	};

	/** Attaches the dropped files. */
	const handleDrop = (e: DragEvent) => {
		ctx.isDragging = false;
		// If no files were dropped: let the browser handle it.
		if (!e.dataTransfer?.files.length) return;
		e.preventDefault();
		if (!ctx.sending) ctx.addFiles(e.dataTransfer.files);
	};
</script>

<!-- Prompt box; files can be dropped anywhere on it. -->
<form bind:this={element} class={["promptInput not-typeset", className]} data-size={size} data-rounded={rounded} data-dragging={ctx.isDragging || undefined} aria-busy={ctx.sending || undefined} onsubmit={handleSubmit} onreset={handleReset} ondragenter={handleDragenter} ondragover={(e) => e.preventDefault()} ondragleave={handleDragleave} ondrop={handleDrop} {...props}>
	<!-- Drop zone shown while files are dragged over the box. -->
	{#if ctx.isDragging}
		<div class="promptInputDropZone" aria-hidden="true">
			<PlusIcon />
			Drop images to add them to the prompt
		</div>
	{/if}
	{@render children()}
</form>

<style>
	/* Base box; the parts read the size variables */
	.promptInput {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		transition:
			box-shadow 150ms,
			border-color 150ms;
		box-sizing: border-box;
		border: 1px solid var(--border);
		background-color: var(--card);
		width: 100%;
		color: var(--card-foreground);
	}

	/* Dashed hint shown while dragging files over the box */
	.promptInputDropZone {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--spacing-xs);
		border: 1px dashed var(--border);
		border-radius: var(--radius-md);
		background-color: color-mix(in oklab, var(--muted) 30%, transparent);
		padding: var(--spacing-md);
		pointer-events: none;
		color: var(--muted-foreground);
		font-size: var(--text-xs);
	}

	.promptInputDropZone :global(svg) {
		width: 1rem; /* 16px */
		height: 1rem; /* 16px */
	}

	/* =============== States =============== */

	/* Soft ring while typing or using a control inside */
	.promptInput:focus-within {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 20%, transparent);
		border-color: color-mix(in oklab, var(--ring) 60%, transparent);
	}

	/* =============== Sizes =============== */

	.promptInput[data-size="xs"] {
		--prompt-input-text: var(--text-xs);
		--prompt-input-line-height: var(--line-height-xs);
		--prompt-input-min-height: 2rem; /* 32px */
		--prompt-input-chip-height: var(--control-height-xs);
		border-radius: var(--radius-md);
		padding: var(--spacing-sm);
	}

	.promptInput[data-size="sm"] {
		--prompt-input-text: var(--text-sm);
		--prompt-input-line-height: var(--line-height-sm);
		--prompt-input-min-height: 2.5rem; /* 40px */
		--prompt-input-chip-height: var(--control-height-xs);
		border-radius: var(--radius-lg);
		padding: calc(var(--spacing-sm) + var(--spacing-xs) / 2);
	}

	/* Medium matches the AI Elements prompt input, with its extra large radius */
	.promptInput[data-size="md"] {
		--prompt-input-text: var(--text-sm);
		--prompt-input-line-height: var(--line-height-sm);
		--prompt-input-min-height: 3rem; /* 48px */
		--prompt-input-chip-height: 1.75rem; /* 28px */
		border-radius: var(--radius-xl);
		padding: var(--spacing-md);
	}

	.promptInput[data-size="lg"] {
		--prompt-input-text: var(--text-md);
		--prompt-input-line-height: var(--line-height-md);
		--prompt-input-min-height: 3.5rem; /* 56px */
		--prompt-input-chip-height: var(--control-height-sm);
		border-radius: var(--radius-xl);
		padding: var(--spacing-lg);
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius; must stay after the size rules */
	.promptInput[data-rounded="xs"] {
		border-radius: var(--radius-xs);
	}

	.promptInput[data-rounded="sm"] {
		border-radius: var(--radius-sm);
	}

	.promptInput[data-rounded="md"] {
		border-radius: var(--radius-md);
	}

	.promptInput[data-rounded="lg"] {
		border-radius: var(--radius-lg);
	}

	.promptInput[data-rounded="xl"] {
		border-radius: var(--radius-xl);
	}

	.promptInput[data-rounded="2xl"] {
		border-radius: var(--radius-2xl);
	}

	.promptInput[data-rounded="3xl"] {
		border-radius: var(--radius-3xl);
	}

	.promptInput[data-rounded="4xl"] {
		border-radius: var(--radius-4xl);
	}

	/* A true pill; tall content can clip at the corners, so use 3xl or 4xl to stay safe */
	.promptInput[data-rounded="pill"] {
		border-radius: var(--radius-pill);
	}
</style>
