<script lang="ts">
	import { setRadioGroupCtx } from "./ctx.svelte.js";
	import type { RadioGroupProps } from "./index.js";
	let { value = $bindable(""), onValueChange, children, class: className, ...props }: RadioGroupProps = $props();
	const ctx = setRadioGroupCtx({ value, onValueChange });

	// Keep the change callback in sync when the prop changes.
	$effect.pre(() => void (ctx.onValueChange = onValueChange));

	// Keep the bindable prop and the shared value in sync in both directions.
	$effect.pre(() => void (ctx.value = value));
	$effect.pre(() => void (value = ctx.value));
</script>

<!-- Group of radio items where one is checked at a time. -->
<div class={["dropdownMenuRadioGroup", className]} role="group" {...props}>
	{@render children()}
</div>
