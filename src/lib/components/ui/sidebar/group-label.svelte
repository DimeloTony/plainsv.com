<script lang="ts">
	import type { GroupLabelProps } from "./index.js";
	const { children, class: className, ...props }: GroupLabelProps = $props();
	// A label that runs something on press is a button, such as the trigger of a collapsible group.
	const isButton = $derived(props.onclick !== undefined);
</script>

<!-- Muted heading of the group; fades out while collapsed to icons. -->
<svelte:element this={isButton ? "button" : "div"} type={isButton ? "button" : undefined} class={["sidebarGroupLabel", className]} {...props}>
	{@render children()}
</svelte:element>

<style>
	/* Base label */
	.sidebarGroupLabel {
		display: flex;
		flex-shrink: 0;
		align-items: center;
		transition-duration: 200ms;
		transition-property: margin, opacity;
		transition-timing-function: linear;
		border-radius: var(--radius-md);
		padding-inline: var(--spacing-sm);
		height: var(--control-height-sm);
		color: color-mix(in oklab, var(--sidebar-foreground) 70%, transparent);
		font-weight: 500;
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	.sidebarGroupLabel :global(svg) {
		flex-shrink: 0;
		width: 1rem; /* 16px */
		height: 1rem; /* 16px */
	}

	/* =============== States =============== */

	/* A button label fills the group width and highlights on hover */
	button.sidebarGroupLabel {
		cursor: pointer;
		box-sizing: border-box;
		width: 100%;
		text-align: left;
	}

	button.sidebarGroupLabel:hover {
		background-color: var(--sidebar-accent);
		color: var(--sidebar-accent-foreground);
	}

	/* Keyboard focus ring */
	button.sidebarGroupLabel:focus-visible {
		box-shadow: 0 0 0 2px var(--sidebar-ring);
	}

	/* Collapsed to icons, the label slides up out of view */
	:global(.sidebar[data-collapsible="icon"]) .sidebarGroupLabel {
		opacity: 0;
		margin-top: calc(var(--control-height-sm) * -1);
	}
</style>
