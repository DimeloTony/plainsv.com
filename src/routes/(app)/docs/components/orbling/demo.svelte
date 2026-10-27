<script lang="ts">
	import { Button } from "#lib/components/ui/button/index.js";
	import { Orbling, OrblingStatus, MOOD_NAMES, type Mood, type OrblingProps } from "#lib/components/ui/orbling/index.js";

	const { section = "preview" }: Props = $props();
	const variants: OrblingProps["variant"][] = ["default", "secondary", "destructive"];
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	const statusMoods: Mood[] = ["thinking", "reading", "typing", "working", "asking"];
	let mood = $state<Mood>("thinking");

	/** Live preview for one section of the orbling docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "moods" | "variants" | "sizes" | "colors" | "status";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Large orb with a button per mood. -->
		<div class="stage">
			<Orbling {mood} size="lg" label={`Assistant is ${mood}`} />
		</div>
		<div class="moods">
			{#each MOOD_NAMES as name (name)}
				<Button size="sm" variant={name === mood ? "default" : "outline"} aria-pressed={name === mood} onclick={() => (mood = name)}>{name}</Button>
			{/each}
		</div>
	{:else if section === "moods"}
		<!-- One orb per mood. -->
		{#each MOOD_NAMES as name (name)}
			<figure class="mood">
				<Orbling mood={name} size="sm" />
				<figcaption>{name}</figcaption>
			</figure>
		{/each}
	{:else if section === "variants"}
		<!-- One orb per variant. -->
		{#each variants as variant (variant)}
			<Orbling {variant} />
		{/each}
	{:else if section === "sizes"}
		<!-- One orb per size. -->
		{#each sizes as size (size)}
			<Orbling {size} />
		{/each}
	{:else if section === "colors"}
		<!-- Custom base colors from other theme tokens. -->
		<Orbling style="--orbling-color: var(--chart-3)" />
		<Orbling style="--orbling-color: var(--chart-5)" />
	{:else if section === "status"}
		<!-- Status lines for the working moods. -->
		<div class="statuses">
			{#each statusMoods as name (name)}
				<OrblingStatus mood={name} />
			{/each}
		</div>
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--spacing-xl);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 1rem 0;
	}

	.stage {
		display: flex;
		justify-content: center;
		padding: var(--spacing-xl) 0;
		width: 100%;
	}

	.moods {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--spacing-sm);
		width: 100%;
	}

	.mood {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-sm);
		margin: 0;
		color: var(--muted-foreground);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	.statuses {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}
</style>
