<script lang="ts">
	import { useCompCtx, setListCtx } from "./ctx.svelte.js";
	import type { ListProps } from "./index.js";
	import type { ListCtxProps } from "./ctx.svelte.js";
	const { variant, size, rounded, children, onkeydown, class: className, ...props }: ListProps = $props();
	const ctx = useCompCtx();
	const listData: ListCtxProps = $derived({ variant: variant ?? ctx.variant });
	const listCtx = setListCtx(listData);

	// Keep the list style in sync when the props or the tabs' variant change.
	$effect.pre(() => void Object.assign(listCtx, listData));

	/** Moves focus between triggers with the arrow keys, Home, and End. */
	const handleKeydown = (e: KeyboardEvent & { currentTarget: HTMLDivElement }) => {
		onkeydown?.(e);
		// If a passed handler prevented the default: leave the key alone.
		if (e.defaultPrevented) return;
		const triggers = [...e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)')];
		const currentIndex = triggers.findIndex((trigger) => trigger === document.activeElement);
		// If focus is not on an enabled trigger: leave the key alone.
		if (currentIndex === -1) return;
		// Arrow keys follow the orientation and wrap around at the ends.
		const isVertical = ctx.orientation === "vertical";
		const keyIndexes: Record<string, number> = {
			[isVertical ? "ArrowUp" : "ArrowLeft"]: (currentIndex - 1 + triggers.length) % triggers.length,
			[isVertical ? "ArrowDown" : "ArrowRight"]: (currentIndex + 1) % triggers.length,
			Home: 0,
			End: triggers.length - 1,
		};
		const nextTrigger = triggers[keyIndexes[e.key]];
		// If the key does not move between tabs: let it through.
		if (!nextTrigger) return;
		e.preventDefault();
		nextTrigger.focus();
		// If tabs open on focus: open the newly focused tab.
		if (ctx.activationMode === "automatic") nextTrigger.click();
	};
</script>

<!-- Tab list; sets the size variables that its triggers read, and its own style overrides the tabs'. -->
<div class={["tabsList", className]} role="tablist" aria-orientation={ctx.orientation} data-orientation={ctx.orientation} data-variant={listCtx.variant} data-size={size ?? ctx.size} data-rounded={rounded ?? ctx.rounded} onkeydown={handleKeydown} {...props}>
	{@render children()}
</div>

<style>
	/* Base list; height comes from the triggers, which read the variables set below */
	.tabsList {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
		border: 1px solid transparent;
		border-radius: var(--tabs-radius);
		width: fit-content;
		color: var(--muted-foreground);
	}

	/* Triggers stack and stretch to the widest one */
	.tabsList[data-orientation="vertical"] {
		flex-direction: column;
		align-items: stretch;
		height: fit-content;
	}

	/* =============== Variants =============== */

	/* Muted segmented control; triggers sit inside the padding with a nested radius */
	.tabsList[data-variant="default"] {
		--tabs-trigger-inset: 0.5rem; /* 3px padding and 1px border per side */
		--tabs-trigger-height: calc(var(--tabs-height) - 0.5rem); /* minus 3px padding and 1px border per side */
		--tabs-trigger-radius: var(--tabs-inner-radius);
		background-color: var(--muted);
		padding: 0.1875rem; /* 3px */
	}

	/* Bordered container; triggers sit inside the padding with a nested radius */
	.tabsList[data-variant="outline"] {
		--tabs-trigger-inset: 0.5rem; /* 3px padding and 1px border per side */
		--tabs-trigger-height: calc(var(--tabs-height) - 0.5rem); /* minus 3px padding and 1px border per side */
		--tabs-trigger-radius: var(--tabs-inner-radius);
		border-color: var(--border);
		padding: 0.1875rem; /* 3px */
	}

	:global(.dark) .tabsList[data-variant="outline"] {
		border-color: var(--input);
	}

	/* No container; triggers are spaced apart */
	.tabsList[data-variant="ghost"] {
		--tabs-trigger-inset: 2px; /* the transparent border */
		--tabs-trigger-height: calc(var(--tabs-height) - 2px); /* minus the transparent border */
		--tabs-trigger-radius: var(--tabs-radius);
		gap: var(--spacing-xs);
	}

	/* A rule along the edge facing the panel; the active trigger marks it */
	.tabsList[data-variant="line"] {
		--tabs-trigger-inset: 2px; /* the transparent border */
		--tabs-trigger-height: calc(var(--tabs-height) - 2px); /* minus the transparent border */
		--tabs-trigger-radius: var(--tabs-radius);
		gap: var(--spacing-xs);
		border-radius: 0;
	}

	.tabsList[data-variant="line"][data-orientation="horizontal"] {
		border-bottom-color: var(--border);
	}

	.tabsList[data-variant="line"][data-orientation="vertical"] {
		border-right-color: var(--border);
	}

	/* =============== Sizes =============== */

	/* Large */
	.tabsList[data-size="lg"] {
		--tabs-height: var(--control-height-lg);
		--tabs-radius: var(--radius-lg);
		--tabs-inner-radius: var(--radius-md);
		--tabs-padding-inline: var(--spacing-md);
		--tabs-text: var(--text-sm);
		--tabs-line-height: var(--line-height-sm);
		--tabs-icon: 1rem; /* 16px */
	}

	/* Medium — default */
	.tabsList[data-size="md"] {
		--tabs-height: var(--control-height-md);
		--tabs-radius: var(--radius-md);
		--tabs-inner-radius: var(--radius-sm);
		--tabs-padding-inline: var(--spacing-sm);
		--tabs-text: var(--text-sm);
		--tabs-line-height: var(--line-height-sm);
		--tabs-icon: 1rem; /* 16px */
	}

	/* Small */
	.tabsList[data-size="sm"] {
		--tabs-height: var(--control-height-sm);
		--tabs-radius: var(--radius-sm);
		--tabs-inner-radius: var(--radius-xs);
		--tabs-padding-inline: var(--spacing-sm);
		--tabs-text: var(--text-sm);
		--tabs-line-height: var(--line-height-sm);
		--tabs-icon: var(--text-sm);
	}

	/* Extra small */
	.tabsList[data-size="xs"] {
		--tabs-height: var(--control-height-xs);
		--tabs-radius: var(--radius-xs);
		--tabs-inner-radius: var(--radius-xs);
		--tabs-padding-inline: var(--spacing-xs);
		--tabs-text: var(--text-xs);
		--tabs-line-height: var(--line-height-xs);
		--tabs-icon: var(--text-xs);
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius; must stay after the size rules. The inner radius is one step smaller so the corners nest */
	.tabsList[data-rounded="xs"] {
		--tabs-radius: var(--radius-xs);
		--tabs-inner-radius: var(--radius-xs);
	}

	.tabsList[data-rounded="sm"] {
		--tabs-radius: var(--radius-sm);
		--tabs-inner-radius: var(--radius-xs);
	}

	.tabsList[data-rounded="md"] {
		--tabs-radius: var(--radius-md);
		--tabs-inner-radius: var(--radius-sm);
	}

	.tabsList[data-rounded="lg"] {
		--tabs-radius: var(--radius-lg);
		--tabs-inner-radius: var(--radius-md);
	}

	.tabsList[data-rounded="xl"] {
		--tabs-radius: var(--radius-xl);
		--tabs-inner-radius: var(--radius-lg);
	}

	.tabsList[data-rounded="2xl"] {
		--tabs-radius: var(--radius-2xl);
		--tabs-inner-radius: var(--radius-xl);
	}

	.tabsList[data-rounded="3xl"] {
		--tabs-radius: var(--radius-3xl);
		--tabs-inner-radius: var(--radius-2xl);
	}

	.tabsList[data-rounded="4xl"] {
		--tabs-radius: var(--radius-4xl);
		--tabs-inner-radius: var(--radius-3xl);
	}

	.tabsList[data-rounded="pill"] {
		--tabs-radius: var(--radius-pill);
		--tabs-inner-radius: var(--radius-pill);
	}
</style>
