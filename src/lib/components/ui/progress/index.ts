export { default as Progress } from "./_.svelte";

/** Progress bar; indeterminate when `value` is omitted or `null` */
export interface Props extends CompProps<"div"> {
	/** Completed amount from `0` to `max`; omit or pass `null` for indeterminate */
	value?: number | null;
	/** Amount that counts as complete; defaults to `100` */
	max?: number;
	/** Visual style of the track and indicator */
	variant?: "default" | "destructive";
	/** Bar thickness on the shared scale; defaults to `sm` */
	size?: UiSize;
	/** Corner radius; follows `size` when omitted */
	rounded?: UiRounded;
	/** Classes merged onto the progress bar */
	class?: CompProps<"div">["class"];
}

export type ProgressProps = Props;
