<script lang="ts">
	import type { Props } from "./index.js";
	const { orientation = "horizontal", decorative = true, class: className, ...props }: Props = $props();
</script>

<!-- A decorative line is hidden from screen readers; a semantic one is announced with its orientation. -->
<div class={["separator not-typeset", className]} role={decorative ? "none" : "separator"} aria-orientation={decorative || orientation === "horizontal" ? undefined : orientation} data-orientation={orientation} {...props}></div>

<style>
	/* Base separator */
	.separator {
		flex-shrink: 0;
		background-color: var(--border);
	}

	/* Full width, one hairline tall */
	.separator[data-orientation="horizontal"] {
		width: 100%;
		height: 1px;
	}

	/* One hairline wide; stretches to the height of a flex row */
	.separator[data-orientation="vertical"] {
		align-self: stretch;
		width: 1px;
	}
</style>
