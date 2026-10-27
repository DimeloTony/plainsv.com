<script lang="ts">
	import { FieldError, type FieldErrorProps } from "#lib/components/ui/field/index.js";
	import { useFieldCtx } from "./ctx.svelte.js";
	const props: Omit<FieldErrorProps, "errors"> = $props();
	const ctx = useFieldCtx();
</script>

<!-- The field's errors, once the user has left it or tried to submit. -->
<FieldError id={ctx.errorId} errors={ctx.errors} {...props} />
