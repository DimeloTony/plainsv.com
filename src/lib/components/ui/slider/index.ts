export { default as Slider } from "./_.svelte";

/** Slider with one draggable thumb per value; two values make a range */
export interface Props extends CompProps<"div"> {
	/** Thumb values from `min` to `max`, in order; supports `bind:value` */
	value?: number[];
	/** Starting values when `value` is not set; defaults to `[min]` */
	defaultValue?: number[];
	/** Lowest value; defaults to `0` */
	min?: number;
	/** Highest value; defaults to `100` */
	max?: number;
	/** Amount each value snaps to; defaults to `1` */
	step?: number;
	/** Direction of the track; `vertical` fills its parent's height */
	orientation?: "horizontal" | "vertical";
	/** Dims the slider and blocks pointer and keyboard input */
	disabled?: boolean;
	/** Form field name; each value submits as a hidden input with this name */
	name?: string;
	/** Accessible name for each thumb, such as `["Minimum", "Maximum"]`; falls back to `aria-label` */
	thumbLabels?: string[];
	/** Called with the new values on every change while dragging or typing */
	onValueChange?: (value: number[]) => void;
	/** Called with the final values when a drag ends or a key changes them */
	onValueCommit?: (value: number[]) => void;
	/** Visual style of the range and thumbs */
	variant?: "default" | "destructive";
	/** Track thickness and thumb size on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Corner radius of the track and thumbs; follows `size` when omitted */
	rounded?: UiRounded;
	/** Classes merged onto the slider */
	class?: CompProps<"div">["class"];
}

export type SliderProps = Props;
