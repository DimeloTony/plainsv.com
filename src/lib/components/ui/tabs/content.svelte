<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	import type { ContentProps } from "./index.js";
	const { value, children, class: className, ...props }: ContentProps = $props();
	const ctx = useCompCtx();
</script>

<!-- Render the panel only while its tab is active. -->
{#if ctx.value === value}
	<div class={["tabsContent", className]} role="tabpanel" id={ctx.contentId(value)} aria-labelledby={ctx.triggerId(value)} tabindex="0" data-state="active" data-orientation={ctx.orientation} {...props}>
		{@render children()}
	</div>
{/if}

<style>
	/* Base panel; focusable so keyboard users can Tab from the list into it */
	.tabsContent {
		flex: 1;
		transition: box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1);
		outline: none;
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* =============== States =============== */

	/* Keyboard focus ring */
	.tabsContent:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
	}
</style>
