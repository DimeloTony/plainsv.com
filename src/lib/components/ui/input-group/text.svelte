<script lang="ts">
	import type { TextProps } from "./index.js";
	const { children, class: className, ...props }: TextProps = $props();
</script>

<!-- Muted text or icons in an addon, such as a unit or a prefix. -->
<span class={["inputGroupText", className]} {...props}>
	{@render children()}
</span>

<style>
	/* Base text */
	.inputGroupText {
		display: flex;
		align-items: center;
		gap: var(--input-group-gap);
		color: var(--muted-foreground);
		white-space: nowrap;
	}

	.inputGroupText :global(svg) {
		flex-shrink: 0;
		width: 1rem; /* 16px */
		height: 1rem; /* 16px */
	}
</style>
