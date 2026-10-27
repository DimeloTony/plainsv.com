<script lang="ts">
	import { onDestroy, untrack } from "svelte";
	import { CheckIcon } from "@lucide/svelte";
	import { useItemCtx } from "./ctx.svelte.js";
	import type { ChoiceProps } from "./index.js";
	let { value, checked = $bindable(), defaultChecked = false, disabled = false, onchange, rounded, children, class: className, ...props }: ChoiceProps = $props();
	const item = useItemCtx();
	const id = $props.id();
	const isDisabled = $derived(disabled || item.disabled);
	const isChecked = $derived(item.selectedIds.includes(id));
	const shortcut = $derived(item.shortcutById.get(id));
	const type = $derived(item.multiple ? "checkbox" : "radio");
	// Register while rendering, so the starting answer is known before the first paint.
	const unregister = item.registerAnswer(
		{
			id,
			kind: "choice",
			get disabled() {
				return isDisabled;
			},
		},
		checked ?? defaultChecked,
	);

	// Keep the bindable checked state and the question's answers in sync in both directions.
	// The prop side is untracked past `checked`, so a sibling's pick cannot re-run it with a stale value.
	$effect.pre(() => {
		const nextChecked = checked;
		if (nextChecked !== undefined) untrack(() => item.select(id, nextChecked));
	});
	$effect.pre(() => void (checked = isChecked));

	// Leave the question when the choice unmounts.
	onDestroy(unregister);

	/** Picks or clears the choice, unless the passed handler prevented it. */
	const handleChange = (e: Event & { currentTarget: HTMLInputElement }) => {
		onchange?.(e);
		// If the passed handler called preventDefault: put the input back to the answer state.
		if (e.defaultPrevented) return void (e.currentTarget.checked = isChecked);
		item.select(id, e.currentTarget.checked);
	};
</script>

<!-- Choice card; the invisible native input covers it, so the whole card is clickable. -->
<label class={["questionnaireChoice", className]} data-type={type} data-checked={isChecked || undefined} data-disabled={isDisabled || undefined} data-invalid={item.isInvalid || undefined} data-shortcut={shortcut} data-rounded={rounded} {...props}>
	<input class="questionnaireChoiceInput" {id} {type} name={item.skipped ? undefined : item.name} {value} checked={isChecked} disabled={isDisabled} aria-invalid={item.isInvalid || undefined} aria-keyshortcuts={[shortcut, !isDisabled && isChecked ? "Enter" : undefined].filter(Boolean).join(" ") || undefined} onchange={handleChange} />
	<!-- Radio dot or checkbox tick. -->
	<span class="questionnaireChoiceIndicator" aria-hidden="true">
		{#if isChecked && type === "radio"}
			<span class="questionnaireChoiceDot"></span>
		{:else if isChecked}
			<CheckIcon />
		{/if}
	</span>
	<span class="questionnaireChoiceLabel">{@render children()}</span>
	{#if shortcut}
		<span class="questionnaireChoiceShortcut" aria-hidden="true">{shortcut}</span>
	{/if}
</label>

<style>
	/* Base choice card */
	.questionnaireChoice {
		display: flex;
		position: relative;
		align-items: flex-start;
		gap: calc(var(--spacing-sm) + var(--spacing-xs) / 2);
		transition:
			background-color 150ms,
			border-color 150ms,
			box-shadow 150ms;
		cursor: pointer;
		box-sizing: border-box;
		border: 1px solid var(--input);
		border-radius: var(--questionnaire-radius);
		background-color: transparent;
		padding: var(--questionnaire-choice-padding-block) var(--questionnaire-choice-padding-inline);
		min-height: var(--questionnaire-choice-min-height);
		font-size: var(--questionnaire-text);
		line-height: 1.375;
		user-select: none;
		text-align: start;
	}

	:global(.dark) .questionnaireChoice {
		background-color: color-mix(in oklab, var(--input) 20%, transparent);
	}

	.questionnaireChoice:hover {
		background-color: color-mix(in oklab, var(--muted) 50%, transparent);
	}

	/* Native input over the whole card, invisible but focusable and clickable */
	.questionnaireChoiceInput {
		position: absolute;
		opacity: 0;
		z-index: 1;
		cursor: pointer;
		margin: 0;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	/* Box or circle, centered on the first line of text */
	.questionnaireChoiceIndicator {
		display: flex;
		flex-shrink: 0;
		justify-content: center;
		align-items: center;
		transform: translateY(calc((1.375em - var(--questionnaire-indicator)) / 2));
		box-sizing: border-box;
		border: 1px solid var(--input);
		border-radius: var(--radius-xs);
		width: var(--questionnaire-indicator);
		height: var(--questionnaire-indicator);
	}

	:global(.dark) .questionnaireChoiceIndicator {
		background-color: color-mix(in oklab, var(--input) 30%, transparent);
	}

	.questionnaireChoice[data-type="radio"] .questionnaireChoiceIndicator {
		border-radius: var(--radius-pill);
	}

	.questionnaireChoiceIndicator :global(svg) {
		width: calc(var(--questionnaire-indicator) - 0.125rem);
		height: calc(var(--questionnaire-indicator) - 0.125rem);
	}

	.questionnaireChoiceDot {
		border-radius: var(--radius-pill);
		background-color: var(--primary-foreground);
		width: calc(var(--questionnaire-indicator) / 2);
		height: calc(var(--questionnaire-indicator) / 2);
	}

	/* Label text and an optional choice description */
	.questionnaireChoiceLabel {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: calc(var(--spacing-xs) / 2);
		min-width: 0;
	}

	/* Key that picks the choice */
	.questionnaireChoiceShortcut {
		display: inline-flex;
		flex-shrink: 0;
		justify-content: center;
		align-items: center;
		transform: translateY(calc((1.375em - 1.25rem) / 2));
		box-sizing: border-box;
		border: 1px solid var(--input);
		border-radius: var(--radius-md);
		background-color: var(--background);
		width: 1.25rem; /* 20px */
		height: 1.25rem; /* 20px */
		color: var(--muted-foreground);
		font-weight: 500;
		font-size: 0.625rem; /* 10px */
		line-height: 1;
		font-family: var(--font-mono, ui-monospace, monospace);
	}

	/* =============== States =============== */

	/* Picked */
	.questionnaireChoice[data-checked] {
		border-color: color-mix(in oklab, var(--primary) 40%, transparent);
		background-color: var(--muted);
	}

	.questionnaireChoice[data-checked] .questionnaireChoiceIndicator {
		border-color: var(--primary);
		background-color: var(--primary);
		color: var(--primary-foreground);
	}

	/* Keyboard focus ring on the card */
	.questionnaireChoice:has(> .questionnaireChoiceInput:focus-visible) {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
		border-color: var(--ring);
	}

	/* The question needs an answer */
	.questionnaireChoice[data-invalid] {
		border-color: var(--destructive);
	}

	/* Cannot be picked */
	.questionnaireChoice[data-disabled] {
		opacity: 0.5;
		cursor: not-allowed;
		pointer-events: none;
	}

	/* =============== Rounded =============== */

	/* Overrides the questionnaire radius for this choice */
	.questionnaireChoice[data-rounded="xs"] {
		border-radius: var(--radius-xs);
	}

	.questionnaireChoice[data-rounded="sm"] {
		border-radius: var(--radius-sm);
	}

	.questionnaireChoice[data-rounded="md"] {
		border-radius: var(--radius-md);
	}

	.questionnaireChoice[data-rounded="lg"] {
		border-radius: var(--radius-lg);
	}

	.questionnaireChoice[data-rounded="xl"] {
		border-radius: var(--radius-xl);
	}

	.questionnaireChoice[data-rounded="2xl"] {
		border-radius: var(--radius-2xl);
	}

	.questionnaireChoice[data-rounded="3xl"] {
		border-radius: var(--radius-3xl);
	}

	.questionnaireChoice[data-rounded="4xl"] {
		border-radius: var(--radius-4xl);
	}

	/* A true pill; tall content can clip at the corners, so use 3xl or 4xl to stay safe */
	.questionnaireChoice[data-rounded="pill"] {
		border-radius: var(--radius-pill);
	}
</style>
