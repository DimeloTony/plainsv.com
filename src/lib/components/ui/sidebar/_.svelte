<script lang="ts">
	import { fade, fly } from "svelte/transition";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { Attachment } from "svelte/attachments";
	import type { Props } from "./index.js";
	const { side = "left", variant = "sidebar", collapsible = "offcanvas", offsetTop = "0rem", children, class: className, ...props }: Props = $props();
	const ctx = useCompCtx();

	// Share the side and collapse mode with the parts, such as the tooltips on the menu buttons.
	$effect.pre(() => {
		// If the sidebar never collapses: leave both to the collapsible sidebar, since a static one can sit beside it or inside it.
		if (collapsible === "none") return;
		ctx.side = side;
		ctx.collapsible = collapsible;
	});

	/** Opens the drawer as a modal so it renders in the top layer. */
	const showModal: Attachment<HTMLDialogElement> = (node) => {
		node.showModal();
	};

	/** Closes the drawer when the backdrop is clicked. */
	const handleBackdropClick = (e: MouseEvent) => {
		// If the click landed on the dialog itself and not the panel: close.
		if (e.target === e.currentTarget) ctx.openMobile = false;
	};

	/** Closes the drawer on Escape. */
	const handleCancel = (e: Event) => {
		// Keep the dialog mounted so Svelte can run the outro transition.
		e.preventDefault();
		ctx.openMobile = false;
	};
</script>

{#if collapsible === "none"}
	<!-- A sidebar that never collapses, such as inside a card. -->
	<div class={["sidebar sidebarStatic not-typeset", className]} data-variant={variant} data-side={side} {...props}>
		{@render children()}
	</div>
{:else if ctx.isMobile}
	<!-- Below 48rem, the sidebar is a drawer that slides in from its edge. -->
	{#if ctx.openMobile}
		<dialog class="sidebarMobile not-typeset" aria-label="Sidebar" data-side={side} {@attach showModal} transition:fade={{ duration: 200 }} onclick={handleBackdropClick} oncancel={handleCancel}>
			<div class={["sidebar sidebarMobilePanel", className]} data-mobile data-side={side} transition:fly={{ x: side === "left" ? "-100%" : "100%", opacity: 1, duration: 300 }} {...props}>
				{@render children()}
			</div>
		</dialog>
	{/if}
{:else}
	<!-- Desktop sidebar: a gap that reserves its width in the layout, and a fixed panel that slides or shrinks. -->
	<div class="sidebar sidebarDesktop not-typeset" data-state={ctx.state} data-collapsible={ctx.open ? undefined : collapsible} data-variant={variant} data-side={side} style:--sidebar-panel-offset={offsetTop}>
		<div class="sidebarGap"></div>
		<div class="sidebarContainer">
			<div class={["sidebarInner", className]} {...props}>
				{@render children()}
			</div>
		</div>
	</div>
{/if}

<style>
	/* Shared panel surface */
	.sidebarStatic,
	.sidebarInner,
	.sidebarMobilePanel {
		display: flex;
		position: relative;
		flex-direction: column;
		box-sizing: border-box;
		background-color: var(--sidebar);
		color: var(--sidebar-foreground);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Never collapses; fills the height of its container */
	.sidebarStatic {
		width: var(--sidebar-panel-width);
		height: 100%;
	}

	/* A right sidebar and its reserved space sit after the main content, whatever the markup order */
	.sidebarStatic[data-side="right"],
	.sidebarDesktop[data-side="right"] {
		order: 1;
	}

	/* =============== Desktop =============== */

	/* Hidden below 48rem, where the drawer takes over */
	.sidebarDesktop {
		display: none;
		color: var(--sidebar-foreground);
	}

	@media (min-width: 48rem) {
		.sidebarDesktop {
			display: block;
		}
	}

	/* Reserves the sidebar width beside the main content */
	.sidebarGap {
		position: relative;
		transition: width 200ms linear;
		background-color: transparent;
		width: var(--sidebar-panel-width);
	}

	.sidebarDesktop[data-collapsible="offcanvas"] .sidebarGap {
		width: 0;
	}

	.sidebarDesktop[data-collapsible="icon"] .sidebarGap {
		width: var(--sidebar-panel-icon-width);
	}

	.sidebarDesktop[data-collapsible="icon"]:is([data-variant="floating"], [data-variant="inset"]) .sidebarGap {
		width: calc(var(--sidebar-panel-icon-width) + var(--spacing-lg));
	}

	/* Fixed panel the full height of the viewport, below the offset */
	.sidebarContainer {
		display: flex;
		position: fixed;
		top: var(--sidebar-panel-offset);
		bottom: 0;
		z-index: 10;
		transition-duration: 200ms;
		transition-property: left, right, width;
		transition-timing-function: linear;
		box-sizing: border-box;
		width: var(--sidebar-panel-width);
		height: calc(100svh - var(--sidebar-panel-offset));
	}

	.sidebarDesktop[data-side="left"] .sidebarContainer {
		left: 0;
	}

	.sidebarDesktop[data-side="right"] .sidebarContainer {
		right: 0;
	}

	/* Off-canvas collapse slides the panel past the edge */
	.sidebarDesktop[data-side="left"][data-collapsible="offcanvas"] .sidebarContainer {
		left: calc(var(--sidebar-panel-width) * -1);
	}

	.sidebarDesktop[data-side="right"][data-collapsible="offcanvas"] .sidebarContainer {
		right: calc(var(--sidebar-panel-width) * -1);
	}

	/* Icon collapse shrinks the panel to its icons */
	.sidebarDesktop[data-collapsible="icon"] .sidebarContainer {
		width: var(--sidebar-panel-icon-width);
	}

	.sidebarDesktop[data-collapsible="icon"]:is([data-variant="floating"], [data-variant="inset"]) .sidebarContainer {
		width: calc(var(--sidebar-panel-icon-width) + var(--spacing-lg) + 2px); /* plus the border */
	}

	.sidebarInner {
		width: 100%;
		height: 100%;
	}

	/* =============== Variants =============== */

	/* Flush panel with a border on its inner edge */
	.sidebarDesktop[data-variant="sidebar"][data-side="left"] .sidebarContainer {
		border-right: 1px solid var(--sidebar-border);
	}

	.sidebarDesktop[data-variant="sidebar"][data-side="right"] .sidebarContainer {
		border-left: 1px solid var(--sidebar-border);
	}

	/* Floating and inset panels sit inside a padding */
	.sidebarDesktop:is([data-variant="floating"], [data-variant="inset"]) .sidebarContainer {
		padding: var(--spacing-sm);
	}

	/* Floating panel is a rounded card */
	.sidebarDesktop[data-variant="floating"] .sidebarInner {
		border: 1px solid var(--sidebar-border);
		border-radius: var(--radius-lg);
	}

	/* =============== Mobile =============== */

	/* Full-screen modal with a blurred backdrop */
	.sidebarMobile {
		display: flex;
		position: fixed;
		-webkit-backdrop-filter: blur(0.25rem);
		backdrop-filter: blur(0.25rem);
		box-sizing: border-box;
		margin: 0;
		inset: 0;
		border: none;
		background-color: color-mix(in oklab, var(--background) 50%, transparent);
		padding: 0;
		width: 100%;
		max-width: none;
		height: 100%;
		max-height: none;
		overflow: hidden;
	}

	.sidebarMobile::backdrop {
		background-color: transparent;
	}

	.sidebarMobile[data-side="right"] {
		justify-content: flex-end;
	}

	/* Drawer panel the full height of the screen */
	.sidebarMobilePanel {
		width: var(--sidebar-panel-mobile-width);
		max-width: 85%;
		height: 100%;
		overflow-y: auto;
	}

	.sidebarMobilePanel[data-side="left"] {
		border-right: 1px solid var(--sidebar-border);
	}

	.sidebarMobilePanel[data-side="right"] {
		border-left: 1px solid var(--sidebar-border);
	}
</style>
