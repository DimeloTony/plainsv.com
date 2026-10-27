<script lang="ts">
	import type { ErrorProps } from "./index.js";
	const { errors, children, class: className, ...props }: ErrorProps = $props();
	// Repeated messages, such as from several checks on one value, are shown once.
	const messages = $derived([...new Set((errors ?? []).map((error) => error?.message).filter((message) => !!message))]);
</script>

<!-- Announced as soon as it appears; one message is plain text, several are a list. -->
{#if children || messages.length}
	<div class={["fieldError", className]} role="alert" {...props}>
		{#if children}
			{@render children()}
		{:else if messages.length === 1}
			{messages[0]}
		{:else}
			<ul class="fieldErrorList">
				{#each messages as message (message)}
					<li>{message}</li>
				{/each}
			</ul>
		{/if}
	</div>
{/if}

<style>
	/* Base error */
	.fieldError {
		color: var(--destructive);
		font-weight: 400;
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	.fieldErrorList {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
		margin: 0;
		padding-left: var(--spacing-lg);
	}
</style>
