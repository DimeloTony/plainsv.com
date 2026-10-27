<script lang="ts">
	import { Dialog, DialogContent } from "#lib/components/ui/dialog/index.js";
	import Command from "./_.svelte";
	import type { DialogProps } from "./index.js";
	let { open = $bindable(false), title = "Command menu", children, class: className, ...props }: DialogProps = $props();
</script>

<!-- Command menu in a modal dialog; opening it focuses the input. -->
<Dialog bind:open variant="ghost" aria-label={title}>
	<DialogContent>
		<Command class={["commandDialogCommand", className]} {...props}>
			{@render children()}
		</Command>
	</DialogContent>
</Dialog>

<style>
	/* Fixed width up to the viewport */
	:global(.commandDialogCommand) {
		width: 32rem; /* 512px */
		max-width: 100%;
	}
</style>
