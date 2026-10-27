<script lang="ts">
	import type { ShortcutProps } from "./index.js";
	const { children, class: className, ...props }: ShortcutProps = $props();
</script>

<!-- Keyboard shortcut hint at the end of an item. -->
<span class={["commandShortcut", className]} {...props}>
	{@render children()}
</span>

<style>
	/* Base shortcut; the auto margin pushes it to the end of the item instead of adding space */
	.commandShortcut {
		margin-left: auto;
		color: var(--muted-foreground);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
		letter-spacing: 0.1em;
	}
</style>
