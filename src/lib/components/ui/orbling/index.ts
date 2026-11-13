import type { Mood } from "./moods.js";
import type { OrblingShape } from "./shapes.js";

export { default as Orbling } from "./_.svelte";
export { default as OrblingStatus } from "./status.svelte";
export { MOODS, MOOD_NAMES, type Mood } from "./moods.js";
export { SHAPES, SHAPE_NAMES, type OrblingShape } from "./shapes.js";

/** Colors of the orb; each derives the full palette from one theme color */
type OrblingVariant = "default" | "secondary" | "destructive";

/** AI orb with a face that shows what an assistant is doing; decorative unless it gets a `label` */
export interface Props extends CompProps<"span"> {
	/** What the assistant is doing; defaults to `idle` */
	mood?: Mood;
	/** Orb colors: `default` is blue from `--chart-1`, `secondary` is grey, and `destructive` is red; `--orbling-color` overrides the base color */
	variant?: OrblingVariant;
	/** Orb outline: a preset such as `squircle` or `heart`, or a custom SVG path in a 100 by 100 box; defaults to `circle`, and `--orbling-shape` overrides it with any mask image */
	shape?: OrblingShape | (string & {});
	/** Orb diameter on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Accessible name; without it screen readers skip the orb */
	label?: string;
	/** Classes merged onto the orb */
	class?: CompProps<"span">["class"];
}

/** Status line with a small orb and the mood label, announced to screen readers */
export interface StatusProps extends CompProps<"span"> {
	/** What the assistant is doing; defaults to `idle` */
	mood?: Mood;
	/** Orb colors, as on `Orbling` */
	variant?: OrblingVariant;
	/** Orb outline, as on `Orbling` */
	shape?: OrblingShape | (string & {});
	/** Label text and gap on the shared scale; defaults to `sm` */
	size?: UiSize;
	/** Status text; defaults to the mood label, such as "Thinking…" */
	label?: string;
	/** Classes merged onto the status line */
	class?: CompProps<"span">["class"];
}

export type OrblingProps = Props;
export type OrblingStatusProps = StatusProps;
