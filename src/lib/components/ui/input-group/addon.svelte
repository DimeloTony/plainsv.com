<script lang="ts">
	import type { Attachment } from "svelte/attachments";
	import type { AddonProps } from "./index.js";
	const { align = "inline-start", children, class: className, ...props }: AddonProps = $props();

	/** Focuses the group's input when the addon is clicked outside its buttons and links. */
	const focusControlOnClick: Attachment<HTMLDivElement> = (node) => {
		const handleClick = (e: MouseEvent) => {
			// If the click landed on a button or link: let it run its own action.
			if (e.target instanceof Element && e.target.closest("button, a, input, select, textarea")) return;
			node.parentElement?.querySelector<HTMLElement>("[data-input-group-control]")?.focus();
		};
		node.addEventListener("click", handleClick);
		return () => node.removeEventListener("click", handleClick);
	};
</script>

<!-- Icons, text, or buttons beside or above the input. -->
<div class={["inputGroupAddon", className]} role="group" data-align={align} {@attach focusControlOnClick} {...props}>
	{@render children()}
</div>

<style>
	/* Base addon; muted, and clicks on it focus the input */
	.inputGroupAddon {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--input-group-gap);
		cursor: text;
		color: var(--muted-foreground);
		font-weight: 500;
		user-select: none;
	}

	.inputGroupAddon > :global(svg) {
		flex-shrink: 0;
		width: 1rem; /* 16px */
		height: 1rem; /* 16px */
	}

	/* Beside the input; `order` places it whatever the markup order */
	.inputGroupAddon[data-align="inline-start"] {
		order: -1;
		padding-left: var(--input-group-padding);
	}

	.inputGroupAddon[data-align="inline-end"] {
		order: 1;
		padding-right: var(--input-group-padding);
	}

	/* Above or below the input, aligned to the start */
	.inputGroupAddon[data-align="block-start"] {
		justify-content: flex-start;
		order: -1;
		padding: var(--input-group-padding) var(--input-group-padding) 0;
	}

	.inputGroupAddon[data-align="block-end"] {
		justify-content: flex-start;
		order: 1;
		padding: 0 var(--input-group-padding) var(--input-group-padding);
	}
</style>
