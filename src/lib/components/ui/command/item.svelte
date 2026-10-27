<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	import type { Attachment } from "svelte/attachments";
	import type { ItemProps } from "./index.js";
	const { value, keywords = [], disabled = false, onSelect, rounded, children, class: className, ...props }: ItemProps = $props();
	const ctx = useCompCtx();
	const itemId = $props.id();
	let itemText = $state("");
	const itemValue = $derived(value ?? itemText);
	const isVisible = $derived(ctx.isVisible(itemId));
	const isHighlighted = $derived(itemValue !== "" && ctx.value === itemValue);

	/** Reads the item's text, leaving out any shortcut hint. */
	const readText = (node: HTMLElement) =>
		[...node.childNodes]
			.filter((child) => !(child instanceof HTMLElement && child.classList.contains("commandShortcut")))
			.map((child) => child.textContent ?? "")
			.join("")
			.trim();

	/** Registers the item's search text, and handles pointer highlight and selection. */
	const registerItem: Attachment<HTMLDivElement> = (node) => {
		const text = readText(node);
		const resolvedValue = value ?? text;
		itemText = text;
		ctx.items.set(itemId, { value: resolvedValue, text, keywords });

		/** Highlights the item under the pointer unless it is disabled. */
		const handlePointerMove = () => {
			if (!disabled) ctx.highlight(resolvedValue);
		};
		/** Highlights and selects the item unless it is disabled. */
		const handleClick = () => {
			// If the item is disabled: ignore the click.
			if (disabled) return;
			ctx.highlight(resolvedValue);
			onSelect?.(resolvedValue);
		};

		// Listen directly so handlers passed through props still run.
		node.addEventListener("pointermove", handlePointerMove);
		node.addEventListener("click", handleClick);
		return () => {
			// Remove the search data when the item unmounts or its value or keywords change; a rerun registers it again.
			ctx.items.delete(itemId);
			node.removeEventListener("pointermove", handlePointerMove);
			node.removeEventListener("click", handleClick);
		};
	};

	/** Scrolls the list, not the page, so the highlighted item stays in view. */
	const keepInView: Attachment<HTMLDivElement> = (node) => {
		// If the item is not highlighted: leave the scroll position alone.
		if (!isHighlighted) return;
		const list = node.closest<HTMLElement>('[role="listbox"]');
		if (!list) return;
		const listRect = list.getBoundingClientRect();
		const rect = node.getBoundingClientRect();
		// Scroll by the amount the item sits past the top or bottom edge.
		if (rect.top < listRect.top) list.scrollTop -= listRect.top - rect.top;
		else if (rect.bottom > listRect.bottom) list.scrollTop += rect.bottom - listRect.bottom;
	};
</script>

<!-- Option that the search filters; the highlight follows the keyboard and the pointer. -->
<div class={["commandItem", className]} id={itemId} role="option" aria-selected={isHighlighted} aria-disabled={disabled || undefined} data-value={itemValue} data-selected={isHighlighted || undefined} data-disabled={disabled || undefined} data-rounded={rounded} hidden={!isVisible} {@attach registerItem} {@attach keepInView} {...props}>
	{@render children()}
</div>

<style>
	/* Base item */
	.commandItem {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		cursor: default;
		outline: none;
		border-radius: var(--command-inner-radius);
		padding: var(--command-item-padding) var(--command-item-padding-inline);
		user-select: none;
	}

	/* Icons scale with the size */
	.commandItem :global(svg) {
		flex-shrink: 0;
		width: var(--command-icon);
		height: var(--command-icon);
		pointer-events: none;
		color: var(--muted-foreground);
	}

	/* Filtered out by the search */
	.commandItem[hidden] {
		display: none;
	}

	/* =============== States =============== */

	/* Highlighted by the keyboard or the pointer */
	.commandItem[data-selected] {
		background-color: var(--accent);
		color: var(--accent-foreground);
	}

	/* Disabled state */
	.commandItem[data-disabled] {
		opacity: 50%;
		pointer-events: none;
	}

	/* =============== Rounded =============== */

	/* Overrides the list's item radius with this exact value */
	.commandItem[data-rounded="xs"] {
		border-radius: var(--radius-xs);
	}

	.commandItem[data-rounded="sm"] {
		border-radius: var(--radius-sm);
	}

	.commandItem[data-rounded="md"] {
		border-radius: var(--radius-md);
	}

	.commandItem[data-rounded="lg"] {
		border-radius: var(--radius-lg);
	}

	.commandItem[data-rounded="xl"] {
		border-radius: var(--radius-xl);
	}

	.commandItem[data-rounded="2xl"] {
		border-radius: var(--radius-2xl);
	}

	.commandItem[data-rounded="3xl"] {
		border-radius: var(--radius-3xl);
	}

	.commandItem[data-rounded="4xl"] {
		border-radius: var(--radius-4xl);
	}

	.commandItem[data-rounded="pill"] {
		border-radius: var(--radius-pill);
	}
</style>
