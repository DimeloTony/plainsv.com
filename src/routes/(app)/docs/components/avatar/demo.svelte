<script lang="ts">
	import { Avatar, AvatarImage, AvatarFallback, type AvatarProps } from "#lib/components/ui/avatar/index.js";
	import { UserIcon } from "@lucide/svelte";

	const { section = "preview" }: Props = $props();
	const variants: AvatarProps["variant"][] = ["default", "secondary", "outline"];
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	const roundedValues: UiRounded[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"];

	/** Live preview for one section of the avatar docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "fallback" | "variants" | "sizes" | "rounded";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Default avatar with an image and initials, used at the top of the page. -->
		<Avatar>
			<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
			<AvatarFallback>CN</AvatarFallback>
		</Avatar>
	{:else if section === "fallback"}
		<!-- A broken image, no image, and an icon fallback. -->
		<Avatar>
			<AvatarImage src="/missing-avatar.png" alt="@missing" />
			<AvatarFallback>CN</AvatarFallback>
		</Avatar>
		<Avatar>
			<AvatarFallback>AT</AvatarFallback>
		</Avatar>
		<Avatar>
			<AvatarFallback><UserIcon /></AvatarFallback>
		</Avatar>
	{:else if section === "variants"}
		<!-- One fallback per visual style, plus an outlined image. -->
		{#each variants as variant (variant)}
			<Avatar {variant}>
				<AvatarFallback>CN</AvatarFallback>
			</Avatar>
		{/each}
		<Avatar variant="outline">
			<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
			<AvatarFallback>CN</AvatarFallback>
		</Avatar>
	{:else if section === "sizes"}
		<!-- One avatar per size; the radius follows the size. -->
		{#each sizes as size (size)}
			<Avatar {size}>
				<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
				<AvatarFallback>CN</AvatarFallback>
			</Avatar>
		{/each}
	{:else if section === "rounded"}
		<!-- Each rounded value overriding the size radius. -->
		{#each roundedValues as rounded (rounded)}
			<Avatar size="lg" {rounded}>
				<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
				<AvatarFallback>CN</AvatarFallback>
			</Avatar>
		{/each}
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--spacing-md);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 1rem 0;
	}
</style>
