<script lang="ts">
	import { setCompCtx } from "./ctx.svelte.js";
	import type { Props } from "./index.js";
	import type { CompCtxProps } from "./ctx.svelte.js";
	const { from = "assistant", variant, size = "md", rounded = "pill", children, class: className, ...props }: Props = $props();
	// User messages get a bubble and assistant messages read as plain text, unless `variant` is set.
	const resolvedVariant = $derived(variant ?? (from === "user" ? "secondary" : "ghost"));
	const contextData: CompCtxProps = $derived({ variant: resolvedVariant, size });
	const ctx = setCompCtx(contextData);

	// Keep the shared settings in sync when the props change.
	$effect.pre(() => void Object.assign(ctx, contextData));
</script>

<!-- Message row; user messages sit on the right with the avatar after the content. -->
<article class={["message not-typeset", className]} data-from={from} data-variant={resolvedVariant} data-size={size} data-rounded={rounded} {...props}>
	{@render children()}
</article>

<style>
	/* Base message; a grid, since the avatar sits beside the content while the actions sit under it */
	.message {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		align-items: start;
		justify-items: start;
		box-sizing: border-box;
		width: 100%;
		color: var(--foreground);
	}

	/* With an avatar: avatar in the first column, the content and actions beside it */
	.message:has(> :global(.messageAvatar)) {
		grid-template-columns: auto minmax(0, 1fr);
	}

	.message > :global(.messageAvatar) {
		grid-row: 1;
		grid-column: 1;
	}

	.message:has(> :global(.messageAvatar)) > :global(:not(.messageAvatar)) {
		grid-column: 2;
	}

	/* User messages: content on the right, avatar in the last column */
	.message[data-from="user"] {
		justify-items: end;
	}

	.message[data-from="user"]:has(> :global(.messageAvatar)) {
		grid-template-columns: minmax(0, 1fr) auto;
	}

	.message[data-from="user"] > :global(.messageAvatar) {
		grid-column: 2;
	}

	.message[data-from="user"]:has(> :global(.messageAvatar)) > :global(:not(.messageAvatar)) {
		grid-column: 1;
	}

	/* Keep user bubbles narrower than the row */
	.message[data-from="user"] > :global(.messageContent) {
		max-width: 80%;
	}

	/* =============== Sizes =============== */

	/* Large */
	.message[data-size="lg"] {
		--message-content-padding: var(--spacing-lg) var(--spacing-xl);
		--message-content-radius: var(--radius-lg);
		--message-content-pill-radius: calc(var(--spacing-lg) + var(--line-height-md) / 2); /* 28px */
		--message-content-text: var(--text-md);
		--message-content-line-height: var(--line-height-md);
		gap: var(--spacing-md);
	}

	/* Medium — default */
	.message[data-size="md"] {
		--message-content-padding: var(--spacing-md) var(--spacing-lg);
		--message-content-radius: var(--radius-md);
		--message-content-pill-radius: calc(var(--spacing-md) + var(--line-height-sm) / 2); /* 22px */
		--message-content-text: var(--text-sm);
		--message-content-line-height: var(--line-height-sm);
		gap: var(--spacing-sm);
	}

	/* Small */
	.message[data-size="sm"] {
		--message-content-padding: var(--spacing-sm) var(--spacing-md);
		--message-content-radius: var(--radius-sm);
		--message-content-pill-radius: calc(var(--spacing-sm) + var(--line-height-sm) / 2); /* 18px */
		--message-content-text: var(--text-sm);
		--message-content-line-height: var(--line-height-sm);
		gap: var(--spacing-sm);
	}

	/* Extra small */
	.message[data-size="xs"] {
		--message-content-padding: calc(var(--spacing-xs) * 1.5) var(--spacing-sm); /* 6px 8px */
		--message-content-radius: var(--radius-xs);
		--message-content-pill-radius: calc(var(--spacing-xs) * 1.5 + var(--line-height-xs) / 2); /* 14px */
		--message-content-text: var(--text-xs);
		--message-content-line-height: var(--line-height-xs);
		gap: var(--spacing-xs);
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius; must stay after the size rules */
	.message[data-rounded="xs"] {
		--message-content-radius: var(--radius-xs);
	}

	.message[data-rounded="sm"] {
		--message-content-radius: var(--radius-sm);
	}

	.message[data-rounded="md"] {
		--message-content-radius: var(--radius-md);
	}

	.message[data-rounded="lg"] {
		--message-content-radius: var(--radius-lg);
	}

	.message[data-rounded="xl"] {
		--message-content-radius: var(--radius-xl);
	}

	.message[data-rounded="2xl"] {
		--message-content-radius: var(--radius-2xl);
	}

	.message[data-rounded="3xl"] {
		--message-content-radius: var(--radius-3xl);
	}

	.message[data-rounded="4xl"] {
		--message-content-radius: var(--radius-4xl);
	}

	/* Half the one-line bubble height: a pill on one line, round corners on long messages */
	.message[data-rounded="pill"] {
		--message-content-radius: var(--message-content-pill-radius);
	}
</style>
