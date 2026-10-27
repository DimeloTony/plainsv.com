<script lang="ts">
	import { AspectRatio } from "#lib/components/ui/aspect-ratio/index.js";

	const { section = "preview" }: Props = $props();
	const ratios = [
		{ label: "16 / 9", value: 16 / 9 },
		{ label: "4 / 3", value: 4 / 3 },
		{ label: "1 / 1", value: 1 },
	];

	/** Live preview for one section of the aspect ratio docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "ratios" | "rounded";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- 16:9 image with rounded corners, used at the top of the page. -->
		<div class="demoFrame">
			<AspectRatio ratio={16 / 9} rounded="lg">
				<img src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80" alt="A city street at night" />
			</AspectRatio>
		</div>
	{:else if section === "ratios"}
		<!-- The same box at three ratios. -->
		<div class="demoRow">
			{#each ratios as ratio (ratio.label)}
				<div class="demoTile">
					<AspectRatio ratio={ratio.value} rounded="md">
						<div class="demoFill">{ratio.label}</div>
					</AspectRatio>
				</div>
			{/each}
		</div>
	{:else if section === "rounded"}
		<!-- Square tiles with each rounded value. -->
		<div class="demoRow">
			{#each ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"] as const as rounded (rounded)}
				<div class="demoTile">
					<AspectRatio ratio={1} {rounded}>
						<div class="demoFill">{rounded}</div>
					</AspectRatio>
				</div>
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

	.demoFrame {
		width: 100%;
		max-width: 28rem;
	}

	.demoRow {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: var(--spacing-md);
		width: 100%;
	}

	.demoTile {
		flex: 1 1 8rem;
		max-width: 12rem;
	}

	.demoFill {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: var(--muted);
		width: 100%;
		height: 100%;
		color: var(--muted-foreground);
		font-size: var(--text-sm);
	}
</style>
