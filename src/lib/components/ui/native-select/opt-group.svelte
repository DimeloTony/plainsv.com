<script lang="ts">
	import type { OptGroupProps } from "./index.js";
	const { children, class: className, ...props }: OptGroupProps = $props();
</script>

<!-- Labeled group of options; set `label` for its heading. -->
<optgroup class={className} {...props}>
	{@render children()}
</optgroup>
