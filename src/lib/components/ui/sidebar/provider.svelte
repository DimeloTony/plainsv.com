<script lang="ts">
	import { setCompCtx } from "./ctx.svelte.js";
	import type { ProviderProps } from "./index.js";
	let { open = $bindable(true), onOpenChange, width = "16rem", iconWidth = "3rem", mobileWidth = "18rem", shortcut = "b", children, class: className, ...props }: ProviderProps = $props();
	// Screens narrower than 48rem show the sidebar as a drawer.
	const MOBILE_QUERY = "(max-width: 47.99rem)";
	const ctx = setCompCtx({ open, onOpenChange });

	// Keep the callback current when the prop changes.
	$effect.pre(() => void (ctx.onOpenChange = onOpenChange));

	// Keep the bindable prop and the shared open state in sync in both directions.
	$effect.pre(() => void (ctx.open = open));
	$effect.pre(() => void (open = ctx.open));

	// Track whether the screen is narrow enough for the drawer.
	$effect(() => {
		const query = window.matchMedia(MOBILE_QUERY);
		const update = () => (ctx.isMobile = query.matches);
		update();
		query.addEventListener("change", update);
		return () => query.removeEventListener("change", update);
	});

	// Toggle the sidebar with Cmd or Ctrl and the shortcut key.
	$effect(() => {
		// If the shortcut is turned off: listen for nothing.
		if (!shortcut) return;
		const key = shortcut.toLowerCase();
		const handleKeydown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === key) {
				e.preventDefault();
				ctx.toggle();
			}
		};
		window.addEventListener("keydown", handleKeydown);
		return () => window.removeEventListener("keydown", handleKeydown);
	});
</script>

<!-- Page wrapper that lays out the sidebar beside the main content and sets the sidebar widths. -->
<div class={["sidebarWrapper not-typeset", className]} data-state={ctx.state} style:--sidebar-panel-width={width} style:--sidebar-panel-icon-width={iconWidth} style:--sidebar-panel-mobile-width={mobileWidth} {...props}>
	{@render children()}
</div>

<style>
	/* Base wrapper; fills at least the viewport height */
	.sidebarWrapper {
		display: flex;
		width: 100%;
		min-height: 100svh;
	}

	/* An inset sidebar frames the main content on the sidebar color */
	.sidebarWrapper:has(> :global(.sidebar[data-variant="inset"])) {
		background-color: var(--sidebar);
	}

	@media (min-width: 48rem) {
		/* The frame has no space on the sidebar's edge, since the sidebar sits there */
		.sidebarWrapper:has(> :global(.sidebar[data-variant="inset"])) {
			padding: var(--spacing-sm);
		}

		.sidebarWrapper:has(> :global(.sidebar[data-variant="inset"][data-side="left"])) {
			padding-left: 0;
		}

		.sidebarWrapper:has(> :global(.sidebar[data-variant="inset"][data-side="right"])) {
			padding-right: 0;
		}

		/* With the sidebar slid away, the frame needs space on that edge too */
		.sidebarWrapper:has(> :global(.sidebar[data-variant="inset"][data-side="left"][data-collapsible="offcanvas"])) {
			padding-left: var(--spacing-sm);
		}

		.sidebarWrapper:has(> :global(.sidebar[data-variant="inset"][data-side="right"][data-collapsible="offcanvas"])) {
			padding-right: var(--spacing-sm);
		}
	}
</style>
