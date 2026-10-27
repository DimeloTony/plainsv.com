<script lang="ts">
	import { appData } from "#lib/data/app.js";
	import type { SVGAttributes } from "svelte/elements";

	const { href, class: className, ...props }: Props = $props();

	/** Props for the PlainSv logo. */
	interface Props extends SVGAttributes<SVGSVGElement> {
		/** Wraps the logo in a link to this URL when provided. */
		href?: string;
	}
</script>

<!-- If the user provides href: render the logo inside an anchor tag. -->
{#if href}
	<a class="logoLink" {href} aria-label="logo">
		{@render logoSnippet()}
	</a>
{:else}
	{@render logoSnippet()}
{/if}

{#snippet logoSnippet()}
	<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-label={appData.title} fill="currentColor" class={["logo", className]} {...props}>
		<path d="M6.4 2.4A2.4 2.4 0 0 0 4 4.8v14.4a2.4 2.4 0 0 0 4.8 0v-4h4.8a6.4 6.4 0 0 0 0-12.8H6.4Zm2.4 4.8h4.8a1.6 1.6 0 0 1 0 3.2H8.8V7.2ZM20 19.2a2.4 2.4 0 0 0-4.8 0 2.4 2.4 0 0 0 4.8 0Z" />
	</svg>
{/snippet}

<style>
	.logoLink {
		display: inline-flex;
	}

	.logo {
		fill: var(--primary);
		width: 2rem;
		height: 2rem;
	}
</style>
