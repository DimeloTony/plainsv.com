<script lang="ts">
	import { ArrowLeftIcon } from "@lucide/svelte";
	import { Button } from "#lib/components/ui/button/index.js";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { StepProps } from "./index.js";
	const { variant = "outline", size, rounded = "pill", onclick, ...props }: StepProps = $props();
	const ctx = useCompCtx();
	const buttonSize = $derived(({ lg: "icon-md", md: "icon-sm", sm: "icon-xs", xs: "icon-xs" } as const)[ctx.size]);

	/** Scrolls back one slide, unless a passed click handler prevented the default. */
	const handleClick = (e: MouseEvent) => {
		onclick?.(e);
		// If the passed handler called preventDefault: stay on the current slide.
		if (e.defaultPrevented) return;
		ctx.scrollPrev();
	};
</script>

<!-- Button outside the start edge; disabled at the first slide unless the carousel loops. -->
<span class="carouselControl" data-orientation={ctx.orientation}>
	<Button {variant} {rounded} size={size ?? buttonSize} aria-label="Previous slide" disabled={!ctx.canScrollPrev && !(ctx.loop && ctx.slideCount > 1)} {...props} onclick={handleClick}>
		<ArrowLeftIcon />
	</Button>
</span>

<style>
	/* Placed outside the carousel, centered on the start edge */
	.carouselControl {
		display: flex;
		position: absolute;
	}

	.carouselControl[data-orientation="horizontal"] {
		top: 50%;
		left: calc(-1 * (var(--carousel-button) + var(--spacing-md)));
		transform: translateY(-50%);
	}

	.carouselControl[data-orientation="vertical"] {
		top: calc(-1 * (var(--carousel-button) + var(--spacing-md)));
		left: 50%;
		transform: translateX(-50%) rotate(90deg);
	}
</style>
