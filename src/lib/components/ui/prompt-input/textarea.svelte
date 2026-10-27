<script lang="ts">
	import { onMount } from "svelte";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { TextareaProps } from "./index.js";
	let { element = $bindable(), name = "text", placeholder = "Ask anything…", onkeydown, oninput, class: className, ...props }: TextareaProps = $props();
	const ctx = useCompCtx();

	// Restore a saved draft when the prompt starts empty.
	onMount(() => {
		if (ctx.draftKey && !ctx.text) ctx.text = localStorage.getItem(ctx.draftKey) ?? "";
	});

	// Fit the height to the text whenever it or the size changes, such as typing, a restored draft, or a cleared prompt.
	$effect(() => {
		void ctx.text;
		void ctx.size;
		resize();
	});

	/** Grows the textarea to fit its text, one line height at a time, up to the max height where it scrolls. */
	function resize() {
		if (!element) return;
		// Reset first so the scroll height measures the text instead of the current height.
		element.style.height = "auto";
		element.style.height = `${element.scrollHeight}px`;
	}

	/** Sends on Enter; Shift and Enter, and Enter on touch keyboards, add a new line instead. */
	const handleKeydown = (e: KeyboardEvent & { currentTarget: EventTarget & HTMLTextAreaElement }) => {
		onkeydown?.(e);
		// If another handler took the key, text is being composed, or it is not a plain Enter: leave it.
		if (e.defaultPrevented || e.isComposing || e.key !== "Enter" || e.shiftKey) return;
		// If the device types on a touch keyboard: Enter adds a new line, and the send button sends.
		if (window.matchMedia("(pointer: coarse)").matches) return;
		e.preventDefault();
		// Submit through the form, so Enter runs the same `onsubmit`, `onSubmit`, or native submit as the send button.
		element?.form?.requestSubmit();
	};

	/** Saves the draft as the user types. */
	const handleInput = (e: Event & { currentTarget: EventTarget & HTMLTextAreaElement }) => {
		oninput?.(e);
		ctx.saveDraft();
	};
</script>

<!-- Prompt text; read-only while sending, so it stays visible and selectable. The top and bottom fade while it scrolls, in CSS alone. -->
<textarea bind:this={element} bind:value={ctx.text} class={["promptInputTextarea scroll-fade-y", className]} {name} {placeholder} rows="1" readonly={ctx.sending} onkeydown={handleKeydown} oninput={handleInput} {...props}></textarea>

<style>
	/* Borderless field that grows with its text */
	.promptInputTextarea {
		box-sizing: border-box;
		outline: none;
		border: 0;
		background: transparent;
		padding: 0;
		width: 100%;
		min-height: var(--prompt-input-min-height);
		max-height: 12rem; /* 192px */
		resize: none;
		color: inherit;
		font: inherit;
		font-size: var(--prompt-input-text);
		line-height: var(--prompt-input-line-height);
	}

	.promptInputTextarea::placeholder {
		color: var(--muted-foreground);
	}

	/* =============== States =============== */

	/* Sending */
	.promptInputTextarea[readonly] {
		cursor: not-allowed;
		color: var(--muted-foreground);
	}
</style>
