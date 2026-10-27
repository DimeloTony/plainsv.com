<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	import type { FallbackProps } from "./index.js";
	const { children, class: className, ...props }: FallbackProps = $props();
	const ctx = useCompCtx();
</script>

<!-- Show the fallback until the image loads, and keep it when the image fails. -->
{#if ctx.status !== "loaded"}
	<span class={["avatarFallback", className]} {...props}>
		{@render children()}
	</span>
{/if}

<style>
	/* Base fallback; centers initials or an icon in the frame */
	.avatarFallback {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
	}
</style>
