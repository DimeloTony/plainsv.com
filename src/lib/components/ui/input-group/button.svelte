<script lang="ts">
	import { Button } from "#lib/components/ui/button/index.js";
	import type { InputGroupButtonProps } from "./index.js";
	const props: InputGroupButtonProps = $props();
</script>

<!-- Compact ghost button; never submits a form unless `type="submit"` is set. -->
<Button type="button" variant="ghost" size="xs" {...props} />
