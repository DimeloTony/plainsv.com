<script lang="ts">
	import { tick } from "svelte";
	import { setCompCtx } from "./ctx.svelte.js";
	import type { Attachment } from "svelte/attachments";
	import type { Props } from "./index.js";
	import type { CompCtxProps } from "./ctx.svelte.js";
	let { value = $bindable(""), onValueChange, search = $bindable(""), onSearchChange, shouldFilter = true, filter, loop = false, size = "md", rounded, children, class: className, ...props }: Props = $props();
	const baseId = $props.id();
	const contextData: Omit<CompCtxProps, "value" | "search"> = $derived({ baseId, shouldFilter, loop, filter, onValueChange, onSearchChange });
	const ctx = setCompCtx({ ...contextData, value, search });

	// Keep the shared settings in sync when the props change.
	$effect.pre(() => void Object.assign(ctx, contextData));

	// Keep the bindable props and the shared state in sync in both directions.
	$effect.pre(() => void (ctx.value = value));
	$effect.pre(() => void (value = ctx.value));
	$effect.pre(() => void (ctx.search = search));
	$effect.pre(() => void (search = ctx.search));

	// Highlight the first match when the search changes, once the filtered items render.
	$effect(() => {
		const currentSearch = ctx.search;
		tick().then(() => {
			// If nothing is typed and a visible item is already highlighted, such as a passed `value`: keep it.
			if (!currentSearch && ctx.activeId) return;
			ctx.highlightFirst();
		});
	});

	/** Registers the root for item lookups and moves the highlight with the keyboard. */
	const registerRoot: Attachment<HTMLDivElement> = (node) => {
		ctx.rootEl = node;

		/** Moves the highlight with the arrow, Home, and End keys, and selects with Enter. */
		const handleKeydown = (e: KeyboardEvent) => {
			// If an input method is composing text: leave the keys to it.
			if (e.isComposing) return;
			const items = ctx.getItems();
			// If nothing matches: there is nothing to move to.
			if (!items.length) return;
			const currentIndex = items.findIndex((item) => item.dataset.value === ctx.value);
			const lastIndex = items.length - 1;
			const keyIndexes: Record<string, number> = {
				ArrowDown: currentIndex >= lastIndex ? (ctx.loop ? 0 : lastIndex) : currentIndex + 1,
				ArrowUp: currentIndex <= 0 ? (ctx.loop ? lastIndex : 0) : currentIndex - 1,
				Home: 0,
				End: lastIndex,
			};
			if (e.key in keyIndexes) {
				e.preventDefault();
				ctx.highlight(items[keyIndexes[e.key]].dataset.value ?? "");
			} else if (e.key === "Enter" && currentIndex !== -1) {
				// Enter selects the highlighted item.
				e.preventDefault();
				items[currentIndex].click();
			}
		};

		// Listen directly so a keydown handler passed through props still runs.
		node.addEventListener("keydown", handleKeydown);
		return () => node.removeEventListener("keydown", handleKeydown);
	};
</script>

<!-- Searchable list of commands; the input filters the items and the keyboard moves the highlight. -->
<div class={["command not-typeset", className]} data-size={size} data-rounded={rounded} {@attach registerRoot} {...props}>
	{@render children()}
</div>

<style>
	/* Base command */
	.command {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		border: 1px solid var(--border);
		background-color: var(--popover);
		overflow: hidden;
		color: var(--popover-foreground);
	}

	/* =============== Sizes =============== */

	/* Large */
	.command[data-size="lg"] {
		--command-inner-radius: var(--radius-md);
		--command-input-height: var(--control-height-lg);
		--command-item-padding: var(--spacing-sm);
		--command-item-padding-inline: var(--spacing-sm);
		--command-icon: 1rem; /* 16px */
		border-radius: var(--radius-lg);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Medium — default */
	.command[data-size="md"] {
		--command-inner-radius: var(--radius-sm);
		--command-input-height: var(--control-height-md);
		--command-item-padding: calc(var(--spacing-xs) * 1.5); /* 6px */
		--command-item-padding-inline: var(--spacing-sm);
		--command-icon: 1rem; /* 16px */
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Small */
	.command[data-size="sm"] {
		--command-inner-radius: var(--radius-xs);
		--command-input-height: var(--control-height-sm);
		--command-item-padding: var(--spacing-xs);
		--command-item-padding-inline: calc(var(--spacing-xs) * 1.5); /* 6px */
		--command-icon: var(--text-sm);
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Extra small */
	.command[data-size="xs"] {
		--command-inner-radius: var(--radius-xs);
		--command-input-height: var(--control-height-xs);
		--command-item-padding: calc(var(--spacing-xs) / 2); /* 2px */
		--command-item-padding-inline: var(--spacing-xs);
		--command-icon: var(--text-xs);
		border-radius: var(--radius-xs);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius; must stay after the size rules. Items use one step smaller so the corners nest */
	.command[data-rounded="xs"] {
		--command-inner-radius: var(--radius-xs);
		border-radius: var(--radius-xs);
	}

	.command[data-rounded="sm"] {
		--command-inner-radius: var(--radius-xs);
		border-radius: var(--radius-sm);
	}

	.command[data-rounded="md"] {
		--command-inner-radius: var(--radius-sm);
		border-radius: var(--radius-md);
	}

	.command[data-rounded="lg"] {
		--command-inner-radius: var(--radius-md);
		border-radius: var(--radius-lg);
	}

	.command[data-rounded="xl"] {
		--command-inner-radius: var(--radius-lg);
		border-radius: var(--radius-xl);
	}

	.command[data-rounded="2xl"] {
		--command-inner-radius: var(--radius-xl);
		border-radius: var(--radius-2xl);
	}

	.command[data-rounded="3xl"] {
		--command-inner-radius: var(--radius-2xl);
		border-radius: var(--radius-3xl);
	}

	.command[data-rounded="4xl"] {
		--command-inner-radius: var(--radius-3xl);
		border-radius: var(--radius-4xl);
	}

	/* A true pill; tall content can clip at the corners, so use 3xl or 4xl to stay safe */
	.command[data-rounded="pill"] {
		--command-inner-radius: var(--radius-pill);
		border-radius: var(--radius-pill);
	}
</style>
