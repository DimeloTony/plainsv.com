<script lang="ts">
	import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "#lib/components/ui/select/index.js";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { Attachment } from "svelte/attachments";
	import type { SelectProps } from "./index.js";
	let { element = $bindable(), options, selected = $bindable(Object.keys(options)[0] ?? ""), open = $bindable(false), name, required, disabled = false, onSelectedChange, onOpenChange, variant, size, rounded, placeholder = "Select an option", class: className, ...props }: SelectProps = $props();
	const ctx = useCompCtx();
	const entries = $derived(Object.entries(options));

	/** Shares the trigger element through `bind:element`. */
	const bindElement: Attachment<HTMLButtonElement> = (node) => {
		element = node;
		return () => (element = undefined);
	};
</script>

<!-- Option picker, such as the AI model; blocked while the prompt is sending. -->
<Select bind:value={selected} bind:open {name} {required} onValueChange={onSelectedChange} {onOpenChange} {variant} size={size ?? ctx.controlSize} rounded={rounded ?? ctx.controlRounded} disabled={disabled || ctx.sending}>
	<SelectTrigger class={["promptInputSelect", className]} {...props} {@attach bindElement}>
		<SelectValue {placeholder} label={options[selected]} />
	</SelectTrigger>
	<SelectContent>
		{#each entries as [optionValue, label] (optionValue)}
			<SelectItem value={optionValue} {label}>{label}</SelectItem>
		{/each}
	</SelectContent>
</Select>

<style>
	/* Muted until hovered, like the other prompt controls */
	/* Scoped under the prompt box so it outranks the select's own text color */
	:global(.promptInput .selectTrigger.promptInputSelect) {
		color: var(--muted-foreground);
	}
</style>
