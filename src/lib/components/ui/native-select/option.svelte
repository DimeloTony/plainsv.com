<script lang="ts">
	import type { OptionProps } from "./index.js";
	const { children, class: className, ...props }: OptionProps = $props();
</script>

<!-- One choice in the select. -->
<option class={className} {...props}>{@render children()}</option>
