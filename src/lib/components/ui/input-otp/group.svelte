<script lang="ts">
	import type { GroupProps } from "./index.js";
	const { children, class: className, ...props }: GroupProps = $props();
</script>

<!-- Row of slots joined by shared borders; the outer slots round the corners. -->
<div class={["inputOtpGroup", className]} {...props}>
	{@render children()}
</div>

<style>
	/* Base group */
	.inputOtpGroup {
		display: flex;
		align-items: center;
	}
</style>
