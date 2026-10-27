<script lang="ts">
	import { onDestroy, untrack } from "svelte";
	import { Input } from "#lib/components/ui/input/index.js";
	import { useCompCtx, useItemCtx } from "./ctx.svelte.js";
	import type { InputProps } from "./index.js";
	let { value = $bindable(), defaultValue = "", type = "text", disabled = false, oninput, class: className, ...props }: InputProps = $props();
	const ctx = useCompCtx();
	const item = useItemCtx();
	const id = $props.id();
	// Typed text; starts from the bound value or the default.
	let text = $state(value ?? defaultValue);
	const isDisabled = $derived(disabled || item.disabled);
	const isFilled = $derived(text.trim().length > 0);
	const isSelected = $derived(item.selectedIds.includes(id));
	// Register while rendering, so a starting answer is known before the first paint.
	const unregister = item.registerAnswer(
		{
			id,
			kind: "input",
			get disabled() {
				return isDisabled;
			},
			reset: () => (text = defaultValue),
		},
		text.trim().length > 0,
	);

	// Keep the bindable value and the typed text in sync in both directions.
	$effect.pre(() => void (value !== undefined && (text = value)));
	$effect.pre(() => void (value = text));

	// Text set from outside, such as a reset or a bound value, picks or clears the answer.
	$effect.pre(() => {
		const filled = isFilled;
		untrack(() => item.select(id, filled));
	});

	// Leave the question when the input unmounts.
	onDestroy(unregister);

	/** Picks the typed answer once it has text, and clears it when emptied. */
	const handleInput = (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		oninput?.(e);
		item.select(id, e.currentTarget.value.trim().length > 0);
	};
</script>

<!-- Free-text answer; submitted under the question's name only while it is the picked answer. -->
<Input {id} {type} class={["questionnaireInput", className]} size={ctx.size} rounded={ctx.rounded} name={isSelected && !item.skipped ? item.name : undefined} disabled={isDisabled} aria-invalid={item.isInvalid || undefined} aria-keyshortcuts={!isDisabled && isFilled ? "Enter" : undefined} data-filled={isFilled || undefined} data-empty={!isFilled || undefined} bind:value={text} oninput={handleInput} {...props} />

<style>
	/* Fills the question's width, like the choices */
	:global(.questionnaireInput) {
		width: 100%;
	}
</style>
