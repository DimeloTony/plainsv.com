<script lang="ts">
	import { tick } from "svelte";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { Attachment } from "svelte/attachments";
	import type { ContentProps } from "./index.js";
	const { size, rounded, children, class: className, ...props }: ContentProps = $props();
	const ctx = useCompCtx();
	// Gap in pixels between the trigger and the list, and between the list and the viewport edges.
	const SIDE_OFFSET = 4;
	const VIEWPORT_PADDING = 8;
	// Enabled items, in order; disabled items are skipped by the keyboard.
	const ITEM_SELECTOR = '[role="option"]:not([data-disabled])';
	let placement: Placement = $state({ x: 0, y: 0, minWidth: 0, maxHeight: 0, side: "bottom" });
	// Typed characters for typeahead, cleared after a pause.
	let search = "";
	let searchTimer: ReturnType<typeof setTimeout> | undefined;

	/** Clamps a value between a minimum and maximum; the minimum wins when they cross. */
	const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

	/** Places the list below the trigger, or above it when it does not fit and there is more room there. */
	const updatePlacement = (node: HTMLElement) => {
		// If the trigger is not registered yet: keep the last placement.
		if (!ctx.triggerEl) return;
		const rect = ctx.triggerEl.getBoundingClientRect();
		const viewportWidth = document.documentElement.clientWidth;
		const viewportHeight = document.documentElement.clientHeight;
		const spaceBelow = viewportHeight - rect.bottom - SIDE_OFFSET - VIEWPORT_PADDING;
		const spaceAbove = rect.top - SIDE_OFFSET - VIEWPORT_PADDING;
		// Full height of the items plus the borders, ignoring the current max height.
		const naturalHeight = node.scrollHeight + node.offsetHeight - node.clientHeight;
		const side = naturalHeight > spaceBelow && spaceAbove > spaceBelow ? "top" : "bottom";
		const maxHeight = side === "bottom" ? spaceBelow : spaceAbove;
		const height = Math.min(naturalHeight, maxHeight);
		// At least as wide as the trigger, shifted to stay inside the viewport.
		const width = Math.max(node.offsetWidth, rect.width);
		const x = clamp(rect.left, VIEWPORT_PADDING, viewportWidth - width - VIEWPORT_PADDING);
		const y = side === "bottom" ? rect.bottom + SIDE_OFFSET : rect.top - SIDE_OFFSET - height;
		placement = { x, y, minWidth: rect.width, maxHeight, side };
	};

	/** Focuses an item and scrolls it into view inside the list. */
	const focusItem = (item: HTMLElement | null | undefined) => {
		item?.focus({ preventScroll: true });
		item?.scrollIntoView({ block: "nearest" });
	};

	/** Moves focus to the item whose text starts with the typed characters. */
	const typeahead = (key: string, items: HTMLElement[], currentIndex: number) => {
		search += key.toLowerCase();
		clearTimeout(searchTimer);
		searchTimer = setTimeout(() => (search = ""), 1000);
		// Repeating one letter cycles through the items that start with it.
		const isRepeat = [...search].every((char) => char === search[0]);
		const query = isRepeat ? search[0] : search;
		const start = isRepeat ? currentIndex + 1 : Math.max(currentIndex, 0);
		const ordered = [...items.slice(start), ...items.slice(0, start)];
		focusItem(ordered.find((item) => (item.dataset.label ?? "").toLowerCase().startsWith(query)));
	};

	/** Shows or hides the popover to match the open state, and handles placement and keys while open. */
	const syncPopover: Attachment<HTMLDivElement> = (node) => {
		const supportsPopover = typeof node.showPopover === "function";
		// If the select is closed: hide the list if it is still showing.
		if (!ctx.open) {
			if (supportsPopover && node.matches(":popover-open")) node.hidePopover();
			return;
		}
		// Show in the top layer so no ancestor's overflow or z-index can clip the list.
		if (supportsPopover && !node.matches(":popover-open")) node.showPopover();
		updatePlacement(node);
		// Focus the selected item once the new size and position apply, so it scrolls into view.
		tick().then(() => focusItem(node.querySelector<HTMLElement>(`${ITEM_SELECTOR}[aria-selected="true"]`) ?? node.querySelector<HTMLElement>(ITEM_SELECTOR)));

		const update = () => updatePlacement(node);
		/** Moves between items, selects, and searches with the keyboard. */
		const handleKeydown = (e: KeyboardEvent) => {
			const items = [...node.querySelectorAll<HTMLElement>(ITEM_SELECTOR)];
			const currentIndex = items.findIndex((item) => item === document.activeElement);
			// If a search is in progress or a character was typed: search, so Space can join a search.
			if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && (search || e.key !== " ")) {
				e.preventDefault();
				typeahead(e.key, items, currentIndex);
				return;
			}
			const keyIndexes: Record<string, number> = { ArrowDown: Math.min(currentIndex + 1, items.length - 1), ArrowUp: Math.max(currentIndex - 1, 0), Home: 0, End: items.length - 1 };
			if (e.key in keyIndexes) {
				e.preventDefault();
				focusItem(items[keyIndexes[e.key]]);
			} else if ((e.key === "Enter" || e.key === " ") && currentIndex !== -1) {
				// Enter and Space select the focused item.
				e.preventDefault();
				items[currentIndex].click();
			} else if (e.key === "Tab") {
				// Tab closes the list instead of moving focus out of it.
				e.preventDefault();
				ctx.setOpen(false);
			}
		};

		// Follow the trigger through scrolling, resizing, and item changes.
		const observer = new ResizeObserver(update);
		observer.observe(ctx.triggerEl ?? node);
		window.addEventListener("scroll", update, { capture: true, passive: true });
		window.addEventListener("resize", update);
		node.addEventListener("keydown", handleKeydown);
		return () => {
			observer.disconnect();
			clearTimeout(searchTimer);
			search = "";
			window.removeEventListener("scroll", update, { capture: true });
			window.removeEventListener("resize", update);
			node.removeEventListener("keydown", handleKeydown);
		};
	};

	/** Syncs the open state after the browser closes the list itself, such as on an outside click or Escape. */
	const handleToggle = (e: ToggleEvent & { currentTarget: HTMLDivElement }) => {
		// Read the popover's current state, since this event fires after the change and may be coalesced.
		const isOpen = e.currentTarget.matches(":popover-open");
		ctx.setOpen(isOpen);
		// If focus dropped to the page when the list closed: return it to the trigger.
		if (!isOpen && document.activeElement === document.body) ctx.triggerEl?.focus();
	};

	/** Position and size of the list in viewport pixels */
	interface Placement {
		/** Left edge of the list */
		x: number;
		/** Top edge of the list */
		y: number;
		/** Trigger width, so the list is never narrower */
		minWidth: number;
		/** Room on the chosen side; the list scrolls past it */
		maxHeight: number;
		/** Side of the trigger the list opened on */
		side: "top" | "bottom";
	}
</script>

<!-- Listbox kept mounted while closed, so items can register the text that SelectValue shows. -->
<div class={["selectContent not-typeset", className]} id={ctx.contentId} role="listbox" tabindex="-1" popover="auto" aria-labelledby={ctx.triggerEl?.id || undefined} data-state={ctx.open ? "open" : "closed"} data-side={placement.side} data-size={size ?? ctx.size} data-rounded={rounded ?? ctx.rounded} style:left="{placement.x}px" style:top="{placement.y}px" style:min-width="{placement.minWidth}px" style:max-height="{placement.maxHeight}px" {@attach syncPopover} ontoggle={handleToggle} {...props}>
	{@render children()}
</div>

<style>
	/* Base list; resets the popover defaults so the computed position applies */
	.selectContent {
		position: fixed;
		z-index: 50; /* Only applies where the popover top layer is unavailable */
		transition-duration: 150ms;
		transition-property: opacity, transform;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		box-sizing: border-box;
		margin: 0;
		inset: auto;
		outline: none;
		border: 1px solid var(--border);
		background-color: var(--popover);
		padding: var(--spacing-xs);
		overflow-x: hidden;
		overflow-y: auto;
		color: var(--popover-foreground);
	}

	/* Grows out of the trigger when it opens */
	.selectContent[data-side="bottom"] {
		transform-origin: top;
	}

	.selectContent[data-side="top"] {
		transform-origin: bottom;
	}

	@starting-style {
		.selectContent[data-state="open"] {
			transform: scale(0.95);
			opacity: 0;
		}
	}

	/* Hides the list where the popover API is unavailable */
	.selectContent[data-state="closed"] {
		display: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.selectContent {
			transition: none;
		}
	}

	/* =============== Sizes =============== */

	/* Large */
	.selectContent[data-size="lg"] {
		--select-inner-radius: var(--radius-md);
		--select-item-padding: var(--spacing-sm);
		--select-icon: 1rem; /* 16px */
		border-radius: var(--radius-lg);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Medium — default */
	.selectContent[data-size="md"] {
		--select-inner-radius: var(--radius-sm);
		--select-item-padding: calc(var(--spacing-xs) * 1.5); /* 6px */
		--select-icon: 1rem; /* 16px */
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Small */
	.selectContent[data-size="sm"] {
		--select-inner-radius: var(--radius-xs);
		--select-item-padding: var(--spacing-xs);
		--select-icon: var(--text-sm);
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Extra small */
	.selectContent[data-size="xs"] {
		--select-inner-radius: var(--radius-xs);
		--select-item-padding: calc(var(--spacing-xs) / 2); /* 2px */
		--select-icon: var(--text-xs);
		border-radius: var(--radius-xs);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius; must stay after the size rules. Items use one step smaller so the corners nest */
	.selectContent[data-rounded="xs"] {
		--select-inner-radius: var(--radius-xs);
		border-radius: var(--radius-xs);
	}

	.selectContent[data-rounded="sm"] {
		--select-inner-radius: var(--radius-xs);
		border-radius: var(--radius-sm);
	}

	.selectContent[data-rounded="md"] {
		--select-inner-radius: var(--radius-sm);
		border-radius: var(--radius-md);
	}

	.selectContent[data-rounded="lg"] {
		--select-inner-radius: var(--radius-md);
		border-radius: var(--radius-lg);
	}

	.selectContent[data-rounded="xl"] {
		--select-inner-radius: var(--radius-lg);
		border-radius: var(--radius-xl);
	}

	.selectContent[data-rounded="2xl"] {
		--select-inner-radius: var(--radius-xl);
		border-radius: var(--radius-2xl);
	}

	.selectContent[data-rounded="3xl"] {
		--select-inner-radius: var(--radius-2xl);
		border-radius: var(--radius-3xl);
	}

	.selectContent[data-rounded="4xl"] {
		--select-inner-radius: var(--radius-3xl);
		border-radius: var(--radius-4xl);
	}

	/* A true pill; tall content can clip at the corners, so use 3xl or 4xl to stay safe */
	.selectContent[data-rounded="pill"] {
		--select-inner-radius: var(--radius-pill);
		border-radius: var(--radius-pill);
	}
</style>
