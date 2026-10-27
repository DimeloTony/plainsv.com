<script lang="ts">
	import type { DescriptionProps } from "./index.js";
	const { children, class: className, ...props }: DescriptionProps = $props();
</script>

<!-- Muted helper text for the field. -->
<p class={["fieldDescription", className]} {...props}>
	{@render children()}
</p>

<style>
	/* Base description; link it to the control with `aria-describedby` */
	.fieldDescription {
		margin: 0;
		color: var(--muted-foreground);
		font-weight: 400;
		line-height: 1.5;
	}

	.fieldDescription :global(a) {
		color: inherit;
		text-decoration: underline;
		text-underline-offset: 0.25rem; /* 4px */
	}

	.fieldDescription :global(a:hover) {
		color: var(--primary);
	}
</style>
