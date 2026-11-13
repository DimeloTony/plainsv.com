/** Preset outline of the orb */
export type OrblingShape = "circle" | "squircle" | "hexagon" | "diamond" | "heart" | "star" | "blob";

/** SVG path of every preset except `circle`, drawn in a 100 by 100 box with a 4 unit margin that the rounded stroke fills */
export const SHAPES: Record<Exclude<OrblingShape, "circle">, string> = {
	squircle: "M50 4 C86 4 96 14 96 50 C96 86 86 96 50 96 C14 96 4 86 4 50 C4 14 14 4 50 4 Z",
	hexagon: "M50 4 L89.8 27 L89.8 73 L50 96 L10.2 73 L10.2 27 Z",
	diamond: "M50 4 L96 50 L50 96 L4 50 Z",
	heart: "M50 92 C20 72 4 56 4 34 C4 18 16 8 29 8 C39 8 46 14 50 22 C54 14 61 8 71 8 C84 8 96 18 96 34 C96 56 80 72 50 92 Z",
	star: "M50 7 L65.3 32 L93.7 38.8 L74.7 61 L77 90.2 L50 79 L23 90.2 L25.3 61 L6.3 38.8 L34.7 32 Z",
	blob: "M52 6 C72 5 91 17 94 38 C97 60 87 82 66 91 C46 99 21 90 11 71 C3 54 7 31 22 17 C31 9 41 6 52 6 Z",
};

/** Shape names in display order */
export const SHAPE_NAMES: OrblingShape[] = ["circle", "squircle", "hexagon", "diamond", "heart", "star", "blob"];

/** Returns true when a shape is one of the presets. */
export function isPresetShape(shape: string): shape is OrblingShape {
	return shape === "circle" || shape in SHAPES;
}

/** Returns the CSS mask image for a preset name or a custom SVG path, or `undefined` for the default circle. */
export function shapeMask(shape: string) {
	const isPreset = isPresetShape(shape);
	// If the shape is the circle: let the CSS disc mask apply.
	if (isPreset && shape === "circle") return undefined;
	// Presets round their corners with a stroke; custom paths render exactly as drawn.
	const path = isPreset && shape !== "circle" ? SHAPES[shape] : shape;
	const stroke = isPreset ? ` stroke="black" stroke-width="8" stroke-linejoin="round"` : "";
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="${path.replaceAll('"', "")}" fill="black"${stroke}/></svg>`;
	return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
