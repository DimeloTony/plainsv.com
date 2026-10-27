<script lang="ts">
	import { setCompCtx } from "./ctx.svelte.js";
	import { encodeAndDecodeString } from "./core.js";
	import type { Props } from "./index.js";
	import type { CompCtxProps } from "./ctx.svelte.js";

	const { children, usingEncodedData, data, theme = "auto", highlightLines = [], size = "md", rounded, class: className, ...props }: Props = $props();
	const contextData: CompCtxProps = $derived({ data: { ...data, code: usingEncodedData ? encodeAndDecodeString(data.code, "decode") : data.code }, theme, highlightLines, size });
	const context = setCompCtx(contextData);

	// Keep the shared context in sync when the data, encoding, theme, highlighted lines, or size props change.
	$effect.pre(() => void Object.assign(context, contextData));
</script>

<!-- Root container; the header and code read their data from context. -->
<div class={["codeBlock not-typeset", className]} data-size={size} data-rounded={rounded} {...props}>
	{@render children()}
</div>

<style>
	/* Base code block */
	.codeBlock {
		display: flex;
		flex-direction: column;
		border: 1px solid var(--border);
		overflow: hidden;
	}

	/* =============== Sizes =============== */

	.codeBlock[data-size="lg"] {
		border-radius: var(--radius-lg);
	}

	.codeBlock[data-size="md"] {
		border-radius: var(--radius-md);
	}

	.codeBlock[data-size="sm"] {
		border-radius: var(--radius-sm);
	}

	.codeBlock[data-size="xs"] {
		border-radius: var(--radius-xs);
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius; must stay after the size rules */
	.codeBlock[data-rounded="xs"] {
		border-radius: var(--radius-xs);
	}

	.codeBlock[data-rounded="sm"] {
		border-radius: var(--radius-sm);
	}

	.codeBlock[data-rounded="md"] {
		border-radius: var(--radius-md);
	}

	.codeBlock[data-rounded="lg"] {
		border-radius: var(--radius-lg);
	}

	.codeBlock[data-rounded="xl"] {
		border-radius: var(--radius-xl);
	}

	.codeBlock[data-rounded="2xl"] {
		border-radius: var(--radius-2xl);
	}

	.codeBlock[data-rounded="3xl"] {
		border-radius: var(--radius-3xl);
	}

	.codeBlock[data-rounded="4xl"] {
		border-radius: var(--radius-4xl);
	}

	/* A true pill; tall content can clip at the corners, so use 3xl or 4xl to stay safe */
	.codeBlock[data-rounded="pill"] {
		border-radius: var(--radius-pill);
	}
</style>
