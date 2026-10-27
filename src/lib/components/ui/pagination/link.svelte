<script lang="ts">
	import { getContext } from "svelte";
	import { Button } from "#lib/components/ui/button/index.js";
	import type { LinkProps, ButtonAttrs } from "./index.js";
	const { isActive = false, size, children, ...props }: LinkProps = $props();
	const getSize = getContext<() => UiSize>("pagination-size");
	// Rest destructuring merges the button and link forms into one type, so the attributes are narrowed back to that union once here.
	const buttonAttrs = $derived(props as ButtonAttrs);
</script>

<!-- Square page link; the current page has an outline and is announced as the current page. -->
<Button variant={isActive ? "outline" : "ghost"} size="icon-{size ?? getSize()}" aria-current={isActive ? "page" : undefined} {...buttonAttrs}>
	{@render children()}
</Button>
