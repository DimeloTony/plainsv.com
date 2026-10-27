<script lang="ts">
	import { setCompCtx } from "./ctx.svelte.js";
	import type { Props } from "./index.js";
	import type { CompCtxProps } from "./ctx.svelte.js";
	let { item = $bindable(), defaultItem, onItemChange, shortcuts, size = "md", rounded = "lg", onsubmit, onreset, onkeydown, children, class: className, ...props }: Props = $props();
	const contextData: Omit<CompCtxProps, "activeName"> = $derived({ shortcuts: shortcuts ?? null, size, rounded, onItemChange });
	const ctx = setCompCtx({ ...contextData, activeName: item ?? defaultItem ?? "" });

	// Keep the shared settings in sync when the props change.
	$effect.pre(() => void Object.assign(ctx, contextData));

	// Keep the bindable active question and the shared state in sync in both directions.
	$effect.pre(() => void (item !== undefined && (ctx.activeName = item)));
	$effect.pre(() => void (item = ctx.activeName || undefined));

	// When the named question is missing or disabled, the first enabled one shows; report its name.
	$effect.pre(() => {
		const activeName = ctx.activeItem?.name;
		if (activeName && activeName !== ctx.activeName) ctx.activeName = activeName;
	});

	/** Blocks submitting until every question is valid, then runs the passed handler. */
	const handleSubmit = (e: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) => {
		if (ctx.handleSubmit(e)) onsubmit?.(e);
	};

	/** Restores the default answers and the starting question, unless the passed handler prevented it. */
	const handleReset = (e: Event & { currentTarget: EventTarget & HTMLFormElement }) => {
		onreset?.(e);
		// If the passed handler called preventDefault: keep everything as it is.
		if (e.defaultPrevented) return;
		// The answers live in component state, so reset them there instead of in the DOM.
		e.preventDefault();
		ctx.reset(defaultItem);
	};

	/** Runs the passed key handler, then the questionnaire keys unless it prevented them. */
	const handleKeydown = (e: KeyboardEvent & { currentTarget: EventTarget & HTMLFormElement }) => {
		onkeydown?.(e);
		ctx.handleKeydown(e);
	};
</script>

<!-- Form that shows one question at a time; validation is handled per question instead of by the browser. -->
<form bind:this={ctx.formEl} class={["questionnaire not-typeset", className]} novalidate data-size={size} data-rounded={rounded} data-current={ctx.progress.current} data-total={ctx.progress.total} data-first={ctx.progress.first || undefined} data-last={ctx.progress.last || undefined} data-shortcuts={shortcuts} onsubmit={handleSubmit} onreset={handleReset} onkeydown={handleKeydown} {...props}>
	{@render children()}
</form>

<style>
	/* Base questionnaire; the parts read the size variables */
	.questionnaire {
		display: flex;
		flex-direction: column;
		gap: var(--questionnaire-gap);
		width: 100%;
		min-width: 0;
	}

	/* =============== Sizes =============== */

	.questionnaire[data-size="xs"] {
		--questionnaire-gap: var(--spacing-sm);
		--questionnaire-text: var(--text-xs);
		--questionnaire-title-text: var(--text-sm);
		--questionnaire-choice-min-height: var(--control-height-sm);
		--questionnaire-choice-padding-block: calc(var(--spacing-xs) * 1.5);
		--questionnaire-choice-padding-inline: var(--spacing-sm);
		--questionnaire-indicator: 0.875rem; /* 14px */
		--questionnaire-radius: var(--radius-xs);
	}

	.questionnaire[data-size="sm"] {
		--questionnaire-gap: var(--spacing-md);
		--questionnaire-text: var(--text-sm);
		--questionnaire-title-text: var(--text-sm);
		--questionnaire-choice-min-height: var(--control-height-lg);
		--questionnaire-choice-padding-block: var(--spacing-sm);
		--questionnaire-choice-padding-inline: calc(var(--spacing-sm) + var(--spacing-xs) / 2);
		--questionnaire-indicator: 1rem; /* 16px */
		--questionnaire-radius: var(--radius-sm);
	}

	/* Medium matches the shadcn questionnaire: 44px choices with 10px by 12px padding */
	.questionnaire[data-size="md"] {
		--questionnaire-gap: var(--spacing-lg);
		--questionnaire-text: var(--text-sm);
		--questionnaire-title-text: var(--text-md);
		--questionnaire-choice-min-height: 2.75rem; /* 44px */
		--questionnaire-choice-padding-block: calc(var(--spacing-sm) + var(--spacing-xs) / 2);
		--questionnaire-choice-padding-inline: var(--spacing-md);
		--questionnaire-indicator: 1rem; /* 16px */
		--questionnaire-radius: var(--radius-md);
	}

	.questionnaire[data-size="lg"] {
		--questionnaire-gap: var(--spacing-xl);
		--questionnaire-text: var(--text-md);
		--questionnaire-title-text: calc(var(--text-md) * 1.125);
		--questionnaire-choice-min-height: 3rem; /* 48px */
		--questionnaire-choice-padding-block: var(--spacing-md);
		--questionnaire-choice-padding-inline: var(--spacing-lg);
		--questionnaire-indicator: 1.125rem; /* 18px */
		--questionnaire-radius: var(--radius-lg);
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius of the choices and inputs; must stay after the size rules */
	.questionnaire[data-rounded="xs"] {
		--questionnaire-radius: var(--radius-xs);
	}

	.questionnaire[data-rounded="sm"] {
		--questionnaire-radius: var(--radius-sm);
	}

	.questionnaire[data-rounded="md"] {
		--questionnaire-radius: var(--radius-md);
	}

	.questionnaire[data-rounded="lg"] {
		--questionnaire-radius: var(--radius-lg);
	}

	.questionnaire[data-rounded="xl"] {
		--questionnaire-radius: var(--radius-xl);
	}

	.questionnaire[data-rounded="2xl"] {
		--questionnaire-radius: var(--radius-2xl);
	}

	.questionnaire[data-rounded="3xl"] {
		--questionnaire-radius: var(--radius-3xl);
	}

	.questionnaire[data-rounded="4xl"] {
		--questionnaire-radius: var(--radius-4xl);
	}

	/* A true pill; tall content can clip at the corners, so use 3xl or 4xl to stay safe */
	.questionnaire[data-rounded="pill"] {
		--questionnaire-radius: var(--radius-pill);
	}
</style>
