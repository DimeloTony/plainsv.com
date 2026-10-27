<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	import type { Attachment } from "svelte/attachments";
	import type { ImageProps } from "./index.js";
	const { src, alt = "", onload, onerror, class: className, ...props }: ImageProps = $props();
	const ctx = useCompCtx();

	/** Reads the load state on mount, so images that finished before hydration are caught. */
	const syncStatus: Attachment<HTMLImageElement> = (node) => {
		// If the image is still loading: wait for its load or error event.
		if (!node.complete) ctx.status = "loading";
		// A complete image without a width failed to load or has no source.
		else ctx.status = node.naturalWidth > 0 ? "loaded" : "error";

		// Show the fallback again when the image is removed or remounted for a new source.
		return () => (ctx.status = "loading");
	};

	/** Marks the image as loaded and forwards the event. */
	const handleLoad = (e: Event) => {
		ctx.status = "loaded";
		onload?.(e);
	};

	/** Marks the image as failed so the fallback stays, and forwards the event. */
	const handleError = (e: Event) => {
		ctx.status = "error";
		onerror?.(e);
	};
</script>

<!-- Remount on a new source so the fallback shows while it loads. -->
{#key src}
	<img class={["avatarImage", className]} {src} {alt} data-status={ctx.status} {@attach syncStatus} onload={handleLoad} onerror={handleError} {...props} />
{/key}

<style>
	/* Base image; covers the frame above the fallback */
	.avatarImage {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* Hidden rather than removed so lazy images still load */
	.avatarImage:not([data-status="loaded"]) {
		visibility: hidden;
	}
</style>
