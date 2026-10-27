<script lang="ts">
	import { Avatar } from "#lib/components/ui/avatar/index.js";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { AvatarProps } from "./index.js";
	const { size, children, class: className, ...props }: AvatarProps = $props();
	const ctx = useCompCtx();
</script>

<!-- Avatar beside the content, one size below the message unless `size` is set. -->
<Avatar class={["messageAvatar", className]} size={size ?? ctx.controlSize} {...props}>
	{@render children()}
</Avatar>
