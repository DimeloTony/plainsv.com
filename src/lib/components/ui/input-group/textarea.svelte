<script lang="ts">
	import type { TextareaProps } from "./index.js";
	let { value = $bindable(), class: className, ...props }: TextareaProps = $props();
</script>

<!-- Borderless textarea that grows with its content; the group draws the border and the focus ring. -->
<textarea class={["inputGroupTextarea", className]} data-input-group-control bind:value {...props}></textarea>

<style>
	/* Base textarea */
	.inputGroupTextarea {
		flex: 1;
		box-sizing: border-box;
		outline: none;
		border: 0;
		border-radius: inherit;
		background-color: transparent;
		padding: var(--input-group-padding);
		min-width: 0;
		min-height: 4rem; /* 64px */
		field-sizing: content;
		resize: none;
		color: inherit;
		font: inherit;
	}

	.inputGroupTextarea::placeholder {
		color: var(--muted-foreground);
	}

	.inputGroupTextarea:disabled {
		cursor: not-allowed;
	}
</style>
