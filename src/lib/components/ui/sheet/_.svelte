<script lang="ts">
	import { fade, fly } from "svelte/transition";
	import { Button } from "#lib/components/ui/button/index.js";
	import { XIcon } from "@lucide/svelte";
	import { setCompCtx } from "./ctx.svelte.js";
	import type { Attachment } from "svelte/attachments";
	import type { Props } from "./index.js";
	let { open = $bindable(false), side = "right", variant = "default", size = "md", rounded, closeButton = true, children, class: className, ...props }: Props = $props();
	const sheetId = $props.id();
	const ctx = setCompCtx({ open, id: sheetId });

	// Keep the bindable prop and the shared open state in sync in both directions.
	$effect.pre(() => void (ctx.open = open));
	$effect.pre(() => void (open = ctx.open));

	// Slide the panel a full panel length in from its side.
	const flyParams = $derived({ top: { y: "-100%" }, right: { x: "100%" }, bottom: { y: "100%" }, left: { x: "-100%" } }[side]);

	/** Opens the sheet as a modal so it renders in the top layer above every ancestor. */
	const showModal: Attachment<HTMLDialogElement> = (node) => {
		node.showModal();
	};

	/** Closes the sheet when the backdrop around the panel is clicked. */
	const handleBackdropClick = (e: MouseEvent) => {
		// If the click landed on the dialog itself and not the panel: close.
		if (e.target === e.currentTarget) ctx.open = false;
	};

	/** Closes the sheet on Escape. */
	const handleCancel = (e: Event) => {
		// Keep the dialog mounted so Svelte can run the outro transition.
		e.preventDefault();
		ctx.open = false;
	};
</script>

<!-- Modal dialog that renders the registered content in a panel docked to one side while open. -->
{#if ctx.open}
	<dialog class={["sheet not-typeset", className]} data-side={side} data-variant={variant} data-size={size} data-rounded={rounded} data-close-button={closeButton || undefined} aria-labelledby="{ctx.id}-title" aria-describedby="{ctx.id}-description" {@attach showModal} transition:fade={{ duration: 200 }} onclick={handleBackdropClick} oncancel={handleCancel} {...props}>
		<!-- The backdrop fades while the panel slides, so closing mirrors opening. -->
		<div class="panel" transition:fly={{ ...flyParams, opacity: 1, duration: 300 }}>
			{@render ctx.content?.()}

			<!-- Close button after the content, so the modal focuses the first content control instead. -->
			{#if closeButton}
				<Button class="sheetCloseButton" variant="ghost" size="icon-sm" aria-label="Close" onclick={() => (ctx.open = false)}>
					<XIcon />
				</Button>
			{/if}
		</div>
	</dialog>
{/if}

<!-- Trigger and content parts; content registers itself for the sheet. -->
{@render children()}

<style>
	/* Base sheet */
	.sheet {
		--sheet-radius: 0;
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

	.sheet::backdrop {
		background-color: transparent;
	}

	/* Panel docked to one edge; its inner edge carries the border and radius */
	.panel {
		display: flex;
		position: relative;
		flex-direction: column;
		box-sizing: border-box;
		border: 0 solid var(--border);
		background-color: var(--popover);
		overflow: auto;
		color: var(--popover-foreground);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Corner close button above the content */
	.panel > :global(.sheetCloseButton) {
		position: absolute;
		top: var(--spacing-md);
		right: var(--spacing-md);
	}

	/* Keeps the header text clear of the close button */
	.sheet[data-close-button] .panel :global(.sheetHeader) {
		padding-right: var(--control-height-sm);
	}

	/* =============== Sides =============== */

	/* Side panels fill the height and take most of the width on narrow screens */
	.sheet[data-side="right"] {
		justify-content: flex-end;
	}

	.sheet[data-side="left"] {
		justify-content: flex-start;
	}

	.sheet[data-side="right"] .panel,
	.sheet[data-side="left"] .panel {
		width: 75%;
		max-width: var(--sheet-width);
		height: 100%;
	}

	.sheet[data-side="right"] .panel {
		border-left-width: 1px;
		border-top-left-radius: var(--sheet-radius);
		border-bottom-left-radius: var(--sheet-radius);
	}

	.sheet[data-side="left"] .panel {
		border-right-width: 1px;
		border-top-right-radius: var(--sheet-radius);
		border-bottom-right-radius: var(--sheet-radius);
	}

	/* Top and bottom panels fill the width and size to their content */
	.sheet[data-side="top"],
	.sheet[data-side="bottom"] {
		flex-direction: column;
	}

	.sheet[data-side="top"] {
		justify-content: flex-start;
	}

	.sheet[data-side="bottom"] {
		justify-content: flex-end;
	}

	.sheet[data-side="top"] .panel,
	.sheet[data-side="bottom"] .panel {
		width: 100%;
		max-height: 75dvh;
	}

	.sheet[data-side="top"] .panel {
		border-bottom-width: 1px;
		border-bottom-right-radius: var(--sheet-radius);
		border-bottom-left-radius: var(--sheet-radius);
	}

	.sheet[data-side="bottom"] .panel {
		border-top-width: 1px;
		border-top-right-radius: var(--sheet-radius);
		border-top-left-radius: var(--sheet-radius);
	}

	/* =============== Variants =============== */

	.sheet[data-variant="secondary"] .panel {
		border-color: transparent;
		background-color: var(--secondary);
		color: var(--secondary-foreground);
	}

	.sheet[data-variant="outline"] .panel {
		background-color: var(--background);
	}

	/* =============== Sizes =============== */

	/* Large; side panels read --sheet-width */
	.sheet[data-size="lg"] .panel {
		--sheet-width: 32rem; /* 512px */
		gap: var(--spacing-xl);
		padding: var(--spacing-xl);
	}

	/* Medium — default */
	.sheet[data-size="md"] .panel {
		--sheet-width: 24rem; /* 384px */
		gap: var(--spacing-lg);
		padding: var(--spacing-lg);
	}

	/* Small */
	.sheet[data-size="sm"] .panel {
		--sheet-width: 20rem; /* 320px */
		gap: var(--spacing-md);
		padding: var(--spacing-md);
	}

	/* Extra small */
	.sheet[data-size="xs"] .panel {
		--sheet-width: 16rem; /* 256px */
		gap: var(--spacing-sm);
		padding: var(--spacing-sm);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* =============== Rounded =============== */

	/* Sets the inner corner radius; must stay last */
	.sheet[data-rounded="xs"] {
		--sheet-radius: var(--radius-xs);
	}

	.sheet[data-rounded="sm"] {
		--sheet-radius: var(--radius-sm);
	}

	.sheet[data-rounded="md"] {
		--sheet-radius: var(--radius-md);
	}

	.sheet[data-rounded="lg"] {
		--sheet-radius: var(--radius-lg);
	}

	.sheet[data-rounded="xl"] {
		--sheet-radius: var(--radius-xl);
	}

	.sheet[data-rounded="2xl"] {
		--sheet-radius: var(--radius-2xl);
	}

	.sheet[data-rounded="3xl"] {
		--sheet-radius: var(--radius-3xl);
	}

	.sheet[data-rounded="4xl"] {
		--sheet-radius: var(--radius-4xl);
	}

	/* A true pill; tall content can clip at the corners, so use 3xl or 4xl to stay safe */
	.sheet[data-rounded="pill"] {
		--sheet-radius: var(--radius-pill);
	}
</style>
