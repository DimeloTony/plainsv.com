<script lang="ts">
	import { getContext } from "svelte";
	import { ChevronRightIcon } from "@lucide/svelte";
	import { Button } from "#lib/components/ui/button/index.js";
	import type { StepProps, ButtonAttrs } from "./index.js";
	const { children, size, ...props }: StepProps = $props();
	const getSize = getContext<() => UiSize>("pagination-size");
	// Rest destructuring merges the button and link forms into one type, so the attributes are narrowed back to that union once here.
	const buttonAttrs = $derived(props as ButtonAttrs);
</script>

<!-- Link to the next page; the label hides on narrow screens and the aria-label keeps it named. -->
<Button variant="ghost" size={size ?? getSize()} aria-label="Go to next page" {...buttonAttrs}>
	<span class="paginationStepLabel">
		{#if children}{@render children()}{:else}Next{/if}
	</span>
	<ChevronRightIcon />
</Button>

<style>
	/* Label shows from 40rem wide */
	.paginationStepLabel {
		display: none;
	}

	@media (min-width: 40rem) {
		.paginationStepLabel {
			display: inline;
		}
	}
</style>
