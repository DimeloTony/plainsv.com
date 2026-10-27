<script lang="ts">
	import Toast from "./toast.svelte";
	import { setCompCtx } from "./ctx.svelte.js";
	import { toastState } from "./state.svelte.js";
	import type { Attachment } from "svelte/attachments";
	import type { Props, ToastId } from "./index.js";
	import type { CompCtxProps } from "./ctx.svelte.js";
	const { id, position = "bottom-right", expand = false, visibleToasts = 3, duration = 4000, closeButton = false, richColors = false, gap = "md", size = "md", rounded = "lg", hotkey = ["altKey", "KeyT"], class: className, ...props }: Props = $props();
	const contextData: CompCtxProps = $derived({ position, expand, visibleToasts, duration, closeButton, richColors, size, rounded });
	const ctx = setCompCtx({ ...contextData });
	// Keys of the hotkey that name a modifier rather than the key itself, with the names read out in the label.
	const MODIFIERS: Record<string, string> = { altKey: "Alt", ctrlKey: "Ctrl", metaKey: "Meta", shiftKey: "Shift" };
	let listEl: HTMLOListElement | undefined = $state();

	// Toasts for this toaster, newest first; a toast without `toasterId` goes to a toaster without `id`.
	const toasts = $derived(toastState.toasts.filter((toast) => toast.toasterId === id));
	// Each toast's place among the open toasts in front of it, and the height of those toasts, so closing toasts leave no gap.
	// Kept apart from the toasts, so a height change does not hand every toast a new object and rerun its effects.
	const positions = $derived.by(() => {
		const positions = new Map<ToastId, { index: number; offset: number }>();
		let index = 0;
		let offset = 0;
		for (const toast of toasts) {
			positions.set(toast.id, { index, offset });
			if (!toast.dismissed) {
				index += 1;
				offset += ctx.heights.get(toast.id) ?? 0;
			}
		}
		return positions;
	});
	// Open toasts that are shown, which size the list's hover area.
	const shown = $derived(toasts.filter((toast) => !toast.dismissed).slice(0, visibleToasts));
	const frontHeight = $derived(shown[0] ? (ctx.heights.get(shown[0].id) ?? 0) : 0);
	const totalHeight = $derived(shown.reduce((sum, toast) => sum + (ctx.heights.get(toast.id) ?? 0), 0));
	const hotkeyLabel = $derived(hotkey.map((key) => MODIFIERS[key] ?? key.replace(/^(Key|Digit)/, "")).join("+"));

	// Keep the shared settings in sync when the props change.
	$effect.pre(() => void Object.assign(ctx, contextData));

	/** Moves focus to the toasts on the hotkey, and back out on Escape. */
	const handleWindowKeydown = (e: KeyboardEvent) => {
		const isHotkey = hotkey.length > 0 && hotkey.every((key) => (key in MODIFIERS ? e[key as "altKey"] : e.code === key));
		// If the hotkey was pressed: spread the toasts out and focus them.
		if (isHotkey) {
			e.preventDefault();
			listEl?.focus();
			return;
		}
		// If Escape was pressed inside the toasts: leave them, which stacks them again.
		if (e.key === "Escape" && listEl?.contains(document.activeElement)) (document.activeElement as HTMLElement).blur();
	};

	/** Clears the hover and focus state when the list unmounts, so the next toasts do not start paused. */
	const resetOnUnmount: Attachment<HTMLOListElement> = () => () => {
		ctx.hovered = false;
		ctx.focused = false;
		ctx.interacting = false;
	};

	/** Stacks the toasts again once focus leaves the list. */
	const handleFocusOut = (e: FocusEvent) => {
		const next = e.relatedTarget;
		// If focus moved to another part of the list: keep it spread out.
		if (next instanceof Node && listEl?.contains(next)) return;
		ctx.focused = false;
	};
</script>

<svelte:window onkeydown={handleWindowKeydown} />
<svelte:document onvisibilitychange={() => (ctx.pageHidden = document.hidden)} />

<!-- Live region that announces new toasts; the list only renders while there are toasts. -->
<section class={["toasterRegion not-typeset", className]} aria-label="Notifications {hotkeyLabel}" aria-live="polite" aria-relevant="additions text" aria-atomic="false" {...props}>
	{#if toasts.length > 0}
		<ol bind:this={listEl} class="toaster" tabindex="-1" data-position={position} data-edge={ctx.edge} data-gap={gap} data-expanded={ctx.expanded} style:--toaster-front-height="{frontHeight}px" style:--toaster-total-height="{totalHeight}px" style:--toaster-count={shown.length} onpointerenter={() => (ctx.hovered = true)} onpointerleave={() => !ctx.interacting && (ctx.hovered = false)} onfocusin={() => (ctx.focused = true)} onfocusout={handleFocusOut} {@attach resetOnUnmount}>
			{#each toasts as toast (toast.id)}
				<Toast {toast} index={positions.get(toast.id)?.index ?? 0} offset={positions.get(toast.id)?.offset ?? 0} />
			{/each}
		</ol>
	{/if}
</section>

<style>
	/* Region; only the list takes space */
	.toasterRegion {
		display: contents;
	}

	/* Base list; fixed to the viewport, and as tall as the front toast so the page stays clickable around it */
	.toaster {
		--toaster-width: 22.25rem; /* 356px */
		position: fixed;
		z-index: 999;
		box-sizing: border-box;
		margin: 0;
		outline: none;
		padding: 0;
		width: var(--toaster-width);
		max-width: calc(100vw - 2 * var(--spacing-lg));
		height: calc(var(--toaster-front-height) + 2px); /* plus the toast border */
		list-style: none;
	}

	/* Spread out; covers every shown toast and the gaps between them, so hovering the gaps keeps it open */
	.toaster[data-expanded="true"] {
		height: calc(var(--toaster-total-height) + var(--toaster-count) * 2px + (var(--toaster-count) - 1) * var(--toaster-gap));
	}

	/* Toasts move up from the bottom edge and down from the top edge */
	.toaster[data-edge="bottom"] {
		--toaster-dir: -1;
		bottom: var(--spacing-xl);
	}

	.toaster[data-edge="top"] {
		--toaster-dir: 1;
		top: var(--spacing-xl);
	}

	.toaster[data-position$="left"] {
		left: var(--spacing-xl);
	}

	.toaster[data-position$="right"] {
		right: var(--spacing-xl);
	}

	.toaster[data-position$="center"] {
		left: 50%;
		translate: -50% 0;
	}

	/* Narrow screens; the toasts span the width */
	@media (max-width: 37.5rem) {
		.toaster[data-position] {
			right: var(--spacing-lg);
			left: var(--spacing-lg);
			translate: none;
			width: auto;
		}

		.toaster[data-edge="bottom"] {
			bottom: var(--spacing-lg);
		}

		.toaster[data-edge="top"] {
			top: var(--spacing-lg);
		}
	}

	/* =============== Sizes =============== */

	/* Space between spread-out toasts, and how far stacked toasts peek out */
	.toaster[data-gap="xs"] {
		--toaster-gap: var(--spacing-xs);
	}

	.toaster[data-gap="sm"] {
		--toaster-gap: var(--spacing-sm);
	}

	.toaster[data-gap="md"] {
		--toaster-gap: var(--spacing-md);
	}

	.toaster[data-gap="lg"] {
		--toaster-gap: var(--spacing-lg);
	}
</style>
