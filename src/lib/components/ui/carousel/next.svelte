<script lang="ts">
	import { ArrowRightIcon } from "@lucide/svelte";
	import { Button } from "#lib/components/ui/button/index.js";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { StepProps } from "./index.js";
	const { variant = "outline", size, rounded = "pill", onclick, ...props }: StepProps = $props();
	const ctx = useCompCtx();
	const buttonSize = $derived(({ lg: "icon-md", md: "icon-sm", sm: "icon-xs", xs: "icon-xs" } as const)[ctx.size]);

	/** Scrolls forward one slide, unless a passed click handler prevented the default. */
	const handleClick = (e: MouseEvent) => {
		onclick?.(e);
		// If the passed handler called preventDefault: stay on the current slide.
		if (e.defaultPrevented) return;
		ctx.scrollNext();
	};
</script>

<!-- Button outside the end edge; disabled at the last slide unless the carousel loops. -->
<span class="carouselControl" data-orientation={ctx.orientation}>
	<Button {variant} {rounded} size={size ?? buttonSize} aria-label="Next slide" disabled={!ctx.canScrollNext && !(ctx.loop && ctx.slideCount > 1)} {...props} onclick={handleClick}>
		<ArrowRightIcon />
	</Button>
</span>

<style>
	/* Placed outside the carousel, centered on the end edge */
	.carouselControl {
		display: flex;
		position: absolute;
	}

	.carouselControl[data-orientation="horizontal"] {
		top: 50%;
		right: calc(-1 * (var(--carousel-button) + var(--spacing-md)));
		transform: translateY(-50%);
	}

	.carouselControl[data-orientation="vertical"] {
		bottom: calc(-1 * (var(--carousel-button) + var(--spacing-md)));
		left: 50%;
		transform: translateX(-50%) rotate(90deg);
	}
</style>
