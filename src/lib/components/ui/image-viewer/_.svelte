<script lang="ts">
	import { tick } from "svelte";
	import { Button } from "#lib/components/ui/button/index.js";
	import { Dialog, DialogTrigger, DialogContent } from "#lib/components/ui/dialog/index.js";
	import { PencilLineIcon, CheckIcon, Trash2Icon } from "@lucide/svelte";
	import type { Attachment } from "svelte/attachments";
	import type { Props } from "./index.js";

	let { id, src, title, trigger: renderTrigger, disabled, open = $bindable(false), size = "md", rounded, onTitleChange, onRemove, class: className, ...props }: Props = $props();
	let isEditing = $state(false);
	let draftTitle = $state("");
	let titleElement: HTMLSpanElement | undefined = $state();
	const actionSizes = { xs: "icon-xs", sm: "icon-xs", md: "icon-sm", lg: "icon-md" } as const;

	const hasHeader = $derived(onTitleChange !== undefined || onRemove !== undefined);

	/** Leaves edit mode once the viewer content unmounts so it reopens in view mode. */
	const resetOnClose: Attachment<HTMLElement> = () => () => (isEditing = false);

	/** Handles Escape: leaves edit mode first, then closes the viewer. */
	const handleCancel = (e: Event) => {
		// Keep the dialog mounted so Svelte can run the outro transition.
		e.preventDefault();
		// If the title is being edited: discard the draft instead of closing.
		if (isEditing) cancelEditing();
		else open = false;
	};

	/** Tracks the edited title text. */
	const handleTitleInput = (e: Event) => {
		draftTitle = (e.currentTarget as HTMLSpanElement).textContent ?? "";
	};

	/** Saves the title on Enter instead of inserting a new line. */
	const handleTitleKeydown = (e: KeyboardEvent) => {
		if (e.key !== "Enter") return;
		e.preventDefault();
		saveTitle();
	};

	/** Enters edit mode and places the cursor at the end of the title. */
	const startEditing = async () => {
		// If the title is not editable or already being edited: do nothing.
		if (!onTitleChange || disabled || isEditing) return;
		draftTitle = title;
		isEditing = true;
		// Wait for the span to become editable before focusing it.
		await tick();
		if (!titleElement) return;
		titleElement.focus();
		const range = document.createRange();
		range.selectNodeContents(titleElement);
		range.collapse(false);
		const selection = window.getSelection();
		selection?.removeAllRanges();
		selection?.addRange(range);
	};

	/** Leaves edit mode; the keyed title span re-renders with the saved title. */
	const cancelEditing = () => {
		isEditing = false;
	};

	/** Saves the edited title and closes the viewer when it changed. */
	const saveTitle = () => {
		const newTitle = draftTitle.trim();
		// If the title is empty or unchanged: just leave edit mode.
		if (!onTitleChange || newTitle === "" || newTitle === title) return cancelEditing();
		onTitleChange({ id, newTitle });
		title = newTitle;
		isEditing = false;
		open = false;
	};
</script>

<!-- Full-screen viewer built on Dialog; its oncancel overrides the dialog's so Escape can leave edit mode first. -->
<Dialog bind:open variant="ghost" class={["imageViewer not-typeset", className]} data-size={size} data-rounded={rounded} aria-label={title} oncancel={handleCancel} {...props}>
	<!-- Trigger that opens the viewer, with the viewer's disabled and popup state added. -->
	<DialogTrigger>
		{#snippet trigger({ props: openProps })}
			{@render renderTrigger({ props: { ...openProps, disabled, "aria-haspopup": "dialog" } })}
		{/snippet}
	</DialogTrigger>

	<DialogContent>
		<article class="content" {@attach resetOnClose}>
			<!-- Title header, shown only when the image can be renamed or removed. -->
			{#if hasHeader}
				<header class="header">
					<!-- Recreate the span when edit mode toggles so user edits never leave a stale text node. -->
					{#key isEditing}
						<span bind:this={titleElement} class="title" contenteditable={isEditing ? "plaintext-only" : "false"} role={isEditing ? "textbox" : undefined} aria-label={isEditing ? "Image title" : undefined} oninput={handleTitleInput} onkeydown={handleTitleKeydown} ondblclick={startEditing}>{title}</span>
					{/key}
					{#if onTitleChange}
						{#if isEditing}
							<Button variant="ghost" size={actionSizes[size]} {disabled} aria-label="Save title" onclick={saveTitle}>
								<CheckIcon />
							</Button>
						{:else}
							<Button variant="ghost" size={actionSizes[size]} {disabled} aria-label="Edit title" onclick={startEditing}>
								<PencilLineIcon />
							</Button>
						{/if}
					{/if}
					{#if onRemove}
						<Button variant="ghost" size={actionSizes[size]} {disabled} aria-label="Remove image" onclick={() => onRemove(id)}>
							<Trash2Icon />
						</Button>
					{/if}
				</header>
			{/if}

			<img class="image" {src} alt={title} />
		</article>
	</DialogContent>
</Dialog>

<style>
	/* Base viewer; the dialog element is rendered by Dialog, so its root styles are global */
	:global(.imageViewer) {
		--viewer-padding: var(--spacing-xl);
		--viewer-header-height: 0px;
	}

	/* Drops the Dialog panel chrome so the article below draws the border and radius */
	:global(.dialog.imageViewer > .content) {
		border: none;
		border-radius: 0;
		padding: 0;
		overflow: visible;
	}

	.content {
		display: flex;
		flex-direction: column;
		border: 1px solid var(--border);
		background-color: var(--popover);
		overflow: hidden;
		color: var(--popover-foreground);
	}

	.header {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		border-bottom: 1px solid var(--border);
		height: var(--viewer-header-height);
	}

	/* Fills the header so the delete button sits at the end */
	.title {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.title:focus {
		outline: none;
	}

	/* Fits inside the viewport, minus the viewer padding, panel border, and header */
	.image {
		display: block;
		width: auto;
		max-width: calc(100dvw - 2 * var(--viewer-padding) - 2px);
		height: auto;
		max-height: calc(100dvh - 2 * var(--viewer-padding) - 2px);
		object-fit: contain;
		pointer-events: none;
	}

	.header + .image {
		max-height: calc(100dvh - 2 * var(--viewer-padding) - 2px - var(--viewer-header-height) - 1px);
	}

	/* =============== States =============== */

	/* Shows a text cursor while the title is editable */
	.title[contenteditable="plaintext-only"] {
		cursor: text;
	}

	/* =============== Sizes =============== */

	/* Large */
	:global(.imageViewer[data-size="lg"]) {
		--viewer-header-height: var(--control-height-lg);
	}

	:global(.imageViewer[data-size="lg"]) .content {
		border-radius: var(--radius-lg);
	}

	:global(.imageViewer[data-size="lg"]) .header {
		padding-inline: var(--spacing-md) var(--spacing-xs);
	}

	:global(.imageViewer[data-size="lg"]) .title {
		font-size: var(--text-md);
		line-height: var(--line-height-md);
	}

	/* Medium — default */
	:global(.imageViewer[data-size="md"]) {
		--viewer-header-height: var(--control-height-md);
	}

	:global(.imageViewer[data-size="md"]) .content {
		border-radius: var(--radius-md);
	}

	:global(.imageViewer[data-size="md"]) .header {
		padding-inline: var(--spacing-md) var(--spacing-xs);
	}

	:global(.imageViewer[data-size="md"]) .title {
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Small */
	:global(.imageViewer[data-size="sm"]) {
		--viewer-header-height: var(--control-height-sm);
	}

	:global(.imageViewer[data-size="sm"]) .content {
		border-radius: var(--radius-sm);
	}

	:global(.imageViewer[data-size="sm"]) .header {
		padding-inline: var(--spacing-sm) var(--spacing-xs);
	}

	:global(.imageViewer[data-size="sm"]) .title {
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* Extra small */
	:global(.imageViewer[data-size="xs"]) {
		--viewer-header-height: var(--control-height-xs);
	}

	:global(.imageViewer[data-size="xs"]) .content {
		border-radius: var(--radius-xs);
	}

	:global(.imageViewer[data-size="xs"]) .header {
		padding-inline: var(--spacing-sm) 0;
	}

	:global(.imageViewer[data-size="xs"]) .title {
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius; must stay after the size rules */
	:global(.imageViewer[data-rounded="xs"]) .content {
		border-radius: var(--radius-xs);
	}

	:global(.imageViewer[data-rounded="sm"]) .content {
		border-radius: var(--radius-sm);
	}

	:global(.imageViewer[data-rounded="md"]) .content {
		border-radius: var(--radius-md);
	}

	:global(.imageViewer[data-rounded="lg"]) .content {
		border-radius: var(--radius-lg);
	}

	:global(.imageViewer[data-rounded="xl"]) .content {
		border-radius: var(--radius-xl);
	}

	:global(.imageViewer[data-rounded="2xl"]) .content {
		border-radius: var(--radius-2xl);
	}

	:global(.imageViewer[data-rounded="3xl"]) .content {
		border-radius: var(--radius-3xl);
	}

	:global(.imageViewer[data-rounded="4xl"]) .content {
		border-radius: var(--radius-4xl);
	}

	/* A true pill; tall content can clip at the corners, so use 3xl or 4xl to stay safe */
	:global(.imageViewer[data-rounded="pill"]) .content {
		border-radius: var(--radius-pill);
	}
</style>
