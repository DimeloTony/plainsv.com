<script lang="ts">
	import { setCompCtx } from "./ctx.svelte.js";
	import type { Attachment } from "svelte/attachments";
	import type { Props } from "./index.js";
	import type { CompCtxProps } from "./ctx.svelte.js";
	let { value = $bindable(""), onValueChange, delayDuration = 200, variant = "default", size = "md", rounded, children, class: className, ...props }: Props = $props();
	const baseId = $props.id();
	const contextData: Omit<CompCtxProps, "value"> = $derived({ baseId, delayDuration, variant, onValueChange });
	const ctx = setCompCtx({ ...contextData, value });
	// Top-level triggers and links, which the left and right arrows move between.
	const TOP_LEVEL_SELECTOR = "[data-navigation-menu-top]:not(:disabled)";

	// Keep the shared settings in sync when the props change.
	$effect.pre(() => void Object.assign(ctx, contextData));

	// Keep the bindable prop and the shared open value in sync in both directions.
	$effect.pre(() => void (ctx.value = value));
	$effect.pre(() => void (value = ctx.value));

	/** Handles Escape, the arrows between top-level items, and focus leaving the menu. */
	const handleKeys: Attachment<HTMLElement> = (node) => {
		/** Closes on Escape and moves between the top-level triggers and links with the arrows, Home, and End. */
		const handleKeydown = (e: KeyboardEvent) => {
			// If Escape was pressed while open: close and return focus to the open item's trigger.
			if (e.key === "Escape" && ctx.value) {
				const trigger = document.getElementById(ctx.triggerId(ctx.value));
				ctx.close();
				trigger?.focus();
				return;
			}
			const target = e.target as HTMLElement;
			// If focus is not on a top-level trigger or link: leave the key to the content.
			if (!target.matches(TOP_LEVEL_SELECTOR)) return;
			const items = [...node.querySelectorAll<HTMLElement>(TOP_LEVEL_SELECTOR)];
			const index = items.indexOf(target);
			// The arrows wrap around at the ends.
			const keyIndexes: Record<string, number> = { ArrowRight: (index + 1) % items.length, ArrowLeft: index <= 0 ? items.length - 1 : index - 1, Home: 0, End: items.length - 1 };
			// If the key does not move focus: leave it alone.
			if (!(e.key in keyIndexes)) return;
			e.preventDefault();
			items[keyIndexes[e.key]]?.focus();
		};
		/** Closes the menu when focus moves to an element outside it. */
		const handleFocusOut = (e: FocusEvent) => {
			const next = e.relatedTarget;
			// If focus left the page or stayed inside the menu: keep it open.
			if (!(next instanceof Node) || node.contains(next)) return;
			ctx.close();
		};

		node.addEventListener("keydown", handleKeydown);
		node.addEventListener("focusout", handleFocusOut);
		return () => {
			ctx.clearTimers();
			node.removeEventListener("keydown", handleKeydown);
			node.removeEventListener("focusout", handleFocusOut);
		};
	};

	/** Closes the menu on a press outside it while an item is open. */
	const closeOnOutsidePress: Attachment<HTMLElement> = (node) => {
		// If every item is closed: there is nothing to close.
		if (!ctx.value) return;
		const handlePointerDown = (e: PointerEvent) => {
			if (e.target instanceof Node && !node.contains(e.target)) ctx.close();
		};
		document.addEventListener("pointerdown", handlePointerDown);
		return () => document.removeEventListener("pointerdown", handlePointerDown);
	};
</script>

<!-- Site navigation; items open their content below them. -->
<nav class={["navigationMenu not-typeset", className]} aria-label="Main" data-variant={variant} data-size={size} data-rounded={rounded} {@attach handleKeys} {@attach closeOnOutsidePress} {...props}>
	{@render children()}
</nav>

<style>
	/* Base menu */
	.navigationMenu {
		display: flex;
		position: relative;
		align-items: center;
		color: var(--foreground);
	}

	/* =============== Sizes =============== */

	/* Large */
	.navigationMenu[data-size="lg"] {
		--navigation-menu-height: var(--control-height-lg);
		--navigation-menu-padding-inline: var(--spacing-xl);
		--navigation-menu-trigger-radius: var(--radius-lg);
		--navigation-menu-content-radius: var(--radius-lg);
		--navigation-menu-inner-radius: var(--radius-md);
		--navigation-menu-content-padding: var(--spacing-sm);
		--navigation-menu-link-padding: var(--spacing-md);
		--navigation-menu-icon: 0.875rem; /* 14px */
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Medium — default */
	.navigationMenu[data-size="md"] {
		--navigation-menu-height: var(--control-height-md);
		--navigation-menu-padding-inline: var(--spacing-lg);
		--navigation-menu-trigger-radius: var(--radius-md);
		--navigation-menu-content-radius: var(--radius-md);
		--navigation-menu-inner-radius: var(--radius-sm);
		--navigation-menu-content-padding: var(--spacing-sm);
		--navigation-menu-link-padding: var(--spacing-sm);
		--navigation-menu-icon: 0.75rem; /* 12px */
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Small */
	.navigationMenu[data-size="sm"] {
		--navigation-menu-height: var(--control-height-sm);
		--navigation-menu-padding-inline: var(--spacing-md);
		--navigation-menu-trigger-radius: var(--radius-sm);
		--navigation-menu-content-radius: var(--radius-sm);
		--navigation-menu-inner-radius: var(--radius-xs);
		--navigation-menu-content-padding: var(--spacing-xs);
		--navigation-menu-link-padding: calc(var(--spacing-xs) * 1.5); /* 6px */
		--navigation-menu-icon: 0.75rem; /* 12px */
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Extra small */
	.navigationMenu[data-size="xs"] {
		--navigation-menu-height: var(--control-height-xs);
		--navigation-menu-padding-inline: var(--spacing-sm);
		--navigation-menu-trigger-radius: var(--radius-xs);
		--navigation-menu-content-radius: var(--radius-xs);
		--navigation-menu-inner-radius: var(--radius-xs);
		--navigation-menu-content-padding: var(--spacing-xs);
		--navigation-menu-link-padding: var(--spacing-xs);
		--navigation-menu-icon: 0.625rem; /* 10px */
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius; must stay after the size rules. Links use one step smaller so the corners nest */
	.navigationMenu[data-rounded="xs"] {
		--navigation-menu-trigger-radius: var(--radius-xs);
		--navigation-menu-content-radius: var(--radius-xs);
		--navigation-menu-inner-radius: var(--radius-xs);
	}

	.navigationMenu[data-rounded="sm"] {
		--navigation-menu-trigger-radius: var(--radius-sm);
		--navigation-menu-content-radius: var(--radius-sm);
		--navigation-menu-inner-radius: var(--radius-xs);
	}

	.navigationMenu[data-rounded="md"] {
		--navigation-menu-trigger-radius: var(--radius-md);
		--navigation-menu-content-radius: var(--radius-md);
		--navigation-menu-inner-radius: var(--radius-sm);
	}

	.navigationMenu[data-rounded="lg"] {
		--navigation-menu-trigger-radius: var(--radius-lg);
		--navigation-menu-content-radius: var(--radius-lg);
		--navigation-menu-inner-radius: var(--radius-md);
	}

	.navigationMenu[data-rounded="xl"] {
		--navigation-menu-trigger-radius: var(--radius-xl);
		--navigation-menu-content-radius: var(--radius-xl);
		--navigation-menu-inner-radius: var(--radius-lg);
	}

	.navigationMenu[data-rounded="2xl"] {
		--navigation-menu-trigger-radius: var(--radius-2xl);
		--navigation-menu-content-radius: var(--radius-2xl);
		--navigation-menu-inner-radius: var(--radius-xl);
	}

	.navigationMenu[data-rounded="3xl"] {
		--navigation-menu-trigger-radius: var(--radius-3xl);
		--navigation-menu-content-radius: var(--radius-3xl);
		--navigation-menu-inner-radius: var(--radius-2xl);
	}

	.navigationMenu[data-rounded="4xl"] {
		--navigation-menu-trigger-radius: var(--radius-4xl);
		--navigation-menu-content-radius: var(--radius-4xl);
		--navigation-menu-inner-radius: var(--radius-3xl);
	}

	/* Triggers, panels, and links all become pills; a pill panel can clip its links, so use 3xl or 4xl for round panels */
	.navigationMenu[data-rounded="pill"] {
		--navigation-menu-trigger-radius: var(--radius-pill);
		--navigation-menu-content-radius: var(--radius-pill);
		--navigation-menu-inner-radius: var(--radius-pill);
	}
</style>
