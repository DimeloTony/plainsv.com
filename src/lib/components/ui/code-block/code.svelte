<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	import { shikiHighlighter, getFileLangFromPath, getHighlightedLines, lineHighlightTransformer } from "./core.js";
	import type { CodeProps } from "./index.js";

	const { theme, highlightLines, class: className, ...props }: CodeProps = $props();
	const context = useCompCtx();
	// Unknown file extensions fall back to bash highlighting.
	const lang = $derived("path" in context.data ? getFileLangFromPath(context.data.path) || "bash" : context.data.lang);
	const activeTheme = $derived(theme ?? context.theme);
	const transformers = $derived([lineHighlightTransformer(getHighlightedLines(highlightLines ?? context.highlightLines, context.data.code.split("\n").length))]);
	// Auto renders both themes, so CSS can switch them without reading app state.
	const codeHighlighted = $derived(activeTheme === "auto" ? shikiHighlighter.codeToHtml(context.data.code, { lang, themes: { light: "vscode-light", dark: "vscode-dark" }, transformers }) : shikiHighlighter.codeToHtml(context.data.code, { lang, theme: activeTheme === "dark" ? "vscode-dark" : "vscode-light", transformers }));
</script>

<!-- Highlighted code; the HTML comes from Shiki, which escapes the source code. -->
<div class={["codeBlockCode", className]} data-size={context.size} data-theme={activeTheme} {...props}>
	{@html codeHighlighted}
</div>

<style>
	/* Base code display */
	.codeBlockCode {
		background-color: color-mix(in oklab, var(--card) 40%, transparent);
		overflow-x: auto;
		font-family: var(--font-mono, ui-monospace, monospace);
		tab-size: 4;
	}

	/* Shiki sets an inline background, so !important is needed to show the card color */
	.codeBlockCode :global(.shiki) {
		margin: 0;
		background-color: transparent !important;
		min-width: max-content;
		font: inherit;
	}

	.codeBlockCode :global(code) {
		font: inherit;
	}

	/* Full-width lines carry the horizontal padding, so highlights reach both edges */
	.codeBlockCode :global(.line) {
		display: inline-block;
		width: 100%;
		min-height: 1lh;
	}

	/* =============== States =============== */

	/* Auto theme under a .dark ancestor; Shiki sets inline light colors, so !important is needed */
	:global(.dark) .codeBlockCode[data-theme="auto"] :global(.shiki),
	:global(.dark) .codeBlockCode[data-theme="auto"] :global(.shiki span) {
		color: var(--shiki-dark) !important;
		font-style: var(--shiki-dark-font-style) !important;
		font-weight: var(--shiki-dark-font-weight) !important;
		text-decoration: var(--shiki-dark-text-decoration) !important;
	}

	/* Highlighted line from `highlightLines`, with an accent bar on the left edge */
	.codeBlockCode :global(.line.highlighted) {
		box-shadow: inset 2px 0 0 var(--ring);
		background-color: color-mix(in oklab, var(--ring) 15%, transparent);
	}

	/* =============== Sizes =============== */

	/* Large */
	.codeBlockCode[data-size="lg"] {
		padding-block: var(--spacing-xl);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	.codeBlockCode[data-size="lg"] :global(.line) {
		padding-inline: var(--spacing-xl);
	}

	/* Medium — default */
	.codeBlockCode[data-size="md"] {
		padding-block: var(--spacing-lg);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	.codeBlockCode[data-size="md"] :global(.line) {
		padding-inline: var(--spacing-lg);
	}

	/* Small */
	.codeBlockCode[data-size="sm"] {
		padding-block: var(--spacing-md);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	.codeBlockCode[data-size="sm"] :global(.line) {
		padding-inline: var(--spacing-md);
	}

	/* Extra small */
	.codeBlockCode[data-size="xs"] {
		padding-block: var(--spacing-sm);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	.codeBlockCode[data-size="xs"] :global(.line) {
		padding-inline: var(--spacing-sm);
	}
</style>
