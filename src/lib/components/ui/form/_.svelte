<script lang="ts" generics="S extends z.ZodType">
	import type { z } from "zod";
	import type { Props } from "./index.js";
	const { form, children, class: className, ...props }: Props<S> = $props();
</script>

<!-- Form element; the schema replaces the browser's own validation messages. -->
<form class={["form not-typeset", className]} novalidate onsubmit={form.submit} aria-busy={form.submitting || undefined} {...props}>
	{@render children()}
</form>
