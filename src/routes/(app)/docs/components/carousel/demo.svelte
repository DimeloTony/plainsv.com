<script lang="ts">
	import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "#lib/components/ui/carousel/index.js";

	const { section = "preview" }: Props = $props();
	const slides = Array.from({ length: 5 }, (_, index) => index + 1);
	let selectedIndex = $state(0);

	/** Live preview for one section of the carousel docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "perView" | "vertical" | "controlled" | "sizes";
	}
</script>

<!-- Numbered square slide reused by the sections. -->
{#snippet slide(number: number)}
	<div class="demoSlide">{number}</div>
{/snippet}

<div class="demo">
	{#if section === "preview"}
		<!-- One slide at a time, with the buttons outside the edges. -->
		<div class="demoFrame">
			<Carousel>
				<CarouselContent>
					{#each slides as number (number)}
						<CarouselItem>{@render slide(number)}</CarouselItem>
					{/each}
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
			</Carousel>
		</div>
	{:else if section === "perView"}
		<!-- Three slides in view, looping at the ends. -->
		<div class="demoFrame demoWide">
			<Carousel perView={3} loop>
				<CarouselContent>
					{#each slides as number (number)}
						<CarouselItem>{@render slide(number)}</CarouselItem>
					{/each}
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
			</Carousel>
		</div>
	{:else if section === "vertical"}
		<!-- Vertical carousel with a fixed height. -->
		<div class="demoFrame demoTall">
			<Carousel orientation="vertical" perView={2} style="height: 100%">
				<CarouselContent>
					{#each slides as number (number)}
						<CarouselItem>{@render slide(number)}</CarouselItem>
					{/each}
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
			</Carousel>
		</div>
	{:else if section === "controlled"}
		<!-- Bound slide index with dots that jump to a slide. -->
		<div class="demoFrame">
			<Carousel bind:selectedIndex>
				<CarouselContent>
					{#each slides as number (number)}
						<CarouselItem>{@render slide(number)}</CarouselItem>
					{/each}
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
			</Carousel>
		</div>
		<div class="demoDots">
			{#each slides as number, index (number)}
				<button type="button" class="demoDot" aria-label="Go to slide {number}" aria-current={selectedIndex === index || undefined} onclick={() => (selectedIndex = index)}></button>
			{/each}
		</div>
		<p class="demoText">Slide {selectedIndex + 1} of {slides.length}</p>
	{:else if section === "sizes"}
		<!-- Small and large gaps and buttons. -->
		{#each ["sm", "lg"] as const as size (size)}
			<div class="demoFrame demoWide">
				<Carousel {size} perView={2}>
					<CarouselContent>
						{#each slides as number (number)}
							<CarouselItem>{@render slide(number)}</CarouselItem>
						{/each}
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
			</div>
		{/each}
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-md);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 3rem 0;
	}

	.demoFrame {
		width: 100%;
		max-width: 12rem;
	}

	.demoWide {
		max-width: 20rem;
	}

	.demoTall {
		max-width: 12rem;
		height: 18rem;
	}

	.demoSlide {
		display: flex;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		aspect-ratio: 1;
		height: 100%;
		font-weight: 600;
		font-size: 2rem;
	}

	/* Vertical slides fill the width, so the buttons line up with them */
	.demoTall .demoSlide {
		aspect-ratio: auto;
		width: 100%;
	}

	.demoDots {
		display: flex;
		gap: var(--spacing-sm);
	}

	.demoDot {
		cursor: pointer;
		border: 0;
		border-radius: var(--radius-pill);
		background-color: var(--border);
		padding: 0;
		width: 0.5rem;
		height: 0.5rem;
	}

	.demoDot[aria-current] {
		background-color: var(--foreground);
	}

	.demoText {
		margin: 0;
		color: var(--muted-foreground);
		font-size: var(--text-sm);
	}
</style>
