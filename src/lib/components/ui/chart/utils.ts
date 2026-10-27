/** A point in plot pixels */
export type Point = [x: number, y: number];

/** One cubic piece of a line from one point to the next; a straight piece puts its controls on its ends */
type Segment = [x0: number, y0: number, c1x: number, c1y: number, c2x: number, c2y: number, x1: number, y1: number];

/** End of a bar that gets the rounded corners */
export type BarEnd = "top" | "bottom" | "left" | "right" | "none";

/** Builds about `count` evenly spaced axis ticks on round numbers that cover `min` to `max`. */
export function getNiceTicks(min: number, max: number, count: number) {
	// If every value is the same: widen the range toward zero, so a flat series still gets an axis.
	if (min === max) {
		if (min > 0) min = 0;
		else if (max < 0) max = 0;
		else max = 1;
	}
	const rawStep = (max - min) / Math.max(1, count);
	const power = 10 ** Math.floor(Math.log10(rawStep));
	const step = [1, 2, 2.5, 5].map((multiple) => multiple * power).find((candidate) => candidate >= rawStep) ?? 10 * power;
	const start = Math.floor(min / step) * step;
	const stepCount = Math.round((Math.ceil(max / step) * step - start) / step);
	// Round each tick, so float steps such as 0.1 + 0.2 print cleanly.
	return Array.from({ length: stepCount + 1 }, (_, index) => Number((start + index * step).toPrecision(12)));
}

/** Splits points into pieces, with monotone curves that never overshoot the data when `curve` is `monotone`. */
function getSegments(points: Point[], curve: "linear" | "monotone"): Segment[] {
	const pieces = points.slice(1).map((point, index) => [points[index], point] as const);
	// If the line is straight or too short to curve: put the controls on the ends.
	if (curve === "linear" || points.length < 3) return pieces.map(([[x0, y0], [x1, y1]]) => [x0, y0, x0, y0, x1, y1, x1, y1]);

	// Fritsch–Carlson tangents: average the neighboring slopes, then limit them so no piece overshoots.
	const slopes = pieces.map(([[x0, y0], [x1, y1]]) => (y1 - y0) / (x1 - x0 || 1));
	const tangents = points.map((_, index) => {
		if (index === 0) return slopes[0];
		if (index === points.length - 1) return slopes[index - 1];
		return slopes[index - 1] * slopes[index] <= 0 ? 0 : (slopes[index - 1] + slopes[index]) / 2;
	});
	for (const [index, slope] of slopes.entries()) {
		// If the piece is flat: flatten both ends, so the curve holds still.
		if (slope === 0) {
			tangents[index] = 0;
			tangents[index + 1] = 0;
			continue;
		}
		const a = tangents[index] / slope;
		const b = tangents[index + 1] / slope;
		const length = a * a + b * b;
		if (length > 9) {
			tangents[index] = (3 / Math.sqrt(length)) * a * slope;
			tangents[index + 1] = (3 / Math.sqrt(length)) * b * slope;
		}
	}
	return pieces.map(([[x0, y0], [x1, y1]], index) => {
		const third = (x1 - x0) / 3;
		return [x0, y0, x0 + third, y0 + tangents[index] * third, x1 - third, y1 - tangents[index + 1] * third, x1, y1];
	});
}

/** Writes pieces as path commands, without the starting move. */
function toCommands(segments: Segment[]) {
	return segments.map(([, , c1x, c1y, c2x, c2y, x1, y1]) => `C${c1x},${c1y} ${c2x},${c2y} ${x1},${y1}`).join("");
}

/** Reverses pieces, so a path can run back along them. */
function reverseSegments(segments: Segment[]): Segment[] {
	return segments.toReversed().map(([x0, y0, c1x, c1y, c2x, c2y, x1, y1]) => [x1, y1, c2x, c2y, c1x, c1y, x0, y0]);
}

/** Builds the path of a line through the points. */
export function getLinePath(points: Point[], curve: "linear" | "monotone") {
	// If there are no points: draw nothing.
	if (!points.length) return "";
	const [[x, y]] = points;
	return `M${x},${y}${toCommands(getSegments(points, curve))}`;
}

/** Builds the path of an area between a top line and a bottom line with matching x positions. */
export function getAreaPath(top: Point[], bottom: Point[], curve: "linear" | "monotone") {
	// If there are no points: draw nothing.
	if (!top.length) return "";
	const [[x, y]] = top;
	const [lastX, lastY] = bottom.at(-1) ?? top[0];
	return `M${x},${y}${toCommands(getSegments(top, curve))}L${lastX},${lastY}${toCommands(reverseSegments(getSegments(bottom, curve)))}Z`;
}

/** Builds a bar path with rounded corners on one end and square corners on the baseline end. */
export function getBarPath(x: number, y: number, width: number, height: number, radius: number, end: BarEnd) {
	const isVertical = end === "top" || end === "bottom";
	// The radius never passes half the bar's thickness or its full length, so short bars stay bars.
	const r = Math.max(0, Math.min(radius, isVertical ? width / 2 : height / 2, isVertical ? height : width));
	const right = x + width;
	const bottom = y + height;
	if (end === "top") return `M${x},${bottom}V${y + r}A${r},${r} 0 0 1 ${x + r},${y}H${right - r}A${r},${r} 0 0 1 ${right},${y + r}V${bottom}Z`;
	if (end === "bottom") return `M${x},${y}H${right}V${bottom - r}A${r},${r} 0 0 1 ${right - r},${bottom}H${x + r}A${r},${r} 0 0 1 ${x},${bottom - r}Z`;
	if (end === "right") return `M${x},${y}H${right - r}A${r},${r} 0 0 1 ${right},${y + r}V${bottom - r}A${r},${r} 0 0 1 ${right - r},${bottom}H${x}Z`;
	if (end === "left") return `M${right},${y}V${bottom}H${x + r}A${r},${r} 0 0 1 ${x},${bottom - r}V${y + r}A${r},${r} 0 0 1 ${x + r},${y}Z`;
	return `M${x},${y}H${right}V${bottom}H${x}Z`;
}

/** Converts an angle in radians, clockwise from the right, and a distance from the center to a point. */
export function getPolarPoint(centerX: number, centerY: number, radius: number, angle: number): Point {
	return [centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle)];
}

/** Builds a ring slice from `startAngle` clockwise to `endAngle`; an inner radius of 0 draws a pie slice, and `endRadius` rounds only the end corners. */
export function getSectorPath(centerX: number, centerY: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number, endRadius = 0) {
	// A full circle cannot be one arc, so stop a hair short of it.
	const sweep = Math.min(Math.max(0, endAngle - startAngle), Math.PI * 2 - 1e-4);
	const end = startAngle + sweep;
	// The corners never round past half the ring's thickness or the arc's length.
	const r = Math.max(0, Math.min(endRadius, (outerRadius - innerRadius) / 2, sweep * outerRadius, innerRadius > 0 ? sweep * innerRadius : Infinity));
	const point = (radius: number, angle: number) => getPolarPoint(centerX, centerY, radius, angle).join(",");
	const outerEnd = end - r / outerRadius;
	const largeOuter = outerEnd - startAngle > Math.PI ? 1 : 0;
	let path = `M${point(outerRadius, startAngle)}A${outerRadius},${outerRadius} 0 ${largeOuter} 1 ${point(outerRadius, outerEnd)}`;
	// Round the end with curves through its true corners.
	path += r > 0 ? `Q${point(outerRadius, end)} ${point(outerRadius - r, end)}` : "";
	// If there is no hole: close through the center, as a pie slice.
	if (innerRadius <= 0) return `${path}L${centerX},${centerY}Z`;
	const innerEnd = end - r / innerRadius;
	const largeInner = innerEnd - startAngle > Math.PI ? 1 : 0;
	path += r > 0 ? `L${point(innerRadius + r, end)}Q${point(innerRadius, end)} ${point(innerRadius, innerEnd)}` : `L${point(innerRadius, end)}`;
	return `${path}A${innerRadius},${innerRadius} 0 ${largeInner} 0 ${point(innerRadius, startAngle)}Z`;
}

/** Reads a field as a number; anything else, such as a missing value, becomes `NaN`. */
export function toNumber(value: unknown) {
	return typeof value === "number" ? value : typeof value === "string" && value.trim() !== "" ? Number(value) : NaN;
}
