<script lang="ts">
	import type { PageProps } from "./index.js";
	const { children, class: className, ...props }: PageProps = $props();
</script>

<!-- Current page; announced as the current location and not clickable. -->
<span class={["breadcrumbPage", className]} role="link" aria-disabled="true" aria-current="page" {...props}>
	{@render children()}
</span>

<style>
	/* Base page; full contrast so it stands out from the links */
	.breadcrumbPage {
		display: inline-flex;
		align-items: center;
		gap: var(--spacing-xs);
		color: var(--foreground);
		font-weight: 400;
	}

	.breadcrumbPage :global(svg) {
		flex-shrink: 0;
		width: var(--breadcrumb-icon);
		height: var(--breadcrumb-icon);
	}
</style>
