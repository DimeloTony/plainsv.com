<script lang="ts">
	import { useCompCtx } from "#lib/components/ui/dropdown-menu/ctx.svelte.js";
	import type { Attachment } from "svelte/attachments";
	import type { TriggerProps, TriggerAttrs } from "./index.js";
	const { disabled = false, children, trigger, oncontextmenu, class: className, ...props }: TriggerProps = $props();
	const ctx = useCompCtx();
	// Viewport point the menu opens at; a new point mounts a new anchor, so an open menu moves there.
	let point: { x: number; y: number } | undefined = $state();
	const triggerProps: TriggerAttrs = $derived({
		"data-state": ctx.open ? "open" : "closed",
		"data-disabled": disabled || undefined,
		oncontextmenu: openMenu,
	});

	/** Registers the zero-size anchor at the pointer so the menu is placed against it and returns focus to it. */
	const registerAnchor: Attachment<HTMLSpanElement> = (node) => {
		ctx.triggerEl = node;
		return () => {
			// If another anchor has not taken over: clear the reference.
			if (ctx.triggerEl === node) ctx.triggerEl = undefined;
		};
	};

	// Function declarations are hoisted, so the derived props above can reference them.

	/** Opens the menu at the pointer instead of the browser's context menu. */
	function openMenu(e: MouseEvent) {
		// If disabled, a passed handler prevented the default, or there is no element to measure: keep the browser's menu.
		if (disabled || e.defaultPrevented || !(e.currentTarget instanceof Element)) return;
		e.preventDefault();
		// The context menu key reports no pointer position, so the menu opens at the area's top-left corner.
		const isKeyboard = e.clientX === 0 && e.clientY === 0;
		const rect = e.currentTarget.getBoundingClientRect();
		const nextPoint = isKeyboard ? { x: rect.left, y: rect.top } : { x: e.clientX, y: e.clientY };
		// If the menu is open: the right-click already dismissed it, so reopen it at the new point once that settles.
		if (ctx.open) {
			ctx.setOpen(false);
			setTimeout(() => openAt(nextPoint, isKeyboard));
			return;
		}
		openAt(nextPoint, isKeyboard);
	}

	/** Runs a passed handler, then opens the menu unless it prevented the default. */
	function handleContextMenu(e: MouseEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		oncontextmenu?.(e);
		openMenu(e);
	}

	/** Moves the anchor to the point and opens the menu; keyboard opens focus the first item. */
	function openAt(nextPoint: { x: number; y: number }, isKeyboard: boolean) {
		point = nextPoint;
		ctx.setOpen(true, isKeyboard ? "first" : "menu");
	}
</script>

<!-- Render the custom trigger when given, otherwise an area that opens the menu. -->
{#if trigger}
	{@render trigger({ props: triggerProps })}
	{@render anchor()}
{:else}
	<div class={["contextMenuTrigger not-typeset", className]} {...triggerProps} oncontextmenu={handleContextMenu} {...props}>
		{@render children?.()}
		{@render anchor()}
	</div>
{/if}

<!-- Zero-size anchor that marks the point the menu opens at; it is fixed, so it can sit anywhere. -->
{#snippet anchor()}
	{#key point}
		{#if point}
			<span class="contextMenuAnchor" tabindex="-1" style:left="{point.x}px" style:top="{point.y}px" {@attach registerAnchor}></span>
		{/if}
	{/key}
{/snippet}

<style>
	/* Base area; long presses open the menu instead of selecting text on touch screens */
	.contextMenuTrigger {
		-webkit-touch-callout: none;
	}

	/* Invisible point at the pointer; takes focus back when the menu closes */
	.contextMenuAnchor {
		position: fixed;
		outline: none;
		width: 0;
		height: 0;
		pointer-events: none;
	}
</style>
