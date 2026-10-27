<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	import type { RailProps } from "./index.js";
	const { onclick, class: className, ...props }: RailProps = $props();
	const ctx = useCompCtx();

	/** Toggles the sidebar, unless a passed click handler prevented the default. */
	const handleClick = (e: MouseEvent) => {
		onclick?.(e);
		// If the passed handler called preventDefault: leave the sidebar as it is.
		if (e.defaultPrevented) return;
		ctx.toggle();
	};
</script>

<!-- Strip on the sidebar edge; mouse only, since the trigger and the shortcut cover the keyboard. -->
<button type="button" class={["sidebarRail", className]} aria-label="Toggle sidebar" tabindex="-1" title="Toggle sidebar" data-side={ctx.side} data-state={ctx.state} onclick={handleClick} {...props}></button>

<style>
	/* Base rail; straddles the sidebar edge */
	.sidebarRail {
		display: none;
		position: absolute;
		z-index: 20;
		transition: background-color 150ms linear;
		inset-block: 0;
		border: 0;
		background-color: transparent;
		padding: 0;
		width: 1rem; /* 16px hit area */
	}

	@media (min-width: 40rem) {
		.sidebarRail {
			display: flex;
		}
	}

	/* Hairline that shows on hover */
	.sidebarRail::after {
		position: absolute;
		inset-block: 0;
		left: 50%;
		transition: background-color 150ms linear;
		width: 2px;
		content: "";
	}

	.sidebarRail:hover::after {
		background-color: var(--sidebar-border);
	}

	.sidebarRail[data-side="left"] {
		right: -0.5rem;
		cursor: w-resize;
	}

	.sidebarRail[data-side="right"] {
		left: -0.5rem;
		cursor: e-resize;
	}

	/* The cursor points the way the sidebar will move */
	.sidebarRail[data-side="left"][data-state="collapsed"] {
		cursor: e-resize;
	}

	.sidebarRail[data-side="right"][data-state="collapsed"] {
		cursor: w-resize;
	}
</style>
