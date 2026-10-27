<script lang="ts">
	import { Button } from "#lib/components/ui/button/index.js";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { CancelProps } from "./index.js";
	const { children, variant = "outline", size, onclick, ...props }: CancelProps = $props();
	const ctx = useCompCtx();
	// Buttons stay at `md` in the large panel, and follow the panel size below it.
	const buttonSize = $derived(size ?? (ctx.size === "lg" ? "md" : ctx.size));

	/** Runs the passed handler, then closes the alert dialog. */
	const handleClick = (e: MouseEvent) => {
		onclick?.(e);
		ctx.setOpen(false);
	};
</script>

<!-- Dismisses the alert dialog; focused when it opens. -->
<Button type="button" {variant} size={buttonSize} data-alert-dialog-cancel {...props} onclick={handleClick}>
	{@render children()}
</Button>
