<script lang="ts" generics="S extends z.ZodType">
	import type { z } from "zod";
	import { Field } from "#lib/components/ui/field/index.js";
	import { setFieldCtx } from "./ctx.svelte.js";
	import type { FieldItemProps } from "./index.js";
	const { form, name, children, ...props }: FieldItemProps<S> = $props();
	const baseId = $props.id();
	// Getters keep the context reading the current form and name after setup.
	const ctx = setFieldCtx({ name, baseId, getErrors: () => form.errorsFor(name), touch: () => form.touch(name) });

	// Keep the name current when the prop changes.
	$effect.pre(() => void (ctx.name = name));
</script>

<!-- Field that turns invalid while its value has shown errors. -->
<Field invalid={ctx.errors.length > 0} {...props}>
	{@render children()}
</Field>
