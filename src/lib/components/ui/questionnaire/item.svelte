<script lang="ts">
	import { onDestroy } from "svelte";
	import { setItemCtx } from "./ctx.svelte.js";
	import type { ItemProps } from "./index.js";
	import type { ItemCtxProps } from "./ctx.svelte.js";
	const { name, required = false, multiple = false, disabled = false, invalid = false, onStatusChange, "aria-describedby": ariaDescribedBy, children, class: className, ...props }: ItemProps = $props();
	const baseId = $props.id();
	const contextData: ItemCtxProps = $derived({ name, required, multiple, disabled, invalidProp: invalid, baseId });
	const item = setItemCtx({ ...contextData });
	// Register while rendering, so the server already knows the question order.
	const unregister = item.root?.registerItem(item);
	const describedBy = $derived([...item.descriptionIds, ...(item.isInvalid ? item.errorIds : []), ariaDescribedBy].filter(Boolean).join(" ") || undefined);
	// Keys announced to assistive technology while the question is active.
	const keyShortcuts = $derived.by(() => {
		if (!item.isActive) return undefined;
		const progress = item.root?.progress;
		const keys = ["Meta+Enter Control+Enter", item.enabledAnswers.length ? "ArrowUp ArrowDown" : "", progress?.first ? "" : "ArrowLeft", !progress?.last && item.status !== "unanswered" ? "ArrowRight" : ""];
		return keys.filter(Boolean).join(" ");
	});
	// Status reported last, so the callback only runs on a change.
	let previousStatus = item.status;

	// Keep the shared settings in sync when the props change.
	$effect.pre(() => void Object.assign(item, contextData));

	// Leave the questionnaire when the question unmounts.
	onDestroy(() => unregister?.());

	// Report when the question becomes answered, unanswered, or skipped.
	$effect(() => {
		const status = item.status;
		if (status === previousStatus) return;
		previousStatus = status;
		onStatusChange?.(status);
	});
</script>

<!-- One question; hidden and inert until it is the active one. -->
<fieldset bind:this={item.element} class={["questionnaireItem", className]} tabindex="-1" hidden={!item.isActive} inert={!item.isActive} {disabled} aria-describedby={describedBy} aria-keyshortcuts={keyShortcuts} data-active={item.isActive || undefined} data-status={item.status} data-required={required || undefined} data-multiple={multiple || undefined} data-disabled={disabled || undefined} data-invalid={item.isInvalid || undefined} {...props}>
	{@render children()}
</fieldset>

<style>
	/* Base question; resets the native fieldset frame */
	.questionnaireItem {
		display: flex;
		flex-direction: column;
		gap: var(--questionnaire-gap);
		margin: 0;
		outline: none;
		border: 0;
		padding: 0;
		min-width: 0;
	}

	/* The flex display would otherwise override the hidden attribute */
	.questionnaireItem[hidden] {
		display: none;
	}
</style>
