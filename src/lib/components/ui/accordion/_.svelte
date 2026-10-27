<script lang="ts">
	import { setCompCtx } from "./ctx.svelte.js";
	import type { Props } from "./index.js";
	import type { CompCtxProps } from "./ctx.svelte.js";
	let { defaultValue = [], value = $bindable(defaultValue), onValueChange, multiple = false, disabled = false, variant = "default", size = "md", rounded, children, class: className, ...props }: Props = $props();
	const baseId = $props.id();
	const contextData: Omit<CompCtxProps, "value"> = $derived({ baseId, multiple, disabled, variant, size, rounded, onValueChange });
	const ctx = setCompCtx({ ...contextData, value });

	// Keep the shared settings in sync when the props change.
	$effect.pre(() => void Object.assign(ctx, contextData));

	// Keep the bindable prop and the shared open values in sync in both directions.
	$effect.pre(() => void (ctx.value = value));
	$effect.pre(() => void (value = ctx.value));
</script>

<!-- Stack of items; each item holds a trigger and its collapsible content. -->
<div class={["accordion not-typeset", className]} data-variant={ctx.variant} data-size={ctx.size} data-rounded={ctx.rounded} {...props}>
	{@render children()}
</div>

<style>
	/* Base accordion; items stack and share the size variables */
	.accordion {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		width: 100%;
		color: var(--foreground);
		font-size: var(--accordion-text);
		line-height: var(--accordion-line-height);
	}

	/* =============== Variants =============== */

	/* Bordered box around the items */
	.accordion[data-variant="outline"] {
		border: 1px solid var(--border);
		border-radius: var(--accordion-radius);
		padding-inline: var(--accordion-padding-inline);
	}

	/* =============== Sizes =============== */

	/* Large */
	.accordion[data-size="lg"] {
		--accordion-radius: var(--radius-lg);
		--accordion-padding-block: calc(var(--spacing-lg) + var(--spacing-xs)); /* 20px */
		--accordion-padding-inline: var(--spacing-xl);
		--accordion-text: var(--text-md);
		--accordion-line-height: var(--line-height-md);
		--accordion-icon: 1rem; /* 16px */
	}

	/* Medium — default */
	.accordion[data-size="md"] {
		--accordion-radius: var(--radius-md);
		--accordion-padding-block: var(--spacing-lg);
		--accordion-padding-inline: var(--spacing-lg);
		--accordion-text: var(--text-sm);
		--accordion-line-height: var(--line-height-sm);
		--accordion-icon: 1rem; /* 16px */
	}

	/* Small */
	.accordion[data-size="sm"] {
		--accordion-radius: var(--radius-sm);
		--accordion-padding-block: var(--spacing-md);
		--accordion-padding-inline: var(--spacing-md);
		--accordion-text: var(--text-sm);
		--accordion-line-height: var(--line-height-sm);
		--accordion-icon: var(--text-sm);
	}

	/* Extra small */
	.accordion[data-size="xs"] {
		--accordion-radius: var(--radius-xs);
		--accordion-padding-block: var(--spacing-sm);
		--accordion-padding-inline: var(--spacing-sm);
		--accordion-text: var(--text-xs);
		--accordion-line-height: var(--line-height-xs);
		--accordion-icon: var(--text-xs);
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius; must stay after the size rules */
	.accordion[data-rounded="xs"] {
		--accordion-radius: var(--radius-xs);
	}

	.accordion[data-rounded="sm"] {
		--accordion-radius: var(--radius-sm);
	}

	.accordion[data-rounded="md"] {
		--accordion-radius: var(--radius-md);
	}

	.accordion[data-rounded="lg"] {
		--accordion-radius: var(--radius-lg);
	}

	.accordion[data-rounded="xl"] {
		--accordion-radius: var(--radius-xl);
	}

	.accordion[data-rounded="2xl"] {
		--accordion-radius: var(--radius-2xl);
	}

	.accordion[data-rounded="3xl"] {
		--accordion-radius: var(--radius-3xl);
	}

	.accordion[data-rounded="4xl"] {
		--accordion-radius: var(--radius-4xl);
	}

	/* A true pill; tall content can clip at the corners, so use 3xl or 4xl to stay safe */
	.accordion[data-rounded="pill"] {
		--accordion-radius: var(--radius-pill);
	}
</style>
