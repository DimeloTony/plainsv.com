<script lang="ts">
	import type { TitleProps } from "./index.js";
	const { children, class: className, ...props }: TitleProps = $props();
</script>

<!-- Question text as the fieldset legend. -->
<legend class={["questionnaireTitle", className]} {...props}>
	{@render children()}
</legend>

<style>
	/* The legend sits outside the fieldset's flex layout, so it spaces itself with padding */
	.questionnaireTitle {
		padding: 0;
		width: 100%;
		font-weight: 500;
		font-size: var(--questionnaire-title-text);
		line-height: 1.375;
		text-wrap: pretty;
	}

	/* Without a description, the gap comes from the title */
	.questionnaireTitle:not(:has(~ :global(.questionnaireDescription))) {
		padding-bottom: var(--questionnaire-gap);
	}
</style>
