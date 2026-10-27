<script lang="ts">
	import { HoverCard, HoverCardTrigger, HoverCardContent } from "#lib/components/ui/hover-card/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { CalendarIcon } from "@lucide/svelte";

	const { section = "preview" }: Props = $props();
	let open = $state(false);

	/** Live preview for one section of the hover card docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "behavior" | "trigger" | "side" | "sizes" | "rounded";
	}
</script>

<!-- Profile preview reused by the sections. -->
{#snippet profile()}
	<div class="demoProfile">
		<span class="demoAvatar">S</span>
		<div class="demoBody">
			<h4 class="demoName">@sveltejs</h4>
			<p>Cybernetically enhanced web apps.</p>
			<p class="demoMeta"><CalendarIcon size={14} />Joined November 2016</p>
		</div>
	</div>
{/snippet}

<div class="demo">
	{#if section === "preview"}
		<!-- Link trigger, used at the top of the page. -->
		<p class="demoText">
			Built with
			<HoverCard>
				<HoverCardTrigger href="https://svelte.dev">@sveltejs</HoverCardTrigger>
				<HoverCardContent>{@render profile()}</HoverCardContent>
			</HoverCard>
			and theme tokens.
		</p>
	{:else if section === "behavior"}
		<!-- Quick to open, slow to close, with the open state shown. -->
		<HoverCard bind:open openDelay={100} closeDelay={1000}>
			<HoverCardTrigger href="https://svelte.dev">@sveltejs</HoverCardTrigger>
			<HoverCardContent>{@render profile()}</HoverCardContent>
		</HoverCard>
		<p class="demoText demoMuted">Open: {open ? "yes" : "no"}</p>
	{:else if section === "trigger"}
		<!-- Custom button trigger with a short delay. -->
		<HoverCard openDelay={200}>
			<HoverCardTrigger>
				{#snippet trigger({ props })}
					<Button variant="link" {...props}>Hover me</Button>
				{/snippet}
			</HoverCardTrigger>
			<HoverCardContent>{@render profile()}</HoverCardContent>
		</HoverCard>
	{:else if section === "side"}
		<!-- One card per side. -->
		<div class="demoRow">
			{#each ["top", "right", "bottom", "left"] as const as side (side)}
				<HoverCard {side} openDelay={100}>
					<HoverCardTrigger>
						{#snippet trigger({ props })}
							<Button variant="outline" {...props}>{side}</Button>
						{/snippet}
					</HoverCardTrigger>
					<HoverCardContent>Opens on the {side}.</HoverCardContent>
				</HoverCard>
			{/each}
		</div>
	{:else if section === "sizes"}
		<!-- Each size of the card. -->
		<div class="demoRow">
			{#each ["xs", "sm", "md", "lg"] as const as size (size)}
				<HoverCard {size} openDelay={100}>
					<HoverCardTrigger>
						{#snippet trigger({ props })}
							<Button variant="outline" {...props}>Size {size}</Button>
						{/snippet}
					</HoverCardTrigger>
					<HoverCardContent>{@render profile()}</HoverCardContent>
				</HoverCard>
			{/each}
		</div>
	{:else if section === "rounded"}
		<!-- Each rounded value overriding the size radius. -->
		<div class="demoRow">
			{#each ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"] as const as rounded (rounded)}
				<HoverCard {rounded} openDelay={100}>
					<HoverCardTrigger>
						{#snippet trigger({ props })}
							<Button variant="outline" {...props}>Rounded {rounded}</Button>
						{/snippet}
					</HoverCardTrigger>
					<HoverCardContent>{@render profile()}</HoverCardContent>
				</HoverCard>
			{/each}
		</div>
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--spacing-sm);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 1rem 0;
	}

	.demoText {
		margin: 0;
		font-size: var(--text-sm);
	}

	.demoMuted {
		color: var(--muted-foreground);
	}

	.demoRow {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-sm);
	}

	.demoProfile {
		display: flex;
		gap: var(--spacing-lg);
	}

	.demoAvatar {
		display: flex;
		flex-shrink: 0;
		justify-content: center;
		align-items: center;
		border-radius: var(--radius-pill);
		background-color: var(--muted);
		width: var(--control-height-lg);
		height: var(--control-height-lg);
		font-weight: 600;
	}

	.demoBody {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
	}

	.demoBody p {
		margin: 0;
	}

	.demoName {
		margin: 0;
		font-weight: 600;
		font-size: var(--text-sm);
	}

	.demoMeta {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		color: var(--muted-foreground);
		font-size: var(--text-xs);
	}
</style>
