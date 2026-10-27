<script lang="ts">
	import { CodeBlock, CodeBlockCode, CodeBlockHeader, encodeAndDecodeString } from "#lib/components/ui/code-block/index.js";

	const { section = "preview" }: Props = $props();
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	const roundedValues: UiRounded[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"];
	const tsCode = `/** Adds two numbers. */\nexport const add = (a: number, b: number) => a + b;\n\nconsole.log(add(1, 2));`;
	const cssCode = `.card {\n\tdisplay: grid;\n\tgap: var(--spacing-md);\n\tborder: 1px solid var(--border);\n}`;
	const bashCode = "bunx prettier --write src/lib/math.ts";
	const encodedCode = encodeAndDecodeString(tsCode, "encode");

	/** Live preview for one section of the code block docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "title" | "header" | "highlight" | "encoded" | "theme" | "sizes" | "rounded";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Language detected from the file path. -->
		<CodeBlock data={{ code: tsCode, path: "src/lib/math.ts" }}>
			<CodeBlockHeader />
			<CodeBlockCode />
		</CodeBlock>
	{:else if section === "title"}
		<!-- Explicit language with a header title. -->
		<CodeBlock data={{ code: cssCode, lang: "css", title: "Card styles" }}>
			<CodeBlockHeader />
			<CodeBlockCode />
		</CodeBlock>
	{:else if section === "header"}
		<!-- No title or path hides the header, unless the header has its own path label. -->
		<CodeBlock data={{ code: bashCode, lang: "bash" }}>
			<CodeBlockHeader />
			<CodeBlockCode />
		</CodeBlock>
		<CodeBlock data={{ code: bashCode, lang: "bash" }}>
			<CodeBlockHeader path="Terminal" />
			<CodeBlockCode />
		</CodeBlock>
	{:else if section === "highlight"}
		<!-- Highlighted lines from a range string and from an array. -->
		<CodeBlock data={{ code: tsCode, path: "src/lib/math.ts" }} highlightLines="1-2">
			<CodeBlockHeader />
			<CodeBlockCode />
		</CodeBlock>
		<CodeBlock data={{ code: cssCode, lang: "css", title: "Card styles" }} highlightLines={[2, 4]}>
			<CodeBlockHeader />
			<CodeBlockCode />
		</CodeBlock>
	{:else if section === "encoded"}
		<!-- Base64 code decoded before display and copying. -->
		<CodeBlock data={{ code: encodedCode, path: "encoded.ts" }} usingEncodedData>
			<CodeBlockHeader />
			<CodeBlockCode />
		</CodeBlock>
	{:else if section === "theme"}
		<!-- Forced light and dark themes, ignoring the page's dark mode. -->
		<CodeBlock data={{ code: tsCode, lang: "typescript", title: "Light" }} theme="light">
			<CodeBlockHeader />
			<CodeBlockCode />
		</CodeBlock>
		<CodeBlock data={{ code: tsCode, lang: "typescript", title: "Dark" }} theme="dark">
			<CodeBlockHeader />
			<CodeBlockCode />
		</CodeBlock>
	{:else if section === "sizes"}
		<!-- Header height, padding, and font size at every size. -->
		{#each sizes as size (size)}
			<CodeBlock data={{ code: bashCode, lang: "bash", title: `Size ${size}` }} {size}>
				<CodeBlockHeader />
				<CodeBlockCode />
			</CodeBlock>
		{/each}
	{:else if section === "rounded"}
		<!-- Each rounded value overriding the size radius. -->
		{#each roundedValues as rounded (rounded)}
			<CodeBlock data={{ code: bashCode, lang: "bash", title: `Rounded ${rounded}` }} {rounded}>
				<CodeBlockHeader />
				<CodeBlockCode />
			</CodeBlock>
		{/each}
	{/if}
</div>

<style>
	.demo {
		display: grid;
		gap: var(--spacing-md);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 1rem 0;
	}
</style>
