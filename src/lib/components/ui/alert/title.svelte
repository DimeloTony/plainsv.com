<script lang="ts">
	import type { TitleProps } from "./index.js";
	const { children, class: className, ...props }: TitleProps = $props();
</script>

<!-- Alert heading text. -->
<div class={["alertTitle", className]} {...props}>
	{@render children()}
</div>

<style>
	/* Base title; clamps to one line */
	.alertTitle {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		min-height: 1rem; /* 16px */
		-webkit-line-clamp: 1;
		line-clamp: 1;
		overflow: hidden;
		font-weight: 500;
		letter-spacing: -0.025em;
	}
</style>
