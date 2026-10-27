export { default as Spinner } from "./_.svelte";

/** Spinning loader announced as a status; labeled "Loading" unless `aria-label` is set */
export interface Props extends CompProps<"span"> {
	/** Color of the spinner; `default` follows the surrounding text color */
	variant?: "default" | "destructive";
	/** Spinner size on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Classes merged onto the spinner */
	class?: CompProps<"span">["class"];
}

export type SpinnerProps = Props;
