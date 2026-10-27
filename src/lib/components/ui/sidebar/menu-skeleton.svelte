<script lang="ts">
	import { Skeleton } from "#lib/components/ui/skeleton/index.js";
	import type { MenuSkeletonProps } from "./index.js";
	const { showIcon = false, class: className, ...props }: MenuSkeletonProps = $props();
	// A random width between 50% and 90%, so a list of placeholders looks like real labels.
	const textWidth = `${Math.floor(Math.random() * 40) + 50}%`;
</script>

<!-- Placeholder menu item; mark the loading menu with aria-busy instead. -->
<div class={["sidebarMenuSkeleton", className]} {...props}>
	{#if showIcon}
		<Skeleton style="width: 1rem; height: 1rem; border-radius: var(--radius-md)" />
	{/if}
	<Skeleton style="flex: 1; max-width: {textWidth}; height: 1rem" />
</div>

<style>
	/* Base skeleton; as tall as a menu button */
	.sidebarMenuSkeleton {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		border-radius: var(--radius-md);
		padding-inline: var(--spacing-sm);
		height: var(--control-height-sm);
	}
</style>
