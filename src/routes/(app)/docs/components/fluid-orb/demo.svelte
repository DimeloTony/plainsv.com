<script lang="ts">
	import { FluidOrb, type FluidOrbProps } from "#lib/components/ui/fluid-orb/index.js";

	const { section = "preview" }: Props = $props();
	const variants: FluidOrbProps["variant"][] = ["default", "destructive"];
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	const speeds = [0.5, 1, 3];

	/** Live preview for one section of the fluid orb docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "variants" | "sizes" | "colors" | "speed";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Blue orb used at the top of the page. -->
		<FluidOrb size="lg" style="color: oklch(0.55 0.2 255)" />
	{:else if section === "variants"}
		<!-- One orb per variant. -->
		{#each variants as variant (variant)}
			<FluidOrb {variant} />
		{/each}
	{:else if section === "sizes"}
		<!-- One orb per size. -->
		{#each sizes as size (size)}
			<FluidOrb {size} />
		{/each}
	{:else if section === "colors"}
		<!-- Custom base and highlight colors. -->
		<FluidOrb style="color: oklch(0.6 0.2 300)" />
		<FluidOrb style="color: oklch(0.65 0.17 160); --fluid-orb-highlight: oklch(0.97 0.05 100)" />
	{:else if section === "speed"}
		<!-- One orb per speed. -->
		{#each speeds as speed (speed)}
			<FluidOrb size="sm" {speed} />
		{/each}
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--spacing-lg);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 1rem 0;
	}
</style>
