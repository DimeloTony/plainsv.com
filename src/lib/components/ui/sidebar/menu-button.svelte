<script lang="ts">
	import { Tooltip, TooltipTrigger, TooltipContent, type TooltipTriggerProps } from "#lib/components/ui/tooltip/index.js";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { MenuButtonProps } from "./index.js";
	const { isActive = false, variant = "default", size = "md", tooltip, showTooltip = false, href, children, class: className, ...props }: MenuButtonProps = $props();
	const ctx = useCompCtx();
	const isLink = $derived(href !== undefined);
	// The tooltip shows the label while the sidebar is collapsed to its icons, or always with `showTooltip`.
	const showsTooltip = $derived(!!tooltip && (showTooltip || ctx.isIconCollapsed));
</script>

<!-- The button itself; extra attributes come from the tooltip trigger when it wraps the button. -->
{#snippet menuButton(tooltipAttrs?: Parameters<NonNullable<TooltipTriggerProps["trigger"]>>[0]["props"])}
	<svelte:element this={isLink ? "a" : "button"} type={isLink ? undefined : "button"} class={["sidebarMenuButton", className]} {href} aria-current={isActive && isLink ? "page" : undefined} data-active={isActive || undefined} data-variant={variant} data-size={size} {...tooltipAttrs} {...props}>
		{@render children()}
	</svelte:element>
{/snippet}

{#if showsTooltip}
	<!-- Collapsed to icons: the label shows in a tooltip beside the button. -->
	<Tooltip side={ctx.side === "left" ? "right" : "left"} arrow={false}>
		<TooltipTrigger>
			{#snippet trigger({ props: tooltipAttrs })}
				{@render menuButton(tooltipAttrs)}
			{/snippet}
		</TooltipTrigger>
		<TooltipContent>{tooltip}</TooltipContent>
	</Tooltip>
{:else}
	{@render menuButton()}
{/if}

<style>
	/* Base button; the last span is the label and truncates */
	.sidebarMenuButton {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		transition-duration: 150ms;
		transition-property: width, height, padding, color, background-color, box-shadow;
		transition-timing-function: linear;
		cursor: pointer;
		box-sizing: border-box;
		outline: none;
		border: 0;
		border-radius: var(--radius-md);
		background-color: transparent;
		padding: var(--spacing-sm);
		width: 100%;
		overflow: hidden;
		color: var(--sidebar-foreground);
		font: inherit;
		text-align: left;
		text-decoration: none;
	}

	.sidebarMenuButton:hover,
	.sidebarMenuButton:active {
		background-color: var(--sidebar-accent);
		color: var(--sidebar-accent-foreground);
	}

	.sidebarMenuButton > :global(span:last-child) {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.sidebarMenuButton > :global(svg) {
		flex-shrink: 0;
		width: 1rem; /* 16px */
		height: 1rem; /* 16px */
	}

	/* =============== Variants =============== */

	/* Bordered button on the page background */
	.sidebarMenuButton[data-variant="outline"] {
		box-shadow: 0 0 0 1px var(--sidebar-border);
		background-color: var(--background);
	}

	/* =============== States =============== */

	/* Current page */
	.sidebarMenuButton[data-active] {
		background-color: var(--sidebar-accent);
		color: var(--sidebar-accent-foreground);
		font-weight: 500;
	}

	/* Keyboard focus ring */
	.sidebarMenuButton:focus-visible {
		box-shadow: 0 0 0 2px var(--sidebar-ring);
	}

	/* Disabled state for buttons and links */
	.sidebarMenuButton:disabled,
	.sidebarMenuButton[aria-disabled="true"] {
		opacity: 50%;
		pointer-events: none;
	}

	/* =============== Sizes =============== */

	/* Large; room for two lines, such as a name and an email */
	.sidebarMenuButton[data-size="lg"] {
		height: 3rem; /* 48px */
		font-size: var(--text-sm);
	}

	/* Medium — default */
	.sidebarMenuButton[data-size="md"] {
		height: var(--control-height-sm);
		font-size: var(--text-sm);
	}

	/* Small */
	.sidebarMenuButton[data-size="sm"] {
		height: 1.75rem; /* 28px */
		font-size: var(--text-xs);
	}

	/* Extra small */
	.sidebarMenuButton[data-size="xs"] {
		height: var(--control-height-xs);
		font-size: var(--text-xs);
	}

	/* Collapsed to icons, every button is a square that shows only its icon */
	:global(.sidebar[data-collapsible="icon"]) .sidebarMenuButton {
		padding: var(--spacing-sm);
		width: var(--control-height-sm);
		height: var(--control-height-sm);
	}

	:global(.sidebar[data-collapsible="icon"]) .sidebarMenuButton[data-size="lg"] {
		padding: 0;
	}
</style>
