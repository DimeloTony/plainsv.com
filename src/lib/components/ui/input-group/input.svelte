<script lang="ts">
	import type { InputProps } from "./index.js";
	let { value = $bindable(), class: className, ...props }: InputProps = $props();
</script>

<!-- Borderless input; the group draws the border and the focus ring. -->
<input class={["inputGroupInput", className]} data-input-group-control bind:value {...props} />

<style>
	/* Base input; fills the room between the addons */
	.inputGroupInput {
		flex: 1;
		align-self: stretch;
		box-sizing: border-box;
		outline: none;
		border: 0;
		border-radius: inherit;
		background-color: transparent;
		padding: 0 var(--input-group-padding);
		min-width: 0;
		color: inherit;
		font: inherit;
	}

	.inputGroupInput::placeholder {
		color: var(--muted-foreground);
	}

	.inputGroupInput:disabled {
		cursor: not-allowed;
	}
</style>
