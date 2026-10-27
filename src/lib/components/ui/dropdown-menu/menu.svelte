<script lang="ts">
	import { tick } from "svelte";
	import { scale } from "svelte/transition";
	import { useCompCtx, setLevelCtx, ITEM_SELECTOR } from "./ctx.svelte.js";
	import type { Attachment } from "svelte/attachments";
	import type { MenuProps, DropdownMenuSide } from "./index.js";
	const { open, anchor, side, align, sideOffset, alignOffset = 0, initialFocus, onDismiss, onArrowLeft, size, rounded, children, class: className, ...props }: MenuProps = $props();
	const ctx = useCompCtx();
	// Each panel is a menu level, so a submenu inside it knows which sibling submenu to close.
	const level = setLevelCtx();
	// Minimum gap in pixels between the menu and the viewport edges.
	const VIEWPORT_PADDING = 8;
	const OPPOSITE_SIDE: Record<DropdownMenuSide, DropdownMenuSide> = { top: "bottom", bottom: "top", left: "right", right: "left" };
	let placement: Placement = $state({ x: 0, y: 0, side: "bottom", maxHeight: 0 });
	// Typed characters for typeahead, cleared after a pause.
	let search = "";
	let searchTimer: ReturnType<typeof setTimeout> | undefined;

	/** Clamps a value between a minimum and maximum; the minimum wins when they cross. */
	const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

	/** Places the menu beside the anchor, flipping to the side with more room and scrolling when it is still too tall. */
	const updatePlacement = (node: HTMLElement) => {
		// If the anchor is not registered yet: keep the last placement.
		if (!anchor) return;
		const rect = anchor.getBoundingClientRect();
		// Offset sizes ignore the scale of the open transition.
		const width = node.offsetWidth;
		// Full height of the items plus the borders, ignoring the current max height.
		const naturalHeight = node.scrollHeight + node.offsetHeight - node.clientHeight;
		const viewportWidth = document.documentElement.clientWidth;
		const viewportHeight = document.documentElement.clientHeight;
		const isVerticalSide = side === "top" || side === "bottom";

		// If the preferred side is too tight and the opposite side has more room: flip.
		const space: Record<DropdownMenuSide, number> = { top: rect.top, bottom: viewportHeight - rect.bottom, left: rect.left, right: viewportWidth - rect.right };
		const needed = (isVerticalSide ? naturalHeight : width) + sideOffset + VIEWPORT_PADDING;
		const opposite = OPPOSITE_SIDE[side];
		const placedSide = space[side] < needed && space[opposite] > space[side] ? opposite : side;

		// Above or below the anchor, the menu gets the room on that side and scrolls past it, so it never covers the anchor.
		const maxHeight = isVerticalSide ? space[placedSide] - sideOffset - VIEWPORT_PADDING : viewportHeight - 2 * VIEWPORT_PADDING;
		const height = Math.min(naturalHeight, maxHeight);
		const mainAxis: Record<DropdownMenuSide, number> = { top: rect.top - sideOffset - height, bottom: rect.bottom + sideOffset, left: rect.left - sideOffset - width, right: rect.right + sideOffset };

		// Align along the anchor's edge, then shift to keep the menu inside the viewport.
		const [start, length, size, limit] = isVerticalSide ? [rect.left, rect.width, width, viewportWidth] : [rect.top, rect.height, height, viewportHeight];
		const aligned = { start: start + alignOffset, center: start + length / 2 - size / 2, end: start + length - size - alignOffset }[align];
		const cross = clamp(aligned, VIEWPORT_PADDING, limit - size - VIEWPORT_PADDING);

		// If a side menu does not fit beside the anchor: keep it inside the viewport, even if it covers the anchor.
		const main = isVerticalSide ? mainAxis[placedSide] : clamp(mainAxis[placedSide], VIEWPORT_PADDING, viewportWidth - width - VIEWPORT_PADDING);
		placement = isVerticalSide ? { x: cross, y: main, side: placedSide, maxHeight } : { x: main, y: cross, side: placedSide, maxHeight };
	};

	/** Lists the enabled items of this menu level, leaving out the items of nested submenus. */
	const getItems = (node: HTMLElement) => [...node.querySelectorAll<HTMLElement>(ITEM_SELECTOR)].filter((item) => item.closest('[role="menu"]') === node);

	/** Focuses an item and scrolls it into view inside the menu. */
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
		focusItem(ordered.find((item) => (item.textContent ?? "").trim().toLowerCase().startsWith(query)));
	};

	/** Shows the menu in the top layer, places it, and handles focus and keys while open. */
	const placeMenu: Attachment<HTMLDivElement> = (node) => {
		// Show in the top layer so no ancestor's overflow or z-index can clip the menu.
		if ("showPopover" in node && !node.matches(":popover-open")) node.showPopover();
		updatePlacement(node);
		// Focus once the menu is placed: keyboard opens focus an item, pointer opens focus the menu itself.
		tick().then(() => {
			const items = getItems(node);
			if (initialFocus === "first") focusItem(items[0]);
			else if (initialFocus === "last") focusItem(items.at(-1));
			else if (initialFocus === "menu") node.focus({ preventScroll: true });
		});

		const update = () => updatePlacement(node);
		/** Moves between items, selects, and searches with the keyboard. */
		const handleKeydown = (e: KeyboardEvent) => {
			// If an item already handled the key, or it came from a nested submenu: leave it alone.
			if (e.defaultPrevented || !(e.target instanceof Element) || e.target.closest('[role="menu"]') !== node) return;
			const items = getItems(node);
			const currentIndex = items.findIndex((item) => item === document.activeElement);
			// If a search is in progress or a character was typed: search, so Space can join a search.
			if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && (search || e.key !== " ")) {
				e.preventDefault();
				typeahead(e.key, items, currentIndex);
				return;
			}
			// The arrows wrap around at the ends.
			const keyIndexes: Record<string, number> = { ArrowDown: (currentIndex + 1) % items.length, ArrowUp: currentIndex <= 0 ? items.length - 1 : currentIndex - 1, Home: 0, End: items.length - 1 };
			if (e.key in keyIndexes) {
				e.preventDefault();
				focusItem(items[keyIndexes[e.key]]);
			} else if ((e.key === "Enter" || e.key === " ") && currentIndex !== -1) {
				// Enter and Space select the focused item.
				e.preventDefault();
				items[currentIndex].click();
			} else if (e.key === "Tab") {
				// Tab closes every menu instead of moving focus out of it.
				e.preventDefault();
				ctx.close();
			} else if (e.key === "ArrowLeft" && onArrowLeft) {
				// The left arrow closes a submenu and returns to its sub trigger.
				e.preventDefault();
				onArrowLeft();
			}
		};
		/** Closes the open submenu when focus moves to another item at this level. */
		const handleFocusIn = (e: FocusEvent) => {
			// If focus moved inside a nested submenu: leave it open.
			if (!(e.target instanceof Element) || e.target.closest('[role="menu"]') !== node) return;
			const sub = level.activeSub;
			// If focus returned to the open submenu's trigger: keep it open; otherwise close it after a short delay.
			if (e.target === sub?.triggerEl) sub.cancelClose();
			else sub?.scheduleClose();
		};

		// Follow the anchor through scrolling, resizing, and content changes.
		const observer = new ResizeObserver(update);
		observer.observe(node);
		if (anchor) observer.observe(anchor);
		window.addEventListener("scroll", update, { capture: true, passive: true });
		window.addEventListener("resize", update);
		node.addEventListener("keydown", handleKeydown);
		node.addEventListener("focusin", handleFocusIn);
		return () => {
			observer.disconnect();
			clearTimeout(searchTimer);
			search = "";
			window.removeEventListener("scroll", update, { capture: true });
			window.removeEventListener("resize", update);
			node.removeEventListener("keydown", handleKeydown);
			node.removeEventListener("focusin", handleFocusIn);
		};
	};

	/** Syncs the open state after the browser hides the menu itself, such as on an outside click or Escape. */
	const handleToggle = (e: ToggleEvent & { currentTarget: HTMLDivElement }) => {
		// If the menu is showing: this is the open toggle, so there is nothing to sync.
		if (e.currentTarget.matches(":popover-open")) return;
		const hadFocus = document.activeElement === document.body || e.currentTarget.contains(document.activeElement);
		onDismiss();
		// If focus was in the menu or dropped to the page: return it to the anchor.
		if (hadFocus) anchor?.focus({ preventScroll: true });
	};

	/** Position of the menu in viewport pixels */
	interface Placement {
		/** Left edge of the menu */
		x: number;
		/** Top edge of the menu */
		y: number;
		/** Side the menu opened on after flipping */
		side: DropdownMenuSide;
		/** Room on the chosen side; the menu scrolls past it */
		maxHeight: number;
	}
</script>

<!-- Menu panel in the top layer beside its anchor; its own size and radius override the dropdown menu's. -->
{#if open}
	<div class={["dropdownMenuContent not-typeset", className]} role="menu" tabindex="-1" popover="auto" data-side={placement.side} data-size={size ?? ctx.size} data-rounded={rounded ?? ctx.rounded} style:left="{placement.x}px" style:top="{placement.y}px" style:max-height="{placement.maxHeight}px" {@attach placeMenu} ontoggle={handleToggle} transition:scale={{ duration: 150, start: 0.95 }} {...props}>
		{@render children()}
	</div>
{/if}

<style>
	/* Base menu; resets the popover defaults so the computed position applies */
	.dropdownMenuContent {
		--menu-item-gap: calc(var(--spacing-xs) * 1.5); /* 6px; between an item's icon, text, and indicator column */
		position: fixed;
		z-index: 50; /* Only applies where the popover top layer is unavailable */
		box-sizing: border-box;
		margin: 0;
		inset: auto;
		outline: none;
		border: 1px solid var(--border);
		background-color: var(--popover);
		padding: var(--spacing-xs);
		min-width: 8rem;
		overflow-x: hidden;
		overflow-y: auto;
		color: var(--popover-foreground);
	}

	/* Grows from the side facing the anchor */
	.dropdownMenuContent[data-side="top"] {
		transform-origin: bottom;
	}

	.dropdownMenuContent[data-side="bottom"] {
		transform-origin: top;
	}

	.dropdownMenuContent[data-side="left"] {
		transform-origin: right;
	}

	.dropdownMenuContent[data-side="right"] {
		transform-origin: left;
	}

	/* =============== Sizes =============== */

	/* Large */
	.dropdownMenuContent[data-size="lg"] {
		--menu-inner-radius: var(--radius-md);
		--menu-item-padding: calc(var(--spacing-xs) * 1.5); /* 6px */
		--menu-item-padding-inline: var(--spacing-sm);
		--menu-icon: 1rem; /* 16px */
		border-radius: var(--radius-lg);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Medium — default */
	.dropdownMenuContent[data-size="md"] {
		--menu-inner-radius: var(--radius-sm);
		--menu-item-padding: var(--spacing-xs);
		--menu-item-padding-inline: calc(var(--spacing-xs) * 1.5); /* 6px */
		--menu-icon: 1rem; /* 16px */
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Small */
	.dropdownMenuContent[data-size="sm"] {
		--menu-inner-radius: var(--radius-xs);
		--menu-item-padding: calc(var(--spacing-xs) / 2); /* 2px */
		--menu-item-padding-inline: calc(var(--spacing-xs) * 1.5); /* 6px */
		--menu-icon: var(--text-sm);
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Extra small */
	.dropdownMenuContent[data-size="xs"] {
		--menu-inner-radius: var(--radius-xs);
		--menu-item-padding: calc(var(--spacing-xs) / 2); /* 2px */
		--menu-item-padding-inline: var(--spacing-xs);
		--menu-icon: var(--text-xs);
		border-radius: var(--radius-xs);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius; must stay after the size rules. Items use one step smaller so the corners nest */
	.dropdownMenuContent[data-rounded="xs"] {
		--menu-inner-radius: var(--radius-xs);
		border-radius: var(--radius-xs);
	}

	.dropdownMenuContent[data-rounded="sm"] {
		--menu-inner-radius: var(--radius-xs);
		border-radius: var(--radius-sm);
	}

	.dropdownMenuContent[data-rounded="md"] {
		--menu-inner-radius: var(--radius-sm);
		border-radius: var(--radius-md);
	}

	.dropdownMenuContent[data-rounded="lg"] {
		--menu-inner-radius: var(--radius-md);
		border-radius: var(--radius-lg);
	}

	.dropdownMenuContent[data-rounded="xl"] {
		--menu-inner-radius: var(--radius-lg);
		border-radius: var(--radius-xl);
	}

	.dropdownMenuContent[data-rounded="2xl"] {
		--menu-inner-radius: var(--radius-xl);
		border-radius: var(--radius-2xl);
	}

	.dropdownMenuContent[data-rounded="3xl"] {
		--menu-inner-radius: var(--radius-2xl);
		border-radius: var(--radius-3xl);
	}

	.dropdownMenuContent[data-rounded="4xl"] {
		--menu-inner-radius: var(--radius-3xl);
		border-radius: var(--radius-4xl);
	}

	/* A true pill; tall content can clip at the corners, so use 3xl or 4xl to stay safe */
	.dropdownMenuContent[data-rounded="pill"] {
		--menu-inner-radius: var(--radius-pill);
		border-radius: var(--radius-pill);
	}
</style>
