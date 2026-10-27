<script lang="ts">
	import type { DescriptionProps } from "./index.js";
	const { children, class: className, ...props }: DescriptionProps = $props();
</script>

<!-- Muted supporting text. -->
<p class={["cardDescription", className]} {...props}>
	{@render children()}
</p>

<style>
	/* Base description; inherits the card's text size */
	.cardDescription {
		margin: 0;
		color: var(--muted-foreground);
	}
</style>
