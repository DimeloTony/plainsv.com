<script lang="ts">
	import { Button } from "#lib/components/ui/button/index.js";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { ActionProps } from "./index.js";
	const { type = "button", variant = "ghost", size, children, ...props }: ActionProps = $props();
	const ctx = useCompCtx();
</script>

<!-- Ghost button, one size below the message unless `size` is set. -->
<Button {type} {variant} size={size ?? ctx.controlSize} {...props}>
	{@render children?.()}
</Button>
