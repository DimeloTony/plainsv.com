<script lang="ts">
	import { Button } from "#lib/components/ui/button/index.js";
	import { useCompCtx } from "./ctx.svelte.js";
	import { CopyIcon, CheckIcon } from "@lucide/svelte";
	import type { HeaderProps } from "./index.js";

	const { path, class: className, ...props }: HeaderProps = $props();
	const context = useCompCtx();
	const label = $derived(context.data.title || path || ("path" in context.data ? context.data.path : ""));
</script>

<!-- Header with the file label and copy button, shown only when there is a label. -->
{#if label}
	<header class={["codeBlockHeader", className]} data-size={context.size} {...props}>
		<span class="codeBlockLabel">{label}</span>
		<Button size="icon-xs" variant="ghost" aria-label={context.isCopying ? "Copied" : "Copy code"} disabled={context.isCopying} onclick={() => context.copyCode()}>
			{#if context.isCopying}
				<CheckIcon />
			{:else}
				<CopyIcon />
			{/if}
		</Button>
	</header>
{/if}

<style>
	/* Base header */
	.codeBlockHeader {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--spacing-lg);
		border-bottom: 1px solid var(--border);
		background-color: color-mix(in oklab, var(--card) 60%, transparent);
		color: var(--muted-foreground);
		font-weight: 300;
	}

	/* Truncates long paths so the copy button stays visible */
	.codeBlockLabel {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/* =============== Sizes =============== */

	/* Large */
	.codeBlockHeader[data-size="lg"] {
		padding-inline: var(--spacing-xl) var(--spacing-md);
		height: var(--control-height-lg);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Medium — default */
	.codeBlockHeader[data-size="md"] {
		padding-inline: var(--spacing-lg) var(--spacing-sm);
		height: var(--control-height-lg);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Small */
	.codeBlockHeader[data-size="sm"] {
		padding-inline: var(--spacing-md) var(--spacing-xs);
		height: var(--control-height-sm);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	/* Extra small */
	.codeBlockHeader[data-size="xs"] {
		padding-inline: var(--spacing-sm) 0;
		height: var(--control-height-xs);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}
</style>
