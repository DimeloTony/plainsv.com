<script lang="ts">
	import type { TitleProps } from "./index.js";
	const { children, class: className, ...props }: TitleProps = $props();
</script>

<!-- Card heading text. -->
<div class={["cardTitle", className]} {...props}>
	{@render children()}
</div>

<style>
	/* Base title */
	.cardTitle {
		font-weight: 600;
		line-height: 1;
	}
</style>
