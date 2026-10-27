<script lang="ts">
	import { setCompCtx } from "./ctx.svelte.js";
	import { REGEXP_ONLY_DIGITS } from "./patterns.js";
	import type { Props } from "./index.js";
	import type { CompCtxProps } from "./ctx.svelte.js";
	let { value = $bindable(""), maxlength, pattern = REGEXP_ONLY_DIGITS, onValueChange, onComplete, disabled = false, "aria-invalid": ariaInvalid, size = "md", rounded, oninput, onfocus, onblur, onkeydown, onpointerup, children, class: className, ...props }: Props = $props();
	const caretKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];
	const contextData: Omit<CompCtxProps, "value"> = $derived({ maxlength, disabled: !!disabled, invalid: ariaInvalid === true || ariaInvalid === "true", size, rounded, onValueChange, onComplete });
	const ctx = setCompCtx({ ...contextData, value });
	const patternRegex = $derived(new RegExp(pattern));
	// Digit-only codes open the number pad on touch keyboards.
	const inputMode = $derived(pattern === REGEXP_ONLY_DIGITS ? "numeric" : "text");

	// Keep the shared settings in sync when the props change.
	$effect.pre(() => void Object.assign(ctx, contextData));

	// Keep the bindable prop and the shared value in sync in both directions.
	$effect.pre(() => void (ctx.value = value));
	$effect.pre(() => void (value = ctx.value));

	/** Keeps the caret after the last character, so the active slot is always the next one to fill. */
	const moveCaretToEnd = (input: HTMLInputElement) => input.setSelectionRange(input.value.length, input.value.length);

	/** Cleans and validates typed or pasted text before it reaches the slots. */
	const handleInput = (e: Event & { currentTarget: HTMLInputElement }) => {
		oninput?.(e);
		const input = e.currentTarget;
		// Remove whitespace, such as the space in a pasted "123 456", and cap the length.
		const nextValue = input.value.replace(/\s+/g, "").slice(0, ctx.maxlength);
		// If the new text breaks the pattern: restore the previous value.
		if (nextValue && !patternRegex.test(nextValue)) {
			input.value = ctx.value;
			return;
		}
		input.value = nextValue;
		ctx.setValue(nextValue);
	};

	/** Shows the active slot and parks the caret at the end. */
	const handleFocus = (e: FocusEvent & { currentTarget: HTMLInputElement }) => {
		onfocus?.(e);
		ctx.focused = true;
		moveCaretToEnd(e.currentTarget);
	};

	/** Hides the active slot. */
	const handleBlur = (e: FocusEvent) => {
		onblur?.(e);
		ctx.focused = false;
	};

	/** Blocks the keys that would move the caret away from the end. */
	const handleKeydown = (e: KeyboardEvent) => {
		onkeydown?.(e);
		// If the key moves the caret: keep it at the end instead.
		if (caretKeys.includes(e.key)) e.preventDefault();
	};

	/** Moves the caret back to the end after a click placed it between characters. */
	const handlePointerup = (e: PointerEvent & { currentTarget: HTMLInputElement }) => {
		onpointerup?.(e);
		moveCaretToEnd(e.currentTarget);
	};
</script>

<!-- Slots show the value; a transparent native input on top takes typing, pasting, and autofill. -->
<div class={["inputOtp not-typeset", className]} data-size={ctx.size} data-rounded={ctx.rounded} data-disabled={ctx.disabled}>
	{@render children()}
	<!-- No native maxlength, so a pasted code with spaces is cleaned before it is capped. -->
	<input class="inputOtpInput" type="text" autocomplete="one-time-code" inputmode={inputMode} spellcheck="false" value={ctx.value} {pattern} {disabled} aria-invalid={ariaInvalid} {...props} oninput={handleInput} onfocus={handleFocus} onblur={handleBlur} onkeydown={handleKeydown} onpointerup={handlePointerup} />
</div>

<style>
	/* Base container; isolates the active slot's z-index */
	.inputOtp {
		display: flex;
		position: relative;
		align-items: center;
		isolation: isolate;
		width: fit-content;
	}

	/* Native input stretched over the slots; its text, caret, and selection are invisible */
	.inputOtpInput {
		position: absolute;
		box-sizing: border-box;
		inset: 0;
		outline: none;
		border: 0;
		background-color: transparent;
		padding: 0;
		width: 100%;
		height: 100%;
		color: transparent;
		caret-color: transparent;
		font-size: 1rem; /* 16px keeps iOS from zooming in on focus */
	}

	.inputOtpInput::selection {
		background-color: transparent;
		color: transparent;
	}

	/* Delay the browser's autofill fill so it never covers the slots */
	.inputOtpInput:autofill {
		transition: background-color 0s 600000s;
		-webkit-text-fill-color: transparent;
	}

	/* =============== States =============== */

	/* Disabled state */
	.inputOtp[data-disabled="true"] {
		opacity: 50%;
	}

	.inputOtpInput:disabled {
		cursor: not-allowed;
	}

	/* =============== Sizes =============== */

	/* Large */
	.inputOtp[data-size="lg"] {
		gap: var(--spacing-sm);
	}

	/* Medium — default */
	.inputOtp[data-size="md"] {
		gap: var(--spacing-sm);
	}

	/* Small */
	.inputOtp[data-size="sm"] {
		gap: var(--spacing-xs);
	}

	/* Extra small */
	.inputOtp[data-size="xs"] {
		gap: var(--spacing-xs);
	}
</style>
