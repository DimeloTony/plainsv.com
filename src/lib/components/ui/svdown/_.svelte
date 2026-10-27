<script lang="ts">
	import { CodeBlock, CodeBlockCode, CodeBlockHeader } from "#lib/components/ui/code-block/index.js";
	import { AIAction, AIActionContent } from "#lib/components/ui/ai-action/index.js";
	import { BrainIcon, FilesIcon, ListIcon, LoaderCircleIcon, CheckIcon } from "@lucide/svelte";
	import { getSvdownTokens, getCodeBlockLangData, getSafeUrl, isMarkedToken, isSimpleToken, isFilesToken, isPartialSvTag, toMarkedTokens } from "./core.js";
	import type { MarkedToken } from "marked";
	import type { SvdownToken } from "./core.js";
	import type { Props } from "./index.js";
	const { content, removeAnimation = false, allowHtml = false, onFileClick, onFiles, renderFiles, renderCustom, size = "md", class: className, ...props }: Props = $props();
	// Show streamed text at once for people who ask for less motion.
	const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	// Number of characters typed out so far.
	let revealedLength = $state(0);
	// Content at the last change, to tell an append from a new message; plain, so the effect does not depend on it.
	let previousContent = "";
	const isAnimated = $derived(!removeAnimation && !prefersReducedMotion);
	const displayContent = $derived(isAnimated ? content.slice(0, revealedLength) : content);
	const parsed = $derived(getSvdownTokens(displayContent));
	// Consecutive Markdown blocks share one typeset wrapper; code blocks, activities, and custom tokens stand alone.
	const segments = $derived.by(() => {
		const result: Segment[] = [];
		for (const token of parsed.tokens) {
			// If the token is not prose: it renders on its own.
			if (!isMarkedToken(token) || token.type === "code") {
				result.push({ kind: "token", token });
				continue;
			}
			// Blank lines and link definitions render nothing, so they never start a group.
			if (token.type === "space" || token.type === "def") continue;
			const last = result.at(-1);
			if (last?.kind === "typeset") last.tokens.push(token);
			else result.push({ kind: "typeset", tokens: [token] });
		}
		return result;
	});

	// Type out appended text a few characters at a time.
	$effect(() => {
		const target = content.length;
		const isAppend = content.startsWith(previousContent);
		previousContent = content;
		// If the animation is off, or the content was replaced instead of appended to: show it all at once.
		if (!isAnimated || !isAppend) {
			revealedLength = target;
			return;
		}
		const interval = setInterval(() => {
			// Reveal more per tick the further behind it is, so a long paste catches up quickly.
			revealedLength = Math.min(target, revealedLength + Math.max(2, Math.ceil((target - revealedLength) / 20)));
			if (revealedLength >= target) clearInterval(interval);
		}, 10);
		return () => clearInterval(interval);
	});

	// Report a files block while it is still streaming, such as to open the file being written.
	$effect(() => {
		const filesToken = parsed.filesToken;
		if (filesToken && !filesToken.done) onFiles?.(filesToken);
	});

	/** A run of Markdown blocks rendered in one typeset wrapper, or a token rendered on its own */
	type Segment = { kind: "typeset"; tokens: MarkedToken[] } | { kind: "token"; token: SvdownToken };
</script>

<!-- Inline content: text, emphasis, code, links, and images. -->
{#snippet inline(tokens: MarkedToken[])}
	{#each tokens as token, index (index)}
		{#if token.type === "text" && token.tokens}
			{@render inline(toMarkedTokens(token.tokens))}
		{:else if token.type === "text" || token.type === "escape"}
			{token.text}
		{:else if token.type === "codespan"}
			<code>{token.text}</code>
		{:else if token.type === "strong"}
			<strong>{@render inline(toMarkedTokens(token.tokens))}</strong>
		{:else if token.type === "em"}
			<em>{@render inline(toMarkedTokens(token.tokens))}</em>
		{:else if token.type === "del"}
			<del>{@render inline(toMarkedTokens(token.tokens))}</del>
		{:else if token.type === "link"}
			<a href={getSafeUrl(token.href)} title={token.title ?? undefined}>{@render inline(toMarkedTokens(token.tokens))}</a>
		{:else if token.type === "image"}
			<img src={getSafeUrl(token.href)} alt={token.text} title={token.title ?? undefined} />
		{:else if token.type === "br"}
			<br />
		{:else if token.type === "checkbox"}
			<input type="checkbox" checked={token.checked} disabled />
		{:else if token.type === "html"}
			{@render html(token.text)}
		{/if}
	{/each}
{/snippet}

<!-- Raw HTML: rendered only when allowed, and hidden while a custom Sv tag is still streaming in. -->
{#snippet html(text: string)}
	{#if allowHtml}
		{@html text}
	{:else if !isPartialSvTag(text)}
		{text}
	{/if}
{/snippet}

<!-- Code fence as a highlighted code block. -->
{#snippet codeBlock(token: { text: string; lang?: string })}
	{@const langData = getCodeBlockLangData(token.lang)}
	<CodeBlock data={langData.path ? { code: token.text, path: langData.path } : { code: token.text, lang: langData.lang }} highlightLines={langData.highlightLines} {size}>
		<CodeBlockHeader />
		<CodeBlockCode />
	</CodeBlock>
{/snippet}

<!-- Block content: headings, paragraphs, lists, quotes, and tables; typeset styles them. -->
{#snippet block(token: MarkedToken)}
	{#if token.type === "heading"}
		<svelte:element this={`h${token.depth}`}>{@render inline(toMarkedTokens(token.tokens))}</svelte:element>
	{:else if token.type === "paragraph"}
		<!-- A paragraph that is the start of a custom Sv tag still streaming in stays hidden. -->
		{#if !isPartialSvTag(token.text)}
			<p>{@render inline(toMarkedTokens(token.tokens))}</p>
		{/if}
	{:else if token.type === "code"}
		<!-- A code fence nested in a list or quote. -->
		{@render codeBlock(token)}
	{:else if token.type === "blockquote"}
		<blockquote>
			{#each toMarkedTokens(token.tokens) as child, index (index)}
				{@render block(child)}
			{/each}
		</blockquote>
	{:else if token.type === "list"}
		<!-- Task lists use the GFM class names that typeset styles. -->
		<svelte:element this={token.ordered ? "ol" : "ul"} class={{ "contains-task-list": token.items.some((item) => item.task) }} start={token.ordered && token.start !== "" ? token.start : undefined}>
			{#each token.items as item, index (index)}
				<li class={{ "task-list-item": item.task }}>
					{#each toMarkedTokens(item.tokens) as child, childIndex (childIndex)}
						{@render block(child)}
					{/each}
				</li>
			{/each}
		</svelte:element>
	{:else if token.type === "table"}
		<!-- Wide tables scroll sideways instead of overflowing the response. -->
		<div class="typeset-scroll">
			<table>
				<thead>
					<tr>
						{#each token.header as cell, index (index)}
							<th align={cell.align ?? undefined}>{@render inline(toMarkedTokens(cell.tokens))}</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each token.rows as row, rowIndex (rowIndex)}
						<tr>
							{#each row as cell, index (index)}
								<td align={cell.align ?? undefined}>{@render inline(toMarkedTokens(cell.tokens))}</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else if token.type === "hr"}
		<hr />
	{:else if token.type === "html"}
		{@render html(token.text)}
	{:else if token.type === "space" || token.type === "def"}
		<!-- Blank lines and link definitions inside lists and quotes render nothing. -->
	{:else}
		<!-- Inline tokens at the top of a list item, such as tight list text and task checkboxes. -->
		{@render inline([token])}
	{/if}
{/snippet}

<!-- A token outside the prose: a code fence, an activity, files, or a custom token. -->
{#snippet standalone(token: SvdownToken)}
	{#if isSimpleToken(token)}
		<!-- Plan or thinking activity; open while it streams. -->
		<AIAction title={token.done ? token.titleDone : token.title} icon={token.action === "plan" ? ListIcon : BrainIcon} done={token.done} open={!token.done} {size}>
			<AIActionContent class="svdownActivityText">{token.text}</AIActionContent>
		</AIAction>
	{:else if isFilesToken(token)}
		{#if renderFiles}
			{@render renderFiles(token)}
		{:else}
			<!-- Files being written, with a spinner on the current one. -->
			<AIAction title={token.title || `${token.done ? "Wrote" : "Writing"} files`} icon={FilesIcon} done={token.done} open {size}>
				<AIActionContent>
					<ul class="svdownFiles">
						{#each Object.keys(token.files) as path (path)}
							{@const isWriting = !token.done && token.latestFile === path}
							<li>
								<button type="button" class="svdownFile" disabled={isWriting} onclick={() => onFileClick?.(path)}>
									{#if isWriting}
										<LoaderCircleIcon class="svdownSpin" aria-label="Writing" />
									{:else}
										<CheckIcon aria-label="Written" />
									{/if}
									{path}
								</button>
							</li>
						{/each}
					</ul>
				</AIActionContent>
			</AIAction>
		{/if}
	{:else if isMarkedToken(token) && token.type === "code"}
		{@render codeBlock(token)}
	{:else if !isMarkedToken(token) && renderCustom}
		{@render renderCustom(token)}
	{/if}
{/snippet}

<!-- No not-typeset class: the prose inside uses typeset, and the code blocks and activities opt out on their own. -->
<div class={["svdown", className]} data-size={size} {...props}>
	{#each segments as segment, index (index)}
		{#if segment.kind === "typeset"}
			<!-- Prose blocks; tune them with the typeset-chat settings in typeset.css. -->
			<div class="typeset typeset-chat">
				{#each segment.tokens as token, tokenIndex (tokenIndex)}
					{@render block(token)}
				{/each}
			</div>
		{:else}
			{@render standalone(segment.token)}
		{/if}
	{/each}
</div>

<style>
	/* Base response; prose groups, code blocks, and activities stack with even spacing */
	.svdown {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	/* Activity text keeps the line breaks of the plan or thoughts */
	.svdown :global(.svdownActivityText) {
		white-space: pre-wrap;
	}

	/* Written files, one per row */
	.svdownFiles {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.svdownFile {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		cursor: pointer;
		border: 0;
		border-radius: var(--radius-xs);
		background: none;
		padding: 0;
		color: var(--muted-foreground);
		font-size: inherit;
		font-family: var(--font-mono, ui-monospace, monospace);
		text-align: left;
	}

	.svdownFile :global(svg) {
		flex-shrink: 0;
		width: 0.75rem; /* 12px */
		height: 0.75rem; /* 12px */
	}

	.svdownFile:hover {
		color: var(--foreground);
		text-decoration: underline;
	}

	.svdownFile:focus-visible {
		outline: 2px solid var(--ring);
		outline-offset: 2px;
	}

	.svdownFile:disabled {
		cursor: default;
		text-decoration: none;
	}

	.svdown :global(.svdownSpin) {
		animation: svdownSpin 1s linear infinite;
	}

	@keyframes svdownSpin {
		to {
			transform: rotate(360deg);
		}
	}

	/* =============== Sizes =============== */

	/* The size sets the gap between blocks and the typeset text size of the prose */
	.svdown[data-size="xs"] {
		gap: var(--spacing-sm);
		--typeset-size: var(--text-xs);
	}

	.svdown[data-size="sm"] {
		gap: var(--spacing-md);
		--typeset-size: var(--text-sm);
	}

	.svdown[data-size="md"] {
		gap: var(--spacing-lg);
		--typeset-size: var(--text-md);
	}

	.svdown[data-size="lg"] {
		gap: var(--spacing-xl);
		--typeset-size: calc(var(--text-md) * 1.125);
	}
</style>
