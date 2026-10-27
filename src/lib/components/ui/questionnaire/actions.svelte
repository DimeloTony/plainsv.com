<script lang="ts">
	import type { ActionsProps } from "./index.js";
	const { children, class: className, ...props }: ActionsProps = $props();
</script>

<!-- Row of navigation buttons; each button keeps its own column. -->
<div class={["questionnaireActions", className]} {...props}>
	{@render children()}
</div>

<style>
	/* Grid with fixed columns, so the buttons stay put as others show and hide */
	.questionnaireActions {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto auto;
		align-items: center;
		gap: var(--spacing-sm);
		width: 100%;
	}

	.questionnaireActions > :global([data-questionnaire-action]) {
		grid-row: 1;
	}

	.questionnaireActions > :global([data-questionnaire-action="previous"]) {
		grid-column: 1;
		justify-self: start;
	}

	.questionnaireActions > :global([data-questionnaire-action="skip"]) {
		grid-column: 2;
	}

	.questionnaireActions > :global(:is([data-questionnaire-action="next"], [data-questionnaire-action="submit"])) {
		grid-column: 3;
	}
</style>
