<script lang="ts">
	import { ImageViewer } from "#lib/components/ui/image-viewer/index.js";
	import { Button } from "#lib/components/ui/button/index.js";

	const { section = "preview" }: Props = $props();
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	const roundedValues: UiRounded[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"];
	const initialImages = [
		{ id: "mountains", title: "Mountains", src: "https://picsum.photos/id/1018/1600/1000" },
		{ id: "forest", title: "Forest", src: "https://picsum.photos/id/1043/1600/1000" },
		{ id: "coast", title: "Coast", src: "https://picsum.photos/id/1015/1600/1000" },
	];
	let images = $state(initialImages.map((image) => ({ ...image })));
	let isControlledOpen = $state(false);

	/** Renames an image in the gallery. */
	const renameImage = ({ id, newTitle }: { id: string; newTitle: string }) => {
		const image = images.find((image) => image.id === id);
		if (image) image.title = newTitle;
	};

	/** Removes an image from the gallery. */
	const removeImage = (id: string) => {
		images = images.filter((image) => image.id !== id);
	};

	/** Puts the removed images back. */
	const resetImages = () => {
		images = initialImages.map((image) => ({ ...image }));
	};

	/** Live preview for one section of the image viewer docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "gallery" | "sizes" | "rounded" | "states";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Preview only: no header without onTitleChange or onRemove. -->
		<ImageViewer id="preview" title="Mountains" src="https://picsum.photos/id/1018/1600/1000">
			{#snippet trigger({ props })}
				<Button variant="outline" {...props}>Open image</Button>
			{/snippet}
		</ImageViewer>
	{:else if section === "gallery"}
		<!-- Thumbnails that open an editable, removable viewer. -->
		{#each images as image (image.id)}
			<ImageViewer id={image.id} title={image.title} src={image.src} onTitleChange={renameImage} onRemove={removeImage}>
				{#snippet trigger({ props })}
					<button class="demoThumb" type="button" aria-label="Open {image.title}" {...props}>
						<img src={image.src} alt="" />
						<span>{image.title}</span>
					</button>
				{/snippet}
			</ImageViewer>
		{:else}
			<Button variant="outline" onclick={resetImages}>Reset images</Button>
		{/each}
	{:else if section === "sizes"}
		<!-- Header and action button sizes. -->
		{#each sizes as size (size)}
			<ImageViewer id="size-{size}" title="Size {size}" src="https://picsum.photos/id/1043/1600/1000" {size} onTitleChange={() => {}} onRemove={() => {}}>
				{#snippet trigger({ props })}
					<Button variant="outline" {size} {...props}>Size {size}</Button>
				{/snippet}
			</ImageViewer>
		{/each}
	{:else if section === "rounded"}
		<!-- Each rounded value overriding the size radius. -->
		{#each roundedValues as rounded (rounded)}
			<ImageViewer id="rounded-{rounded}" title="Rounded {rounded}" src="https://picsum.photos/id/1015/1600/1000" {rounded} onRemove={() => {}}>
				{#snippet trigger({ props })}
					<Button variant="outline" {rounded} {...props}>Rounded {rounded}</Button>
				{/snippet}
			</ImageViewer>
		{/each}
	{:else if section === "states"}
		<!-- Bound open state and disabled trigger. -->
		<ImageViewer id="controlled" title="Opened from outside" src="https://picsum.photos/id/1018/1600/1000" bind:open={isControlledOpen}>
			{#snippet trigger({ props })}
				<Button variant="outline" {...props}>Trigger</Button>
			{/snippet}
		</ImageViewer>
		<Button variant="secondary" onclick={() => (isControlledOpen = true)}>Open with bind:open</Button>
		<ImageViewer id="disabled" title="Disabled" src="https://picsum.photos/id/1043/1600/1000" disabled>
			{#snippet trigger({ props })}
				<Button variant="outline" {...props}>Disabled</Button>
			{/snippet}
		</ImageViewer>
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--spacing-sm);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 1rem 0;
	}

	.demoThumb {
		display: grid;
		gap: var(--spacing-xs);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		padding: var(--spacing-xs);
		width: 10rem;
		color: var(--foreground);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	.demoThumb:hover {
		background-color: var(--accent);
	}

	.demoThumb:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
		border-color: var(--ring);
	}

	.demoThumb img {
		border-radius: var(--radius-sm);
		aspect-ratio: 16 / 10;
		width: 100%;
		object-fit: cover;
	}
</style>
