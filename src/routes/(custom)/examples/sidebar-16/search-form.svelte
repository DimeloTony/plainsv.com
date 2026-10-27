<script lang="ts">
	import { SidebarInput } from "#lib/components/ui/sidebar/index.js";
	import { Label } from "#lib/components/ui/label/index.js";
	import { SearchIcon } from "@lucide/svelte";
	const { class: className, ...props }: CompProps<"form"> = $props();
</script>

<!-- Search field with a leading icon. -->
<form class={["searchForm", className]} {...props}>
	<div class="searchField">
		<Label for="search" class="srOnly">Search</Label>
		<SidebarInput id="search" placeholder="Type to search..." class="searchInput" />
		<SearchIcon class="searchIcon" />
	</div>
</form>

<style>
	.searchField {
		position: relative;
	}

	/* Label kept for screen readers only */
	.searchForm :global(.srOnly) {
		position: absolute;
		clip-path: inset(50%);
		margin: -1px;
		padding: 0;
		width: 1px;
		height: 1px;
		overflow: hidden;
		white-space: nowrap;
	}

	/* Room on the start edge for the icon */
	.searchForm :global(.input.searchInput) {
		padding-left: 1.75rem; /* 28px */
	}

	/* Muted icon over the start of the input */
	.searchForm :global(.searchIcon) {
		position: absolute;
		top: 50%;
		left: var(--spacing-sm);
		transform: translateY(-50%);
		width: 1rem; /* 16px */
		height: 1rem; /* 16px */
		pointer-events: none;
		color: color-mix(in oklab, var(--foreground) 50%, transparent);
		user-select: none;
	}
</style>
