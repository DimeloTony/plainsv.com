export { default as Spinner } from "./_.svelte";

/** Spinning loader announced as a status; labeled "Loading" unless `aria-label` is set */
export interface Props extends CompProps<"span"> {
	/** Color of the spinner; `default` follows the surrounding text color and `muted` uses the muted foreground */
	variant?: "default" | "primary" | "muted" | "destructive";
	/** Spinner size on the shared scale plus `xl`, `2xl`, and `3xl` for page and panel loaders; defaults to `md` */
	size?: UiSize | "xl" | "2xl" | "3xl";
	/** Classes merged onto the spinner */
	class?: CompProps<"span">["class"];
}

export type SpinnerProps = Props;
