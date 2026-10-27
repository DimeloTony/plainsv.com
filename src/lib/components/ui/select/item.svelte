<script lang="ts">
	import { CheckIcon } from "@lucide/svelte";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { Attachment } from "svelte/attachments";
	import type { ItemProps } from "./index.js";
	const { value, disabled = false, label, rounded, children, class: className, ...props }: ItemProps = $props();
	const ctx = useCompCtx();
	const isSelected = $derived(ctx.value === value);

	/** Registers the item's text for SelectValue and typeahead, and handles pointer selection. */
	const registerItem: Attachment<HTMLDivElement> = (node) => {
		ctx.labels.set(value, label ?? node.querySelector(".selectItemText")?.textContent?.trim() ?? value);

		/** Selects the item unless it is disabled. */
		const handleClick = () => {
			if (!disabled) ctx.select(value);
		};
		/** Highlights the item under the pointer by focusing it. */
		const handlePointerMove = () => {
			if (!disabled && document.activeElement !== node) node.focus({ preventScroll: true });
		};
		/** Clears the highlight by focusing the list itself. */
		const handlePointerLeave = () => {
			if (document.activeElement === node) node.closest<HTMLElement>('[role="listbox"]')?.focus({ preventScroll: true });
		};

		// Listen directly so handlers passed through props still run.
		node.addEventListener("click", handleClick);
		node.addEventListener("pointermove", handlePointerMove);
		node.addEventListener("pointerleave", handlePointerLeave);
		return () => {
			// Remove the text when the item unmounts or its value or label changes; a rerun registers it again.
			ctx.labels.delete(value);
			node.removeEventListener("click", handleClick);
			node.removeEventListener("pointermove", handlePointerMove);
			node.removeEventListener("pointerleave", handlePointerLeave);
		};
	};
</script>

<!-- Option with a check mark while selected; focus marks the highlighted item. -->
<div class={["selectItem", className]} role="option" tabindex="-1" aria-selected={isSelected} aria-disabled={disabled || undefined} data-state={isSelected ? "checked" : "unchecked"} data-disabled={disabled || undefined} data-rounded={rounded} data-label={ctx.labels.get(value)} {@attach registerItem} {...props}>
	<span class="selectItemText">{@render children()}</span>
	{#if isSelected}
		<CheckIcon aria-hidden="true" />
	{/if}
</div>

<style>
	/* Base item; leaves room on the end for the check mark */
	.selectItem {
		display: flex;
		position: relative;
		align-items: center;
		gap: var(--spacing-sm);
		cursor: default;
		outline: none;
		border-radius: var(--select-inner-radius);
		padding-inline: var(--spacing-sm) calc(var(--select-icon) + var(--spacing-md));
		padding-block: var(--select-item-padding);
		user-select: none;
	}

	.selectItemText {
		display: flex;
		flex: 1;
		align-items: center;
		gap: var(--spacing-sm);
		white-space: nowrap;
	}

	/* Icons in the label and the check mark scale with the size */
	.selectItem :global(svg) {
		flex-shrink: 0;
		width: var(--select-icon);
		height: var(--select-icon);
		pointer-events: none;
	}

	.selectItemText :global(svg) {
		color: var(--muted-foreground);
	}

	/* Check mark pinned to the end */
	.selectItem > :global(svg) {
		position: absolute;
		right: var(--spacing-sm);
	}

	/* =============== States =============== */

	/* Highlighted by the pointer or the keyboard */
	.selectItem:focus {
		background-color: var(--accent);
		color: var(--accent-foreground);
	}

	/* Disabled state */
	.selectItem[data-disabled] {
		opacity: 50%;
		pointer-events: none;
	}

	/* =============== Rounded =============== */

	/* Overrides the list's item radius with this exact value */
	.selectItem[data-rounded="xs"] {
		border-radius: var(--radius-xs);
	}

	.selectItem[data-rounded="sm"] {
		border-radius: var(--radius-sm);
	}

	.selectItem[data-rounded="md"] {
		border-radius: var(--radius-md);
	}

	.selectItem[data-rounded="lg"] {
		border-radius: var(--radius-lg);
	}

	.selectItem[data-rounded="xl"] {
		border-radius: var(--radius-xl);
	}

	.selectItem[data-rounded="2xl"] {
		border-radius: var(--radius-2xl);
	}

	.selectItem[data-rounded="3xl"] {
		border-radius: var(--radius-3xl);
	}

	.selectItem[data-rounded="4xl"] {
		border-radius: var(--radius-4xl);
	}

	.selectItem[data-rounded="pill"] {
		border-radius: var(--radius-pill);
	}
</style>
