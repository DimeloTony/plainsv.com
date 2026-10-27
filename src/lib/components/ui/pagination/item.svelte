<script lang="ts">
	import type { ItemProps } from "./index.js";
	const { children, class: className, ...props }: ItemProps = $props();
</script>

<!-- One entry in the list. -->
<li class={className} {...props}>
	{@render children()}
</li>
