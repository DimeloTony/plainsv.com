<script lang="ts">
	import type { ChoiceDescriptionProps } from "./index.js";
	const { children, class: className, ...props }: ChoiceDescriptionProps = $props();
</script>

<!-- Muted second line of a choice. -->
<span class={["questionnaireChoiceDescription", className]} {...props}>
	{@render children()}
</span>

<style>
	/* Muted text under the choice label */
	.questionnaireChoiceDescription {
		color: var(--muted-foreground);
	}
</style>
