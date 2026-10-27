<script lang="ts">
	import { FieldLabel, type FieldLabelProps } from "#lib/components/ui/field/index.js";
	import { useFieldCtx } from "./ctx.svelte.js";
	const props: FieldLabelProps = $props();
	const ctx = useFieldCtx();
</script>

<!-- Label pointing at the field's control. -->
<FieldLabel for={ctx.controlId} {...props} />
