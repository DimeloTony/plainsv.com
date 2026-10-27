<script lang="ts">
	import type { Attachment } from "svelte/attachments";
	import type { MenuItemProps } from "./index.js";
	const { role, disabled = false, variant = "default", inset = false, keepHighlight = false, onSelect, indicator, trailing, href, rounded, children, class: className, ...props }: MenuItemProps = $props();

	/** Handles pointer highlighting and selection. */
	const registerItem: Attachment<HTMLElement> = (node) => {
		/** Selects the item unless it is disabled. */
		const handleClick = () => {
			if (!disabled) onSelect?.();
		};
		/** Highlights the item under the pointer by focusing it. */
		const handlePointerMove = () => {
			if (!disabled && document.activeElement !== node) node.focus({ preventScroll: true });
		};
		/** Clears the highlight by focusing the menu itself, unless the item keeps it. */
		const handlePointerLeave = () => {
			if (!keepHighlight && document.activeElement === node) node.closest<HTMLElement>('[role="menu"]')?.focus({ preventScroll: true });
		};

		// Listen directly so handlers passed through props still run.
		node.addEventListener("click", handleClick);
		node.addEventListener("pointermove", handlePointerMove);
		node.addEventListener("pointerleave", handlePointerLeave);
		return () => {
			node.removeEventListener("click", handleClick);
			node.removeEventListener("pointermove", handlePointerMove);
			node.removeEventListener("pointerleave", handlePointerLeave);
		};
	};
</script>

<!-- Menu item, or a link with `href`; focus marks the highlighted item. A disabled link drops its href. -->
<svelte:element this={href ? "a" : "div"} href={disabled ? undefined : href} class={["dropdownMenuItem", className]} {role} tabindex="-1" aria-disabled={disabled || undefined} data-variant={variant} data-inset={inset || indicator ? "" : undefined} data-disabled={disabled || undefined} data-rounded={rounded} {@attach registerItem} {...props}>
	<!-- Indicator column for the check mark or radio dot. -->
	{#if indicator}
		<span class="dropdownMenuItemIndicator" aria-hidden="true">{@render indicator()}</span>
	{/if}
	<span class="dropdownMenuItemText">{@render children()}</span>
	{@render trailing?.()}
</svelte:element>

<style>
	/* Base item */
	.dropdownMenuItem {
		display: flex;
		position: relative;
		align-items: center;
		gap: var(--menu-item-gap);
		cursor: default;
		outline: none;
		border-radius: var(--menu-inner-radius);
		padding-inline: var(--menu-item-padding-inline);
		padding-block: var(--menu-item-padding);
		color: inherit;
		user-select: none;
		text-decoration: none;
	}

	/* Leaves room for the indicator column */
	.dropdownMenuItem[data-inset] {
		padding-left: calc(var(--menu-item-padding-inline) + var(--menu-icon) + var(--menu-item-gap));
	}

	.dropdownMenuItemText {
		display: flex;
		flex: 1;
		align-items: center;
		gap: var(--menu-item-gap);
		white-space: nowrap;
	}

	/* Icons scale with the size */
	.dropdownMenuItem :global(svg) {
		flex-shrink: 0;
		width: var(--menu-icon);
		height: var(--menu-icon);
		pointer-events: none;
	}

	/* Icons in the text and the trailing chevron are muted */
	.dropdownMenuItemText :global(svg),
	.dropdownMenuItem > :global(svg) {
		color: var(--muted-foreground);
	}

	/* Check mark or dot pinned to the start */
	.dropdownMenuItemIndicator {
		display: flex;
		position: absolute;
		left: var(--menu-item-padding-inline);
		justify-content: center;
		align-items: center;
		width: var(--menu-icon);
		height: var(--menu-icon);
	}

	/* Radio dot is a small filled circle */
	.dropdownMenuItem[role="menuitemradio"] .dropdownMenuItemIndicator :global(svg) {
		fill: currentColor;
		width: 0.5rem;
		height: 0.5rem;
	}

	/* =============== Variants =============== */

	.dropdownMenuItem[data-variant="destructive"],
	.dropdownMenuItem[data-variant="destructive"] .dropdownMenuItemText :global(svg) {
		color: var(--destructive);
	}

	/* =============== States =============== */

	/* Highlighted by the pointer or the keyboard, or while its submenu is open */
	.dropdownMenuItem:focus,
	.dropdownMenuItem[data-state="open"] {
		background-color: var(--accent);
		color: var(--accent-foreground);
	}

	.dropdownMenuItem[data-variant="destructive"]:focus {
		background-color: color-mix(in oklab, var(--destructive) 10%, transparent);
		color: var(--destructive);
	}

	:global(.dark) .dropdownMenuItem[data-variant="destructive"]:focus {
		background-color: color-mix(in oklab, var(--destructive) 20%, transparent);
	}

	/* Disabled state */
	.dropdownMenuItem[data-disabled] {
		opacity: 50%;
		pointer-events: none;
	}

	/* =============== Rounded =============== */

	/* Overrides the panel's item radius with this exact value */
	.dropdownMenuItem[data-rounded="xs"] {
		border-radius: var(--radius-xs);
	}

	.dropdownMenuItem[data-rounded="sm"] {
		border-radius: var(--radius-sm);
	}

	.dropdownMenuItem[data-rounded="md"] {
		border-radius: var(--radius-md);
	}

	.dropdownMenuItem[data-rounded="lg"] {
		border-radius: var(--radius-lg);
	}

	.dropdownMenuItem[data-rounded="xl"] {
		border-radius: var(--radius-xl);
	}

	.dropdownMenuItem[data-rounded="2xl"] {
		border-radius: var(--radius-2xl);
	}

	.dropdownMenuItem[data-rounded="3xl"] {
		border-radius: var(--radius-3xl);
	}

	.dropdownMenuItem[data-rounded="4xl"] {
		border-radius: var(--radius-4xl);
	}

	.dropdownMenuItem[data-rounded="pill"] {
		border-radius: var(--radius-pill);
	}
</style>
