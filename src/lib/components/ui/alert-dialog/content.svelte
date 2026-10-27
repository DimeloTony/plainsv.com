<script lang="ts">
	import { fade, scale } from "svelte/transition";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { Attachment } from "svelte/attachments";
	import type { ContentProps } from "./index.js";
	const { children, class: className, ...props }: ContentProps = $props();
	const ctx = useCompCtx();

	/** Opens the modal, focuses Cancel, and returns focus to the trigger once it closes. */
	const showModal: Attachment<HTMLDialogElement> = (node) => {
		const previousFocus = document.activeElement;
		node.showModal();
		// Focus Cancel first, so pressing Enter right away never confirms the action.
		node.querySelector<HTMLElement>("[data-alert-dialog-cancel]")?.focus();
		return () => {
			// If the element that opened the dialog can take focus: give it back.
			if (previousFocus instanceof HTMLElement) previousFocus.focus();
		};
	};

	/** Closes the alert dialog on Escape. */
	const handleCancel = (e: Event) => {
		// Keep the dialog mounted so Svelte can run the outro transition.
		e.preventDefault();
		ctx.setOpen(false);
	};
</script>

<!-- Modal that only closes through its buttons or Escape; clicking the backdrop does nothing. -->
{#if ctx.open}
	<dialog class="alertDialog not-typeset" role="alertdialog" aria-labelledby={ctx.titleId} aria-describedby={ctx.descriptionId} data-size={ctx.size} data-rounded={ctx.rounded} {@attach showModal} transition:fade={{ duration: 200 }} oncancel={handleCancel}>
		<!-- The backdrop fades while the panel scales, so closing mirrors opening. -->
		<div class={["alertDialogContent", className]} transition:scale={{ duration: 250, start: 0.95 }} {...props}>
			{@render children()}
		</div>
	</dialog>
{/if}

<style>
	/* Base dialog; a blurred backdrop that centers the panel */
	.alertDialog {
		display: flex;
		position: fixed;
		justify-content: center;
		align-items: center;
		-webkit-backdrop-filter: blur(0.25rem);
		backdrop-filter: blur(0.25rem);
		box-sizing: border-box;
		inset: 0;
		border: none;
		background-color: color-mix(in oklab, var(--background) 50%, transparent);
		padding: var(--spacing-lg);
		width: 100%;
		max-width: none;
		height: 100%;
		max-height: none;
	}

	.alertDialog::backdrop {
		background-color: transparent;
	}

	/* Panel; fills the width up to the size limit and scrolls when taller than the viewport */
	.alertDialogContent {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		border: 1px solid var(--border);
		background-color: var(--popover);
		width: 100%;
		max-height: 100%;
		overflow: auto;
		color: var(--popover-foreground);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* =============== Sizes =============== */

	/* Large — default */
	.alertDialog[data-size="lg"] .alertDialogContent {
		gap: var(--spacing-lg);
		border-radius: var(--radius-lg);
		padding: var(--spacing-xl);
		max-width: 32rem; /* 512px */
	}

	/* Medium */
	.alertDialog[data-size="md"] .alertDialogContent {
		gap: var(--spacing-md);
		border-radius: var(--radius-md);
		padding: var(--spacing-lg);
		max-width: 28rem; /* 448px */
	}

	/* Small */
	.alertDialog[data-size="sm"] .alertDialogContent {
		gap: var(--spacing-sm);
		border-radius: var(--radius-sm);
		padding: var(--spacing-md);
		max-width: 24rem; /* 384px */
	}

	/* Extra small */
	.alertDialog[data-size="xs"] .alertDialogContent {
		gap: var(--spacing-sm);
		border-radius: var(--radius-xs);
		padding: var(--spacing-sm);
		max-width: 20rem; /* 320px */
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius; must stay last */
	.alertDialog[data-rounded="xs"] .alertDialogContent {
		border-radius: var(--radius-xs);
	}

	.alertDialog[data-rounded="sm"] .alertDialogContent {
		border-radius: var(--radius-sm);
	}

	.alertDialog[data-rounded="md"] .alertDialogContent {
		border-radius: var(--radius-md);
	}

	.alertDialog[data-rounded="lg"] .alertDialogContent {
		border-radius: var(--radius-lg);
	}

	.alertDialog[data-rounded="xl"] .alertDialogContent {
		border-radius: var(--radius-xl);
	}

	.alertDialog[data-rounded="2xl"] .alertDialogContent {
		border-radius: var(--radius-2xl);
	}

	.alertDialog[data-rounded="3xl"] .alertDialogContent {
		border-radius: var(--radius-3xl);
	}

	.alertDialog[data-rounded="4xl"] .alertDialogContent {
		border-radius: var(--radius-4xl);
	}

	/* A true pill; tall content can clip at the corners, so use 3xl or 4xl to stay safe */
	.alertDialog[data-rounded="pill"] .alertDialogContent {
		border-radius: var(--radius-pill);
	}
</style>
