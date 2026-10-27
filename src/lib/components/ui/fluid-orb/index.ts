export { default as FluidOrb } from "./_.svelte";

/** Animated WebGL orb with a fluid surface; decorative unless it gets a `role` and `aria-label` */
export interface Props extends CompProps<"div"> {
	/** Base color of the orb; `default` follows the CSS `color` of the orb or its parent */
	variant?: "default" | "destructive";
	/** Orb width and height on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Animation speed multiplier; `1` is the default pace and `0` holds still */
	speed?: number;
	/** Classes merged onto the orb */
	class?: CompProps<"div">["class"];
}

export type FluidOrbProps = Props;
