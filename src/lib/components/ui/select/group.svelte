<script lang="ts">
	import { setGroupCtx } from "./ctx.svelte.js";
	import type { GroupProps } from "./index.js";
	const { children, class: className, ...props }: GroupProps = $props();
	const labelId = $props.id();
	setGroupCtx({ labelId });
</script>

<!-- Group of items named by its SelectLabel. -->
<div class={["selectGroup", className]} role="group" aria-labelledby={labelId} {...props}>
	{@render children()}
</div>
