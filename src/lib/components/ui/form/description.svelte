<script lang="ts">
	import { FieldDescription, type FieldDescriptionProps } from "#lib/components/ui/field/index.js";
	import { useFieldCtx } from "./ctx.svelte.js";
	import type { Attachment } from "svelte/attachments";
	const props: FieldDescriptionProps = $props();
	const ctx = useFieldCtx();

	/** Marks the description as mounted so the control is described by it. */
	const registerDescription: Attachment = () => {
		ctx.hasDescription = true;
		return () => (ctx.hasDescription = false);
	};
</script>

<!-- Helper text that describes the field's control. -->
<FieldDescription id={ctx.descriptionId} {@attach registerDescription} {...props} />
