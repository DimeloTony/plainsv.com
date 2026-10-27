<script lang="ts">
	import { Button } from "#lib/components/ui/button/index.js";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { ActionProps } from "./index.js";
	const { children, size, onclick, ...props }: ActionProps = $props();
	const ctx = useCompCtx();
	// Buttons stay at `md` in the large panel, and follow the panel size below it.
	const buttonSize = $derived(size ?? (ctx.size === "lg" ? "md" : ctx.size));

	/** Runs the passed handler, then closes the alert dialog unless the handler prevented the default. */
	const handleClick = (e: MouseEvent) => {
		onclick?.(e);
		// If the passed handler called preventDefault: keep the dialog open, such as while a request runs.
		if (e.defaultPrevented) return;
		ctx.setOpen(false);
	};
</script>

<!-- Confirms the action and closes the alert dialog. -->
<Button type="button" size={buttonSize} {...props} onclick={handleClick}>
	{@render children()}
</Button>
