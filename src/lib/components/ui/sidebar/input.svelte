<script lang="ts">
	import { Input } from "#lib/components/ui/input/index.js";
	import type { SidebarInputProps } from "./index.js";
	let { value = $bindable(), ...props }: SidebarInputProps = $props();
</script>

<!-- Compact input, such as a search field, on the page background. -->
<Input size="sm" style="background-color: var(--background); box-shadow: none" bind:value {...props} />
