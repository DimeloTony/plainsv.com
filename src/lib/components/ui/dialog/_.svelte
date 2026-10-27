<script lang="ts">
	import { fade, scale } from "svelte/transition";
	import { setCompCtx } from "./ctx.svelte.js";
	import type { Attachment } from "svelte/attachments";
	import type { Props } from "./index.js";
	let { open = $bindable(false), variant = "default", size = "lg", rounded = "2xl", children, class: className, ...props }: Props = $props();
	const ctx = setCompCtx({ open });

	// Keep the bindable prop and the shared open state in sync in both directions.
	$effect.pre(() => void (ctx.open = open));
	$effect.pre(() => void (open = ctx.open));

	/** Opens the dialog as a modal so it renders in the top layer above every ancestor. */
	const showModal: Attachment<HTMLDialogElement> = (node) => {
		node.showModal();
	};

	/** Closes the dialog when the backdrop around the content panel is clicked. */
	const handleBackdropClick = (e: MouseEvent) => {
		// If the click landed on the dialog itself and not its content: close.
		if (e.target === e.currentTarget) ctx.open = false;
	};

	/** Closes the dialog on Escape. */
	const handleCancel = (e: Event) => {
		// Keep the dialog mounted so Svelte can run the outro transition.
		e.preventDefault();
		ctx.open = false;
	};
</script>

<!-- Modal dialog that renders the registered content while open. -->
{#if ctx.open}
	<dialog class={["dialog not-typeset", className]} data-variant={variant} data-size={size} data-rounded={rounded} {@attach showModal} transition:fade={{ duration: 200 }} onclick={handleBackdropClick} oncancel={handleCancel} {...props}>
		<!-- The backdrop fades while the panel scales, so closing mirrors opening. -->
		<div class={["content", ctx.contentClass]} transition:scale={{ duration: 250, start: 0.95 }} {...ctx.contentAttrs}>
			{@render ctx.content?.()}
		</div>
	</dialog>
{/if}

<!-- Trigger and content parts; content registers itself for the dialog. -->
{@render children()}

<style>
	/* Base dialog */
	.dialog {
		--dialog-padding: var(--spacing-xl);
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
		padding: var(--dialog-padding);
		width: 100%;
		max-width: none;
		height: 100%;
		max-height: none;
	}

	.dialog::backdrop {
		background-color: transparent;
	}

	/* Fits inside the viewport, minus the dialog padding */
	.content {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		border: 1px solid var(--border);
		background-color: var(--popover);
		max-width: calc(100dvw - 2 * var(--dialog-padding));
		max-height: calc(100dvh - 2 * var(--dialog-padding));
		overflow: auto;
		color: var(--popover-foreground);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* =============== Variants =============== */

	.dialog[data-variant="secondary"] .content {
		border-color: transparent;
		background-color: var(--secondary);
		color: var(--secondary-foreground);
	}

	.dialog[data-variant="outline"] .content {
		background-color: var(--background);
	}

	/* Drops the panel chrome so content like images sits on the blurred backdrop */
	.dialog[data-variant="ghost"] .content {
		border-color: transparent;
		background-color: transparent;
	}

	/* =============== Sizes =============== */

	/* Large */
	.dialog[data-size="lg"] .content {
		border-radius: var(--radius-lg);
		padding: var(--spacing-xl);
	}

	/* Medium — default */
	.dialog[data-size="md"] .content {
		border-radius: var(--radius-md);
		padding: var(--spacing-lg);
	}

	/* Small */
	.dialog[data-size="sm"] .content {
		border-radius: var(--radius-sm);
		padding: var(--spacing-md);
	}

	/* Extra small */
	.dialog[data-size="xs"] .content {
		border-radius: var(--radius-xs);
		padding: var(--spacing-sm);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius; must stay last */
	.dialog[data-rounded="xs"] .content {
		border-radius: var(--radius-xs);
	}

	.dialog[data-rounded="sm"] .content {
		border-radius: var(--radius-sm);
	}

	.dialog[data-rounded="md"] .content {
		border-radius: var(--radius-md);
	}

	.dialog[data-rounded="lg"] .content {
		border-radius: var(--radius-lg);
	}

	.dialog[data-rounded="xl"] .content {
		border-radius: var(--radius-xl);
	}

	.dialog[data-rounded="2xl"] .content {
		border-radius: var(--radius-2xl);
	}

	.dialog[data-rounded="3xl"] .content {
		border-radius: var(--radius-3xl);
	}

	.dialog[data-rounded="4xl"] .content {
		border-radius: var(--radius-4xl);
	}

	/* A true pill; tall content can clip at the corners, so use 3xl or 4xl to stay safe */
	.dialog[data-rounded="pill"] .content {
		border-radius: var(--radius-pill);
	}
</style>
