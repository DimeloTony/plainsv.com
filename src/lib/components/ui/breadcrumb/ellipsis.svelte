<script lang="ts">
	import type { EllipsisProps } from "./index.js";
	import { EllipsisIcon } from "@lucide/svelte";
	const { class: className, ...props }: EllipsisProps = $props();
</script>

<!-- Stands in for collapsed items; give the button that wraps it an aria-label. -->
<span class={["breadcrumbEllipsis", className]} role="presentation" aria-hidden="true" {...props}>
	<EllipsisIcon />
</span>

<style>
	/* Base ellipsis */
	.breadcrumbEllipsis {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.breadcrumbEllipsis :global(svg) {
		flex-shrink: 0;
		width: var(--breadcrumb-icon);
		height: var(--breadcrumb-icon);
	}
</style>
