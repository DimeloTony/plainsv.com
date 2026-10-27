<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	import type { ContentProps } from "./index.js";
	const { variant, size, rounded, children, class: className, ...props }: ContentProps = $props();
	const ctx = useCompCtx();
</script>

<!-- Message text; its own variant, size, and radius override the message's. -->
<div class={["messageContent", className]} data-variant={variant ?? ctx.variant} data-size={size} data-rounded={rounded} {...props}>
	{@render children()}
</div>

<style>
	/* Base bubble; sized by the message unless this content sets its own size */
	.messageContent {
		box-sizing: border-box;
		border: 1px solid transparent;
		border-radius: var(--message-content-radius);
		padding: var(--message-content-padding);
		min-width: 0;
		font-size: var(--message-content-text);
		line-height: var(--message-content-line-height);
		overflow-wrap: break-word;
	}

	/* =============== Variants =============== */

	/* Filled primary bubble */
	.messageContent[data-variant="default"] {
		background-color: var(--primary);
		color: var(--primary-foreground);
	}

	/* Filled secondary bubble, the default for user messages */
	.messageContent[data-variant="secondary"] {
		background-color: var(--secondary);
		color: var(--secondary-foreground);
	}

	/* Bordered bubble on the page background */
	.messageContent[data-variant="outline"] {
		border-color: var(--border);
		background-color: var(--background);
		color: var(--foreground);
	}

	:global(.dark) .messageContent[data-variant="outline"] {
		border-color: var(--input);
	}

	/* Tinted bubble with destructive text, such as for a failed message */
	.messageContent[data-variant="destructive"] {
		background-color: color-mix(in oklab, var(--destructive) 10%, transparent);
		color: var(--destructive);
	}

	:global(.dark) .messageContent[data-variant="destructive"] {
		background-color: color-mix(in oklab, var(--destructive) 20%, transparent);
	}

	/* Plain text without a bubble, the default for assistant messages */
	.messageContent[data-variant="ghost"] {
		border-width: 0;
		padding: 0;
		color: var(--foreground);
	}

	/* =============== Sizes =============== */

	/* Overrides the message size for this bubble only; padding goes through the variable so `ghost` keeps none, and the pill radius follows this size */

	/* Large */
	.messageContent[data-size="lg"] {
		--message-content-padding: var(--spacing-lg) var(--spacing-xl);
		--message-content-pill-radius: calc(var(--spacing-lg) + var(--line-height-md) / 2); /* 28px */
		font-size: var(--text-md);
		line-height: var(--line-height-md);
	}

	/* Medium */
	.messageContent[data-size="md"] {
		--message-content-padding: var(--spacing-md) var(--spacing-lg);
		--message-content-pill-radius: calc(var(--spacing-md) + var(--line-height-sm) / 2); /* 22px */
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Small */
	.messageContent[data-size="sm"] {
		--message-content-padding: var(--spacing-sm) var(--spacing-md);
		--message-content-pill-radius: calc(var(--spacing-sm) + var(--line-height-sm) / 2); /* 18px */
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Extra small */
	.messageContent[data-size="xs"] {
		--message-content-padding: calc(var(--spacing-xs) * 1.5) var(--spacing-sm); /* 6px 8px */
		--message-content-pill-radius: calc(var(--spacing-xs) * 1.5 + var(--line-height-xs) / 2); /* 14px */
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* =============== Rounded =============== */

	/* Overrides the inherited radius with this exact value; must stay after the size rules */
	.messageContent[data-rounded="xs"] {
		border-radius: var(--radius-xs);
	}

	.messageContent[data-rounded="sm"] {
		border-radius: var(--radius-sm);
	}

	.messageContent[data-rounded="md"] {
		border-radius: var(--radius-md);
	}

	.messageContent[data-rounded="lg"] {
		border-radius: var(--radius-lg);
	}

	.messageContent[data-rounded="xl"] {
		border-radius: var(--radius-xl);
	}

	.messageContent[data-rounded="2xl"] {
		border-radius: var(--radius-2xl);
	}

	.messageContent[data-rounded="3xl"] {
		border-radius: var(--radius-3xl);
	}

	.messageContent[data-rounded="4xl"] {
		border-radius: var(--radius-4xl);
	}

	/* Half the one-line bubble height: a pill on one line, round corners on long messages */
	.messageContent[data-rounded="pill"] {
		border-radius: var(--message-content-pill-radius);
	}

	/* A resized bubble in a `pill` message keeps the pill for its own size, since the inherited radius was resolved at the message's size */
	:global(.message[data-rounded="pill"]) > .messageContent[data-size]:not([data-rounded]) {
		border-radius: var(--message-content-pill-radius);
	}
</style>
